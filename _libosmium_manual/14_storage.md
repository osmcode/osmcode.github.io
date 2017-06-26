---
chapter: 14
title: Storage
---

Osmium offers serveral different indexes suitable for different
use cases. You have to choose a suitable index type. See the
[Osmium Concepts Manual](/osmium-concepts/#indexes) for a list of
available index types.

If you want to choose the index type on runtime, you can use
`osmium::index::MapFactory`. The following code listing shows its
usage. `location_index_type` is a variable you either set based on the
preferences of the user of your program or based on your own estimates (e.g.
file size).

``` c++
#include <osmium/index/map.hpp>

using index_type = osmium::index::map::Map<osmium::unsigned_object_id_type, osmium::Location>;
using location_handler_type = osmium::handler::NodeLocationsForWays<index_type>;
std::string location_index_type = "sparse_mem_array";
const auto& map_factory = osmium::index::MapFactory<osmium::unsigned_object_id_type, osmium::Location>::instance();
auto location_index = map_factory.create_map(location_index_type);
location_handler_type location_handler{*location_index};
```

## The `ItemStash` class

Occasionally you want to store OSM objects in main memory and find them again
later. To store the data you can use a `Buffer` (see chapter 8), but that is
sometimes not enough. The `ItemStash` class might help.

An instance of the `ItemStash` class is used to keep any number of `Items`
in memory. Usually those items are OSM objects, but it will work for any kind
of item that can also be stored in a buffer. In fact, internally `ItemStash`
uses an auto-growing buffer for this.

You add objects using `add_item()` which returns an opaque handle that can be
used to later get the item back (using `get_item()`) or remove the item using
`remove_item()`. The handle remains valid regardless of the operations you
are doing on the stash (until you remove an item which invalidates the handle).
This is different than any pointers or references into the `ItemStash` memory
which are invalidated by calls to `add_item()`.

```c++
osmium::ItemStash stash;

const osmium::OSMObject& object = ...;
auto handle = stash.add_item(object);

// ...

const auto& object = stash.get_item<osmium::OSMObject>(handle);

// ...

stash.remove_item(handle);
```

The `ItemStash` will internally manage the memory needed and occasionally do a
garbage collection which will purge all removed items. You can call
`garbage_collect()` to force this.

Note that the `ItemStash` does not keep any indexes to find objects by ID or by
other means (for instance tags). It only finds the items again using the
handles. It is your job to keep the handles somewhere and index them if
necessary. Handles are small value-type objects, feal free to copy them around.
A default constructed `osmium::ItemStash::handle_type` can be used as an
invalid handle.

