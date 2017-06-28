---
chapter: 12
title: Working with relations
---

Working with relations is more complicated than working with just nodes and
ways. But relations contain a lot of interesting data, first and foremost the
multipolygon relations needed for proper area support. To work with relations
you usually have to somehow combine the relation objects with their member
objects. Libosmium contains a lot of building blocks that can help you do that.

One often used approach looks like this: You read the OSM file containing the
data you want to work on (either the planet or some extract) twice. On the
first pass only relations are read and kept in main memory. On the second
pass nodes, ways, and relations are read and matched to the in-memory relations
they are a member of. This approach works quite well, because a) libosmium can
read OSM data really fast, so reading a file twice isn't as expensive as you
might imagine, and b) because there aren't that many relations in the OSM data
compared to the number of nodes and ways. You could keep the nodes and ways
in memory to later match them to the relations, but this would need a lot more
memory. And it can't handle the case properly where there are relations that
are members of other relations, because you do not know that you might need a
member relation before you see the parent relation.

This chapter describes how you can use the `RelationsManager` class to
implement this approach in your code that can handle any kind of relation
you like. It will then describe how you can use the `MultipolygonManager`
that specifically does this for multipolygon relations. And after that we
look at the classes used behind the scenes if you need to go deeper.

Note that there are classes used in earlier version of libosmium for similar
work, namely the `osmium::relations::Collector` and
`osmium::area::MultipolygonCollector` classes. They are still available, but
deprecated now. Please use the *manager* classes instead.

## Using the RelationsManager

The `RelationsManager` class handles the whole process outlined above of
storing relations in memory and later matching OSM member objects to their
parent relations. Once all the pieces of a relation have been assembled it
will call your code to actually do something with the relation. Internally
it uses several other classes described in the next chapter.

To use the `RelationsManager` create your own class deriving from it. The
`RelationsManager` uses the [Curiously recurring template pattern
(CRTP)](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern)
to call into your code.

```c++
#include <osmium/relations/relations_manager.hpp>

class YourManager : public osmium::relations::RelationsManager<YourClass, true, true, false> {
    ...
};
```

As you can see the first template parameter of the `RelationsManager` is your
class, the next three template parameters tell the RelationsManager whether
you are interested in member nodes, ways, and/or relations, respectively. So
the code above says: I only want to handle members of type node and way, but
not members of type relation. If a parameter is set to `false` the code in
the class will behave as if there are no objects of the given class in the
input file, your code will never see them.

Usually you want to overwrite several functions in this class that tell
the `RelationsManager` how to behave:

The `new_relation()` function is called for every relation encountered in the
input data. Usually this function should first decide whether your code is
interested in this relation, typically by looking at the `type` tag. You can
then do any processing on the relation that doesn't require the actual member
objects to be available. To "express interest" in this relation, return `true`,
the relation is then "remembered" by the `RelationsManager` for further
processing, otherwise the `RelationsManager` ignores this relation.

```c++
bool new_relation(const osmium::Relation& relation) noexcept {
    return relation.tags().has_tag("type", "route");
}
```

If you have expressed an interest in a relation, the `new_member()` function is
called for each member. Again, you should first decide whether you are
interested in this member, for instance depending on its type or role. Remember
that at this time you only have the member type, id, and role available, not
the whole object. You can then do any processing you need and return `true` or
`false` depending on whether you are interested in this member. The default
is to simply return `true` for all members which is often enough because you
already specified which types of members you are interested in using the
template parameters of the `RelationsManager` class.

```c++
bool new_member(const osmium::Relation& /*relation*/, const osmium::RelationMember& /*member*/, std::size_t /*n*/) noexcept {
    return true;
}
```

These two functions are called during the first pass through the data. All
remaining functions are called during the second pass. The most important
is the `complete_relation()` function. It is called for each relation you
have expressed an interest in once all the members have been found in the
input file. So when this is called you have access to the relation object
as well as all the member objects.

Here is an example:

```c++
void complete_relation(const osmium::Relation& relation) {
    // Iterate over all members
    for (const auto& member : relation.members()) {
        // member.ref() will be 0 for all members you are not interested
        // in. The objects for those members are not available.
        if (member.ref() != 0) {
            // Get the member object
            const osmium::OSMObject* obj = this->get_member_object(member);

            // If you know which type you have you can also use any of these:
            const osmium::Node* node         = this->get_member_node(member.ref());
            const osmium::Way* way           = this->get_member_way(member.ref());
            const osmium::Relation* relation = this->get_member_relation(member.ref());
        }
    }
}
```

The pointers returned from the `get_member_*` functions will be `nullptr` if
the member is not available. If you do the `member.ref() != 0` check first,
all members are available and you don't need to check for `nullptr`.

You have to do all the processing of your relation in this function. Once you
return from this function, the relation and its members will be removed from
memory to make space for more data. If you will need the data again, you have
to store it yourself somewhere.

The `RelationsManager` keeps an output `Buffer` for you. You can write objects
into this buffer, later to be used in your application or written out to disk.
Say you want to write out all member objects with a `building` tag:

```c++
void complete_relation(const osmium::Relation& relation) {
    for (const auto& member : relation.members()) {
        if (member.ref() != 0) {
            const auto& obj = this->member_database(member.type()).get(member.ref()));
            if (obj.tags().has_tag("building") {
                this->buffer().add_item(obj);
                this->buffer().commit();
            }
        }
    }
}
```

We'll see later where this buffer ends up and how you can access it.

There are a bunch more functions that you can overwrite if you need to. The
functions

* `before_node()`
* `before_way()`
* `before_relation()`

are called for each node, way, or relation, respectively, before the member
handling is done. The functions

* `after_node()`
* `after_way()`
* `after_relation()`

are called for each node, way, or relation, respectively, after the member
handling is done. The functions

* `node_not_in_any_relation()`
* `way_not_in_any_relation()`
* `relation_not_in_any_relation()`

are called when the node, way, or relation isn't a member in any relation.

Note that these functions are only called if you have set the corresponding
template parameters of the `RelationsManager` to true.

Here is the sequence of processing for each object:

* Call `before_node/way/relation()`
* Have we expressed any interest in this object for any relation?
  * If yes, store the object in memory. Call `complete_relation()` for all
    relations that were "completed" by this object, ie where this object was
    the last missing member.
  * If no, call `node/way/relation_not_in_any_relation()`
* Call `after_node/way/relation()`

Now that you have customized your class, you can use it like this:

```c++
int main(int argc, char* argv[]) {
    // You'll need some OSM input file
    osmium::io::File input_file{argv[1]};

    // Instantiate your manager class
    YourManager manager;

    // First pass through the file
    osmium::relations::read_relations(input_file, manager);

    // Second pass through the file
    osmium::io::Reader reader{input_file};
    osmium::apply(reader, manager.handler());

    // Access data in output buffer
    osmium::memory::Buffer = manager.read();
    ...
}
```

If your manager stores its results internally in some way, this is enough.
If your manager didn't write any data into the output buffer or only few
objects, the code above will do. But if the output buffer can grow too large,
you have to handle it.

## Using the Output buffer

The `RelationsManager` has an internal instance of the `CallbackBuffer` class
(see chapter 8). In the class derived from the RelationsManager you use the
`buffer()` function to get access to its internal buffer. You can add objects
to this buffer as explained above.

The `RelationsManager::handler()` function sets the callback for this buffer.
Your callback function is called whenever the internal buffer is full and
you must do something with the buffer from there, for instance write it
out to disk.

```c++
    // Second pass through the file
    osmium::io::Reader reader{input_file};
    osmium::apply(reader, manager.handler([&](osmium::memory::Buffer&& buffer){
        // This will be called whenever the buffer is "full" (see below).
        // Handle the buffer here.
    }));
}
```

## Incomplete Relations

If you work with extracts of the planet, your extract will usually not have all
relations complete, i.e. some members of some relations are missing because
they are located beyond the boundary of the extract. For these relations you
will never get a call to `complete_relation()`. If you still want to see these
relations, call the `for_each_incomplete_relation()` function on the manager:

``` c++
manager.for_each_incomplete_relation([&](const osmium::relations::RelationHandle& handle){
    // Access relation from handle:
    const osmium::Relation& relation = *handle;

    // Access members
    for (const auto& member : handle->members()) {
        if (member.ref() == 0) {
            // we did not express interest in the member
        } else {
            const auto* object = get_object(member);
            if (object == nullptr) {
                // member was not in input data
            } else {
                // member was in input data
            }
        }
    }
    // do something with the relation
});
```

The `RelationHandle` works a bit like a pointer giving you access to the
underlying `Relation` using `operator*()` and `operator->()`.


## MultipolygonManager and MultipolygonManagerLegacy

[Multipolygons](https://wiki.openstreetmap.org/wiki/Relation:multipolygon) are
a type of relation at OpenStreetMap (they are tagged with
`type=multipolygon`) to model areas with inner rings and areas with multiple
outer rings. Osmium provides a relations manager for multipolygons and
[boundary](https://wiki.openstreetmap.org/wiki/Relation:boundary) relations
(which work like multipolygons but are tagged with `type=boundary` called
`osmium::area::MultipolygonManager`.

If you are working with older OSM data (before about June 2017) you have to
take old-style multipolygons into account. They are not supported by the
`osmium::area::MultipolygonManager` class, but you can use the
`osmium::area::MultipolygonManagerLegacy` class instead.

There are lots of examples how to use a `MultipolygonManager`, e.g.

* [`osmium_area_test.cpp`](https://github.com/osmcode/libosmium/blob/master/examples/osmium_area_test.cpp)
at Osmium examples
* [OSM Area Tools](https://github.com/osmcode/osm-area-tools)


## If the RelationsManager is not enough

The `RelationsManager` class has a lot of built-in flexibility allowing you
to change its functionality by overriding many of its functions in a derived
class. If this is not enough, you can use the following classes as a basis
for your own implementation. Look the `RelationsManager` code as an example
on how they are used and take it from there.

* The `RelationsManagerBase` class is the base class of the `RelationsManager`
  class. It mostly is a convenient container for the `ItemStash`,
  `RelationsDatabase`, `MembersDatabase` and `CallbackBuffer` classes, but
  it doesn't contain much more.
* The `ItemStash` (see chapter XXX) is used to store relations and member
  objects in memory.
* The `RelationsDatabase` is used to keep track of all relations we are
  interested in. It uses the `ItemStash` for internal storage.
* The `MembersDatabase` is used to keep track of all member objects we are
  interested in. It must always be used together with a `RelationsDatabase`.
  It uses the `ItemStash` for internal storage.

