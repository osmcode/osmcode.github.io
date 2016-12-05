---
title: 8. Handlers
---

# {{ page.title }}

If you process OSM data with libosmium to do something (e.g. convert to a different format,
import into a database, build a routing graph), you will usually create one or more *handlers*.

Handlers are created by deriving a class from `osmium::handler::Handler` which defines
methods for all OSM object types, i.e. a method `node(const osmium::Node&)` for nodes, a
method `way(const osmium::Way&)` for ways etc.
You have to implement the methods for the object types you want to process. Libosmium
will read the data, feed it object by object into the handler and you can do there whatever
you want. Your handler may have temporary storage, e.g. if you want to sum up the length of
all roads in an OSM file.

~~~{.cpp}
#include <iostream>

#include <osmium/handler.hpp>
#include <osmium/io/any_input.hpp>
#include <osmium/osm/node.hpp>
#include <osmium/osm/way.hpp>
#include <osmium/visitor.hpp>

class MyHandler : public osmium::handler::Handler {
public:
    void way(const osmium::Way& way) {
        std::cout << "way " << way.id() << '\n';
        for (const osmium::Tag& t : way.tags()) {
            std::cout << t.key() << "=" << t.value() << '\n';
        }
    }

    void node(const osmium::Node& node) {
        std::cout << "node " << node.id() << '\n';
    }
};

int main() {
    auto otypes = osmium::osm_entity_bits::node | osmium::osm_entity_bits::way;
    osmium::io::Reader reader{"input.osm.pbf", otypes};
    MyHandler handler;
    osmium::apply(reader, handler);
    reader.close();
}
~~~

The example above reads an OSM file and writes some informations about nodes
and ways to `STDOUT`.

You can define multiple handlers, osmium will feed the objects into the
handlers one after another. Just add the additional handlers to
`osmium::apply()` which accepts a reader and one or multiple handlers.

Multiple handlers are necessary if you want to access the locations of the nodes referenced by a
way because the way itself only contains references to the nodes. A special handler has to offer
methods to look up the location by the ID of a node. The best index type for this
`NodeLocationsForWays` handler depends on the size of the file, the available memory and the
operating system. See [Osmium Concept Manual](../osmium-concepts-manual/#indexes) for details.

~~~{.cpp}
#include <iostream>

#include <osmium/handler.hpp>
#include <osmium/osm/node.hpp>
#include <osmium/osm/way.hpp>
#include <osmium/io/any_input.hpp>
#include <osmium/visitor.hpp>
#include <osmium/index/map/sparse_mem_array.hpp>
#include <osmium/handler/node_locations_for_ways.hpp>

class MyHandler : public osmium::handler::Handler {
public:
    void way(const osmium::Way& way) {
        std::cout << "way " << way.id() << '\n';
        for (const auto& n : way.nodes()) {
            std::cout << n.ref() << ": " << n.lon() << ", " << n.lat() << '\n';
        }
    }
};

int main() {
    auto otypes = osmium::osm_entity_bits::node | osmium::osm_entity_bits::way;
    osmium::io::Reader reader{"input.osm.pbf", otypes};

    namespace map = osmium::index::map;
    using index_type = map::SparseMemArray<osmium::unsigned_object_id_type, osmium::Location>;
    using location_handler_type = osmium::handler::NodeLocationsForWays<index_type>;

    index_type index;
    location_handler_type location_handler{index};

    MyHandler handler;
    osmium::apply(reader, location_handler, handler);
    reader.close();
}
~~~

You can find lots of examples how to use a handler at the
[examples](https://github.com/osmcode/libosmium/tree/master/examples) of libosmium and
[osmium-contrib](https://github.com/osmcode/osmium-contrib) repository.

