---
chapter: 6
title: Indexes
---

Osmium is built around the idea that a lot of the things you want to do with
OSM data can be done one OSM object at the time without having all (or large
parts of) the OSM data in memory or in some kind of database. But there are
many things you can not do this way. You do need some kind of storage to hold
the data and some indexes to access it efficiently. Osmium provides several
class templates that implement different types of indexes.

## Index Types

Osmium provides indexes modelled after the STL map and multimap classes,
respectively. These classes are to be found in the `osmium::index::map` and
`osmium::index::multimap` namespaces.

### Map Index

Often we need some small, fixed amount of data stored for each OSM object.
Read and write access is by ID only. Typical use cases include...

* storage of node locations where for each node ID we store the longitude and
  latitude of that node.
* storing the offset of an OSM object in a buffer.
* a lookup table that gives you for each node ID all IDs of the way (or ways)
  that include this node.

### Storage types

There are different strategies of storing this data efficiently and there are
several sub-classes of the `Map` and `Multimap` classes that use different
strategies. It is important that you understand the differences and use the
class that is most appropriate for your case.

The differences can be understood along different axes:

First, the question is whether the ID space is dense or not. If you are using
the full planet data or large portions (such as entire continents) thereof,
your ID space is dense, ie most of the possible IDs are actually present in the
index. If you are only using small extracts (even with whole countries in
them), your ID space is sparse, ie most of the possible IDs are not present in
the index. For dense indexes data is often best stored in a kind of array
indexed by the ID. For sparse indexes there are several other possibilities.
The first component of the index type is either `dense` or `sparse` to show
for which data it is suitable.

The second question is whether you have enough RAM to hold all the data in the
index. Of course it is more efficient to keep the index in RAM, but if you
don't have enough, you need to use a disk-based index. The second component of
the index type is either `mem` for in-memory storage or `file` for storage on
disk. The third option is `mmap` which also stores the data in memory but uses
the `mmap` and `mremap` system calls. This allows for dynamic resizing of the
storage area without the overhead of copying data around and without the need
for twice the memory while data is copied into another, larger buffer. This
option is only available on Linux systems, not on OSX and Windows which don't
provide the necessary `mremap` system call.

Another issue to keep in mind is whether your input data is sorted and/or if
you need to interleave reads and writes to the index. Some indexes are
automatically sorted, this makes adding items to the index more expensive,
but works better when the input data is not sorted or if you are dealing with
updates. OSM files normally come pre-sorted, first all nodes sorted by ID, then
all ways sorted by ID, then all relations sorted by ID. In that case you can
use an index that doesn't sort its data which is probably faster. But if you
ever need to sort the data, it is an extra, expensive step.

#### List of map index classes

Different index formats are suitable for different sized OSM files. In the
descriptions below the following sizes are used. Note that these are only rough
numbers shown as indication. If you are not sure, try out which index format
works best for your specific case as there are many factors playing into this.

* Small OSM files: city or small country sized extracts (<500 MBytes PBF)
* Medium OSM files: medium or large country sized extracts (<5 GBytes PBF)
* Large OSM files: planet file or continent sized extracts (>5 GBytes PBF)

`sparse_mem_map`: Uses the STL `std::map` class. Use for unsorted data.

`sparse_mem_table`: Uses the `sparsetable` class from the Google SparseHash
library. This uses a lot of RAM for small files, but is very space efficient
for medium sized extracts (for instance countries). It is slower than all
other (memory based) formats.

`sparse_mem_array`: Use instead of `sparse_mmap_array`, if you can't use that
(ie on OSX and Windows).

`dense_mem_array`: Use instead of `dense_mmap_array`, if you can't use that
(ie on OSX and Windows). You'll need a lot of memory!

`sparse_mmap_array`: Stores the data in a (sorted) array with (ID, value)
pairs. Most space efficient format for small or medium sized OSM files.

`dense_mmap_array`: Best format for large OSM files if you have enough memory.

`sparse_file_array`: Use if you don't have much memory or if you need
persistent storage.

`dense_file_array`: Use for large OSM files if you don't have enough memory.


#### List of multimap index classes

