---
chapter: 5
title: Using Libosmium in your own projects
---

Libosmium is generally quite easy to use in your own projects. Just include the
specific header files you need for your application and start using Libosmium
functions. Because Libosmium is a header-only library, there is nothing to link
with. There isn't one include file for everything, but many include files each
only bringing in some specific classes and functions. This way you are not
paying for something you don't use.


## Read the manual

Before you do anything else we recommend you at least skim the [Libosmium
concepts manual](http://docs.osmcode.org/osmium-concepts-manual/) and this
manual This will give you an overview of what's where and how Libosmium works.


## Read the API reference

The [API reference](http://osmcode.org/libosmium/reference/) contains a
documentation of every class and function in Libosmium. It will tell you which
`#include` directive you need where.

Libosmium uses several other libraries for many of its functions and you have
to figure out which libraries to link with when you include specific Libosmium
header files. This is documented in the reference and there is a list below for
your convenience.


## Libraries needed for specific functionality

Also see the [[Libosmium dependencies]].


### XML input

For XML input you need the Expat XML parser, for XML output no special XML library is needed. In any case you need threading enabled. If you want to read or write compressed XML files you need ZLib and BZ2lib.

* Dependencies: [[Expat|Libosmium-dependencies#expat]], [[Zlib|Libosmium-dependencies#zlib]], [[BZ2lib|Libosmium-dependencies#bz2lib]]
* Link with: `libexpat`, enable multithreading
* Classes: `osmium::io::Reader`, `osmium::io::Writer`
* Include files: `osmium/io/any_input.hpp`, `osmium/io/any_output.hpp`, `osmium/io/xml_input.hpp`, `osmium/io/xml_output.hpp`, `osmium/io/any_compression.hpp`, `osmium/io/gzip_compression.hpp`, `osmium/io/bzip2_compression.hpp`

### PBF input and output

For PBF input and output you need several libraries and threading enabled.

For version 2.3.0 and above you don't need much:

* Dependencies: [[Zlib|Libosmium-dependencies#zlib]]
* Link with: `libz`, `ws2_32` (Windows only), enable multithreading
* Classes: `osmium::io::Reader`, `osmium::io::Writer`
* Include files: `osmium/io/any_input.hpp`, `osmium/io/any_output.hpp`, `osmium/io/pbf_input.hpp`, `osmium/io/pbf_output.hpp`

For versions up to 2.2 you need some more libraties:

* Dependencies: [[Google Protocol Buffers|Libosmium-dependencies#google-protocol-buffers]], [[OSMPBF|Libosmium-dependencies#osmpbf]], [[Zlib|Libosmium-dependencies#zlib]]
* Link with: `libprotobuf-lite`, `libosmpbf`, `libz`, `ws2_32` (Windows only), enable multithreading
* Classes: `osmium::io::Reader`, `osmium::io::Writer`
* Include files: `osmium/io/any_input.hpp`, `osmium/io/any_output.hpp`, `osmium/io/pbf_input.hpp`, `osmium/io/pbf_output.hpp`

### GDAL/OGR

The GDAL/OGR library is needed when you want to convert OSM geometries into OGR geometries or report problems building multipolygons into OGR formats.

* Link with: `libgdal`
* Classes: `osmium::geom::OGRFactory`
* Include files: `osmium/geom/ogr.hpp`, `osmium/area/problem_reporter_ogr.hpp`

### GEOS

The GEOS library is only needed when you want to convert OSM geometries into GEOS geometries.

* Link with: `libgeos`
* Classes: `osmium::geom::GEOSFactory`
* Include files: `osmium/geom/geos.hpp`

### Proj.4

The Proj.4 library is only needed when you want to project OSM locations into arbitrary coordinate reference systems. If you only want to convert to Web Mercator, use `osmium::geom::MercatorProjection` instead and you don't need an extra library.

* Link with: `libproj`
* Classes: `osmium::geom::Projection`
* Include files: `osmium/geom/projection.hpp`


## CMake configuration

If you are using CMake to configure your project, copy the file [FindOsmium.cmake](https://github.com/osmcode/libosmium/blob/master/cmake/FindOsmium.cmake) to your project:

    cd your-project
    mkdir -p cmake
    cd cmake
    wget https://github.com/osmcode/libosmium/raw/master/cmake/FindOsmium.cmake

and include it in your `CMakeLists.txt`:

    list(APPEND CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake")
    find_package(Osmium REQUIRED)

This will tell CMake to find the Libosmium includes on the build system during the configuration. You can check whether this was successful with something like:

    if(NOT OSMIUM_FOUND)
        message(WARNING "Libosmium not found!\n")
    endif()

You can add an optional list of components that should be found also. For example to look for the `io` and `gdal` components you extend the `find_package` command like this:

    find_package(Osmium REQUIRED COMPONENTS io gdal)

`FindOsmium` knows about the following components:

* `pbf`        - include libraries needed for PBF input and output
* `xml`        - include libraries needed for XML input and output
* `io`         - include libraries needed for any type of input/output
* `geos`       - include if you want to use any of the GEOS functions
* `gdal`       - include if you want to use any of the OGR functions
* `proj`       - include if you want to use any of the Proj.4 functions
* `sparsehash` - include if you use the sparsehash index map (`sparse_mem_table`)

After that add the include directories:

    include_directories(${OSMIUM_INCLUDE_DIRS})

You can look at the CMake configuration in the [Osmium Tool](https://github.com/osmcode/osmium-tool) and [Osmium Contrib](https://github.com/osmcode/osmium-contrib) repositories for some working examples.

Note that you should occasionally check whether you still have a current version of `FindOsmium.cmake` and update if necessary.

## Compiler options

See the [Libosmium manual](http://osmcode.org/libosmium/manual/libosmium-manual.html).

## Sample Compilation String

`g++ osm_processor.cpp --std=c++11 -lprotobuf-lite -lpthread -lz -lexpat -losmpbf -lbz2`
