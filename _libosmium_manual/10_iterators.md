---
chapter: 10
title: Iterators
---

Every C++ programmer is familiar with iterators and their flexibility. There is
no reason we couldn't take advantage of that and of the many algorithms
supplied by the STL. So libosmium supports several different kinds of
iterators to access OSM data. You can iterate over all OSM objects in a buffer,
or over all objects from a data source (usually a file), or over a bunch of
pointers to OSM objects, and there are output iterators to write to files, too.
All these different iterators can be used consistently and easily from your
code without having to know much about what's underneath. And because they work
just like STL iterators do, you can use all the algorithms from the STL.

Some of these iterators will keep track of underlying buffers and make sure the
buffers and the data in them stay around as long as there is an iterator
pointing to it. This adds some overhead but makes using the data much easier.

## Accessing Data in Buffers

Buffers containing OSM entities support the usual `begin()`, `end()`, `cbegin()`,
and `cend()` functions:

``` c++
osmium::memory::Buffer buffer = ...;

auto it = buffer.begin();
auto end = buffer.end();

for (; it != end; ++it) {
    std::cout << it->type() << "\n";
}
```

Of course you can also use the C++11 `for` loop:

``` c++
for (auto& item : buffer) {
    ...
}
```


## Accessing Data from Files

``` c++
osmium::io::Reader reader{"input.osm"};
osmium::io::InputIterator<osmium::io::Reader> in{reader};
osmium::io::InputIterator<osmium::io::Reader> end;
```

