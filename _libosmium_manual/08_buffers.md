---
chapter: 8
title: Buffers
---

OSM entities have to be stored somewhere in memory. They are complex objects
containing arbitrary number of tags, relations can have any number of members
etc. If we handled those objects like any normal C++ object, creating them
would take lots of small memory allocations and many pointer indirections to
get at all the parts of the data. Instead OSM entities are created inside
so-called *buffers*. Buffers can have a fixed size or grow as needed. New objects
can be added at the end, and they are stored inside those buffers in a reasonably
space-efficient manner while still being accessible easily and quickly.

Buffers can be moved around between different parts of your program and even
between threads. The content of buffers can even be written to disk as it is
and read back in and immediately used "as is" without any serializaton or
de-serialization step needed.

But all of this has one draw-back: It is slightly more complicated to create
those objects and they can not just be instantiated on the stack.

Buffers can not be copied, because it is unclear who would be responsible for
the memory then. But they can be moved.

## Creating a Buffer

Buffers exist in two different flavours, those with external memory management
and those with internal memory management. If you already have some memory with
data in it (for instance read from disk), you create a Buffer with external
memory managment. It is your job then to free the memory once the buffer isn't
used any more. If you don't have some memory space already, you can create a
Buffer object and have it manage the memory internally. It will dynamically
allocate memory and free it again after use.

To create a buffer from existing memory you give the address and size to the
constructor:

``` c++
const int buffer_size = 10240;
void* mem = malloc(buffer_size);
osmium::memory::Buffer buffer{mem, buffer_size};
```

This will create an empty buffer with `buffer_size` bytes available for use.

If the new buffer already contains some data, you can add the number of bytes
already in use as a third parameter to the constructor:

``` c++
void* mem = malloc(buffer_size);
int num = read(0, mem, buffer_size);
osmium::memory::Buffer buffer{mem, buffer_size, num};
```

To create a buffer with internal memory-management you construct it with the
number of bytes it should have initially and a flag that tells Osmium whether
it should automatically grow the buffer if it is needed:

``` c++
const int buffer_size = 10240;
osmium::memory::Buffer buffer{buffer_size, osmium::memory::Buffer::auto_grow::yes};
osmium::memory::Buffer buffer{buffer_size, osmium::memory::Buffer::auto_grow::no};
```

## Adding Items to the Buffer

You cannot create OSM objects on the stack, they always have to be stored in
buffers. To create OSM objects special "builder" classes are used:

``` c++
void add_tags(osmium::memory::Buffer& buffer, osmium::builder::Builder* builder) {
    osmium::builder::TagListBuilder tl_builder{buffer, builder};
    tl_builder.add_tag("amenity", "restaurant");
}

const int buffer_size = 10240;
osmium::memory::Buffer node_buffer{buffer_size, osmium::memory::Buffer::auto_grow::yes};
{
    osmium::builder::NodeBuilder builder{node_buffer};
    builder.add_user("foo");
    osmium::Node& obj = builder.object();
    obj.set_id(1);
    obj.set_version(1);
    obj.set_changeset(5);
    obj.set_uid(140);
    obj.set_timestamp("2016-01-05T01:22:45Z");
    obj.set_location(osmium::Location{9.0, 49.0});
    add_tags(node_buffer, &builder);
}
node_buffer.commit();
// do something with the buffer (e.g. write to file)
```

Building OSM entities and adding them to a buffer has some pitfalls. A buffer has to be
aligned (padding with zeros) before committing. If you try to commit a buffer which is
not aligned, you program will fail with `Assertion 'buffer.is_aligned()' failed`.

The addition of the attributes `version`, `changeset`, `uid` and `timestamp` may be
omitted but you have to add the attribute `user` in order to have an aligned buffer.

If the object has references to other OSM objects (tags of an OSM object, node
references of a way, members of a relation), you need additional builders for
these reference lists. The destructor of one of these builders has to be called
before another builder writes data to the buffer.

``` c++
void build_way(osmium::memory::Buffer& buffer) {
    osmium::builder::WayBuilder way_builder{buffer};
    way_builder.object().set_id(1);
    // set attributes version, changeset, uid and timestamp (all optional)
    way_builder.add_user("foo");
    {
        osmium::builder::WayNodeListBuilder wnl_builder{buffer, &way_builder};
        wnl_builder.add_node_ref(osmium::NodeRef (1, osmium::Location()));
        wnl_builder.add_node_ref(osmium::NodeRef (2, osmium::Location()));
    }
    add_tags(buffer, way_builder);
}

const int buffer_size = 10240;
osmium::memory::Buffer way_buffer{buffer_size, osmium::memory::Buffer::auto_grow::yes};
build_way(way_buffer);
way_buffer.commit();
```

This will create only a way, the nodes have to be created separately.

Building relations works similar to building ways. You use a
`osmium::builder::RelationBuilder` instead of a `WayNodeListBuilder`. The
instance of `RelationBuilder` has to go out of scope before the
`TagListBuilder` writes the tags to the buffer and vice versa.

## Handling a Full Buffer

If a buffer becomes full, there are three different things that can happen:

If the buffer was created with `auto_grow::yes`, it will reserve more memory
on the heap and double its size. This will happen without the client code
noticing, but it will invalidate any pointer pointing into the buffer. This
is the same behaviour a `std::vector` has so it should be familiar to C++
programmers.

If the buffer was created with `auto_grow::no` (or if it is a buffer with
external memory management), the exception `osmium::memory::BufferIsFull` will
be thrown. In this case you have to catch the exception, either grow the buffer
or create a new one. If you grow the buffer you can keep going at the point
where you left off. If you start a new one, the last object you were writing to
the buffer when the exception was thrown was not committed and you have to
write it again into the new buffer.

As a third option you can set a *callback* functor that wil be called when
the buffer is full. The functor takes a reference to the buffer as argument
and returns void:

``` c++
void full(osmium::memory::Buffer& buffer) {
    std::cout << "Buffer is full\n";
}

osmium::memory::Buffer buffer{buffer_size, false};
buffer.set_full_callback(full);
```


