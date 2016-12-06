---
chapter: 12
title: Collectors
---

If you write your own handler and get a relation callback, you cannot
directly access the members of the relation. The only information you can
get is the type, ID and role of the members.

To access the tags and geometry of relations members, you have to write your
own collector. (If you just want to read multipolygons and boundary relations,
head over to the subsection [MultipolygonCollector](#multipolygoncollector)
of this manual because Osmium provides a special `MultipolygonCollector` for
that purpose.)


## Write Your Own Collector

A collector is a class which is derived from `osmium::relations::Collector`.

By default, it collects all relations and all their members. You can change
this behaviour by overwriting following methods. See the
[class documentation](http://docs.osmcode.org/libosmium/latest/classosmium_1_1relations_1_1Collector.html)
of the `Collector` class for details.

* `bool keep_relation(const osmium::Relation&) const`
* `bool keep_member(const osmium::relations::RelationMeta&, const
osmium::RelationMember&) const`

Your collector has to implement at least `void
complete_relation(osmium::relations::RelationMeta& relation_meta)`. It is a
callback function and called once a relation and all its members are complete.
You can do there with the relation what ever you want to do. The following
example shows how to access the relation, its members and their tags and references.

``` c++
void MyRelCollector::complete_relation(osmium::relations::RelationMeta& relation_meta) {
    const osmium::Relation& relation = this->get_relation(relation_meta);
    std::cout << "Working on relation "
              << relation.id()
              << " which has following tags:\n";

    for (const osmium::Tag& tag : relation.tags()) {
        std::cout << tag.key() << " = " << tag.value() << '\n';
    }

    for (const auto& member : relation.members()) {
        switch (member.type()) {
            case osmium::item_type::node : {
                std::cout << "member node "
                          << member.ref()
                          << " with role "
                          << member.role()
                          << '\n';
                const auto& node = static_cast<const osmium::Node&>
                    (this->get_member(this->get_offset(member.type(), member.ref())));
                std::cout << "at "
                          << node.location()
                          << '\n';
                }
                break;
            case osmium::item_type::way :
                std::cout << "member way "
                          << member.ref()
                          << " with role "
                          << member.role()
                          << '\n';
                // accessing tags, node references and node locations
                // works like shown above with nodes, just cast to a
                // different class
                break;
            case osmium::item_type::relation :
                std::cout << "member relation "
                          << member.ref()
                          << " with role "
                          << member.role()
                          << '\n';
                break;
        }
    }
}
```


## Incomplete Relations

If you work with extracts of the planet, your extract will usually not have
all relations complete, i.e. some members of some relations are missing
because they are located beyond the boundary of the extract. These relations
will not be handled by `complete_relation(osmium::relations::RelationMeta&)`.
If you still want to work with these relations, you can add a method to your
collector which handles these relations after everything has been finished.
You have to call this method manually.

``` c++
void MyRelCollector::handle_incomplete_relations() {
    for (auto* relation : this->get_incomplete_relations()) {
        for (const auto& member : relation.members()) {
            std::pair<bool, size_t> offset_pair =
                get_availability_and_offset(member.type(), member.ref());
            if (offset_pair.first) {
                // do what you would do with a relation
            }
        }
    }
}
```

The example above avoids a common pitfall when working with incomplete
relations. Instead of using
`osmium::relations::Collector::get_offset(size_t)`, you should use
`std::pair<bool, size_t> osmium::relations::Collector::get_availability_and_offset(osmium::item_type, osmium::object_id_type)`
to ensure that the member is available. Otherwise your program will fail with
`Assertion 'range.begin()->is_available()' failed`.


## MultipolygonCollector

[Multipolygons](https://wiki.openstreetmap.org/wiki/Relation:multipolygon) are
a type of relations at OpenStreetMap (they are tagged with
`type=multipolygon`) to model areas with inner rings and areas with multiple
outer rings. Osmium provides a collector for multipolygons and
[boundary](https://wiki.openstreetmap.org/wiki/Relation:boundary) relations
(which work like multipolygons but are tagged with `type=boundary` called
`osmium::area::MultipolygonCollector`.

There are lots of examples how to use a `MultipolygonCollector`, e.g.

* [osmium_area_test.cpp](https://github.com/osmcode/libosmium/blob/master/examples/osmium_area_test.cpp)
at Osmium examples
* [amenity_list.cpp](https://github.com/osmcode/osmium-contrib/blob/master/amenity_list/amenity_list.cpp)
at osmium-contib

