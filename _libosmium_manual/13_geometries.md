---
chapter: 13
title: Creating Geometries
---

OSM objects describe *where* something is and *what* it is. The *what* is
described by the tags, the *where*, the "geometry" is "encoded" in the
locations (longitude and latitude) of the nodes for simple points, in the
locations of the nodes in a way forming a linestring (or, possibly, a polygon
if the first and last node are the same), and more complex geometrical objects
(such as multipolygons) if relations are involved.

For many uses cases the geometry of an OSM object (or OSM objects) is
important. After all, if you want to render a map, you need the geometry of
everything in it. That is why libosmium has many functions to create the
different kind of geometries from OSM objects. The whole exercise is made more
difficult, because there are many different ways to represent geometries in
C++ programs used by different software packages. Osmium knows about several
of them.


## Example: Creating a point geometry from a node

As an introductory example, we'll look at how a point geometry can be created
from a node.

``` c++
#include <osmium/geom/factory.hpp>
const osmium::Node& node = ...; // got this from somewhere

osmium::geom::WKTFactory<> factory;
std::string wkt = factory.create_point(node);
```

First you need a geometry factory. Those factories know how to convert OSM
objects into different kinds of geometry represantations. The `WKTFactory`
creates geometries in the WKT (Well Known Text) format which is just a string
like `POINT(3.567 25.642)`.

Then you use the factory to create the point from the node and you are done.

## Geometry types

Libosmium can create the following geometry types:

| Geometry type  | from these objects            | with function
|--------------  |-------------------            | -------------
| `Point`        | `Node`, `NodeRef`, `Location` | `create_point()`
| `LineString`   | `Way`, `WayNodeList`          | `create_linestring()`
| `Polygon`      | `Way`, `WayNodeList`          | `create_polygon()`
| `MultiPolygon` | `Area`                        | `create_multipolygon()`


Notes:

* LineStrings can also be created in reverse and with or without duplicate
  nodes. See the reference documentation for details.
* Polygons can only be created from closed ways or way node lists.


## Factories

Libosmium supports the following factories for different geometry formats:

### WKT

[Well-known text](https://en.wikipedia.org/wiki/Well-known_text) is a simple
text based format with geometries that look like `POINT(2.2452, 41.3124)` or
`LINESTRING(1.1554 2.5215, 1.1453 2.5663)`. They can be created like this:

``` c++
#include <include/osmium/geom/wkt.hpp>
osmium::geom::WKTFactory<> factory;
```

The factory constructor takes an optional integer argument with the precision
(number of digits after the decimal point), the default is 7, which is enough
for OSM.

``` c++
osmium::geom::WKTFactory<> factory{3}; // three digits after decimal point
```

All creation functions return a `std::string`:

``` c++
std::string point = factory.create_point(node);
std::string line  = factory.create_linestring(way);
...
```

### WKB

[Well-known binary](https://en.wikipedia.org/wiki/Well-known_binary) is a
simple binary format. Create the factory like this:

``` c++
#include <include/osmium/geom/wkb.hpp>
osmium::geom::WKBFactory<> factory;
```

The factory constructor takes two optional arguments. The first decides
whether you want WKB (`wkb_type::wkb`, default) or Extended WKB (EWKB,
`wkb_type::ewkb`), the second decides whether to output in raw binary
(`out_type::binary`, default) or in hex encoded binary (`out_type::hex`).

To create extended WKB in hex format as used by PostGIS for example:

``` c++
osmium::geom::WKBFactory<> factory{osmium::geom::wkb_type::ewkb,
                                   osmium::geom::out_type::hex};
```

All creation functions return a `std::string`:

``` c++
std::string point = factory.create_point(node);
std::string line  = factory.create_linestring(way);
...
```


### GEOS

*The functions for creating GEOS geometries are deprecated and work only until
GEOS 3.5. If you want to use it beyond that contact the libosmium developers
by opening an issue on the Github repository.*

[GEOS](http://trac.osgeo.org/geos/) is an Open Source library with powerful
operations to work with and modify geometries. To use it from libsomium:

``` c++
#include <include/osmium/geom/geos.hpp>
osmium::geom::GEOSFactory<> factory;
```

You can also set the SRID used by GEOS (default is -1, unset):

``` c++
osmium::geom::GEOSFactory<> factory{4326};
```

If this is not flexible enough for your case, you can also create a GEOS
factory yourself and then the libosmium factory from it:

``` c++
geos::geom::PrecisionModel geos_pm;
geos::geom::GeometryFactory geos_factory{&pm, 4326};
osmium::geom::GEOSFactory<> factory{geos_factory};
```

Note: GEOS keeps a pointer to the factory it was created from in each geometry.
You have to make sure the factory is not destroyed before all the geometries
created from it have been destroyed!

All creation functions return a `unique_ptr` to the GEOS geometry:

``` c++
std::unique_ptr<geos::geom::Point> point = factory.create_point(node);
std::unique_ptr<geos::geom::LineString> line = factory.create_linestring(way);
...
```

### GDAL/OGR

The [GDAL/OGR](http://gdal.org/) library is very popular. Almost all Open
Source GIS tools use it in one form or another to read or write geometries 
from/to files or databases in dozens of different formats (Shapfiles,
Spatialite, PostGIS, etc.) You can use it from libosmium, too:

``` c++
#include <include/osmium/geom/ogr.hpp>
osmium::geom::OGRFactory<> factory;
```

The factory constructor doesn't take any special arguments.

All creation functions return a `unique_ptr` to the OGR geometry:

``` c++
std::unique_ptr<OGRPoint> point = factory.create_point(node);
std::unique_ptr<OGRLineString> line = factory.create_linestring(way);
...
```

### GeoJSON

The [GeoJSON](http://geojson.org/) format describes how to encode geometries
in JSON.

Libosmium has two different GeoJSON factories. One creates normal
`std::string`s with the JSON data. The other uses the
[RapidJSON](https://github.com/Tencent/rapidjson) library. Both only create
the *geometry* portion of the JSON structure for you. You have to add the
*feature* structure with the properties yourself as needed for your use case.

The GeoJSONFactory takes an optional precision as argument like the WKT
constructor:

``` c++
#include <include/osmium/geom/geojson.hpp>

osmium::geom::GeoJSONFactory<> factory{6};
std::string point = factory.create_point(node);
```

The RapidGeoJSONFactory takes a form of `rapidjson::Writer` as argument. Here
is an example:

``` c++
#include <rapidjson/writer.h>
#include <rapidjson/stringbuffer.h>
#include <include/osmium/geom/rapid_geojson.hpp>

typedef rapidjson::Writer<rapidjson::StringBuffer> writer_type;
rapidjson::StringBuffer stream;
writer_type writer{stream};
osmium::geom::RapidGeoJSONFactory<writer_type> factory{writer};
```

Please see the RapidJSON documentation for details about the `Writer` class.


## Using projections

Before creating the geometries, libosmium can convert the coordinates from the
OSM objects into different coordinate systems using a *projection*. This
projection is given as a template parameter to the factory constructor:

``` c++
osmium::geom::WKTFactory<> factory; // default identity projection (EPSG 4326)
```

or

``` c++
osmium::geom::WKTFactory<osmium::geom::IdentityProjection> factory; // same
```

Often used is the Web Mercator projection (EPSG 3857):

``` c++
#include <osmium/geom/mercator_projection.hpp>
osmium::geom::WKTFactory<osmium::geom::MercatorProjection> factory;
```

The identity and Mercator projection are handled internally in libosmium. But
you can also use any projection implemented by the
[Proj.4](http://proj4.org/) library:

``` c++
#include <osmium/geom/projection.hpp>

osmium::geom::Projection projection{"+init=epsg:31467"}; // Gauss-Krueger GK3
osmium::geom::WKTFactory<osmium::geom::Projection> factory{projection};
```

You need to link with `-lproj` if you use this library. See the documentation
of the Proj.4 library on the different ways to initialize a projection using
a projection string.


## Exceptions

Factory functions throw `osmium::geometry_error` exceptions if something went
wrong creating a geometry.


## Implementing your own factory

The geometry formats already implemented should cover a lot of uses, but if you
need to implement your own format factory, you can do so based on the code in
libosmium. You have to implement your own `SomeFormatFactoryImpl` class that
implements the `make_point()`, `linestring_start()`,
`linestring_add_location()`, `linestring_finish()`, `polygon_start()`,
`polygon_add_location()`, `polygon_finish()`, `multipolygon_start()`,
`multipolygon_polygon_start()`, `multipolygon_polygon_finish()`,
`multipolygon_outer_ring_start()`, `multipolygon_outer_ring_finish()`,
`multipolygon_inner_ring_start()`, `multipolygon_inner_ring_finish()`,
`multipolygon_add_location()`, and `multipolygon_finish()` functions. These
functions are usually very small adapting the data to the desired format. All
the really logic is in the provided GeometryFactory parent class.

Then all you need is define the partial specialization

``` c++
template <class TProjection = IdentityProjection>
using SomeFormatFactory = GeometryFactory<SomeFormatFactoryImpl, TProjection>;
```

and you are done.

Use the other implementations as examples and ask if you have any questions.

