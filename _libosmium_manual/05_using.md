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


## Read the manuals

Before you do anything else we recommend you at least skim the [Libosmium
concepts manual](http://osmcode.org/osmium-concepts/) and this
manual. This will give you an overview of what's where and how Libosmium works.


## Read the API reference

The [API reference](http://docs.osmcode.org/libosmium/) contains a
documentation of every class and function in Libosmium. It will tell you which
`#include` directive you need where.

Libosmium uses several other libraries for many of its functions and you have
to figure out which libraries to link with when you include specific Libosmium
header files. This is documented in the reference and there is a list below for
your convenience.


## CMake configuration

If you are using CMake to configure your project, using Libosmium is very
easy, because complete configuration is available. Copy the file
[FindOsmium.cmake](https://github.com/osmcode/libosmium/blob/master/cmake/FindOsmium.cmake)
to your project:

``` sh
cd your-project
mkdir -p cmake
cd cmake
wget https://github.com/osmcode/libosmium/raw/master/cmake/FindOsmium.cmake
```

and include it in your `CMakeLists.txt`:

``` cmake
list(APPEND CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake")
find_package(Osmium REQUIRED)
```

This will tell CMake to find the Libosmium includes on the build system during
the configuration. You can check whether this was successful with something
like:

``` cmake
if(NOT OSMIUM_FOUND)
    message(WARNING "Libosmium not found!\n")
endif()
```

If your code doesn't work with older version of Libosmium, you can tell CMake
the minimum version number:

``` cmake
find_package(Osmium 2.10.2 REQUIRED)
```

You can add an optional list of components that should be found also. For
example to look for the `io` and `gdal` components you extend the
`find_package` command like this:

``` cmake
find_package(Osmium REQUIRED COMPONENTS io gdal)
```

`FindOsmium` knows about the following components:

* `pbf`        - include libraries needed for PBF input and output
* `xml`        - include libraries needed for XML input and output
* `io`         - include libraries needed for any type of input/output
* `gdal`       - include if you want to use any of the OGR functions
* `proj`       - include if you want to use any of the Proj.4 functions
* `sparsehash` - include if you use the sparsehash index map (`sparse_mem_table`)

After that add the include directories:

``` cmake
include_directories(${OSMIUM_INCLUDE_DIRS})
```

You can look at the CMake configuration in the [Osmium
Tool](https://github.com/osmcode/osmium-tool) and [Osmium
Contrib](https://github.com/osmcode/osmium-contrib) repositories for some
working examples.

Note that you should occasionally check whether you still have a current
version of `FindOsmium.cmake` and update if necessary.


## Libraries needed for specific functionality

Also see the [dependencies chapter](#dependencies).


### XML input

For XML input you need the Expat XML parser, for XML output no special XML library is needed. In any case you need threading enabled. If you want to read or write compressed XML files you need ZLib and BZ2lib.

* Dependencies: Expat, Zlib, BZ2lib
* Link with: `libexpat`, enable multithreading
* Classes: `osmium::io::Reader`, `osmium::io::Writer`
* Include files: `osmium/io/any_input.hpp`, `osmium/io/any_output.hpp`, `osmium/io/xml_input.hpp`, `osmium/io/xml_output.hpp`, `osmium/io/any_compression.hpp`, `osmium/io/gzip_compression.hpp`, `osmium/io/bzip2_compression.hpp`

### PBF input and output

For PBF input and output you need several libraries and threading enabled.

For version 2.3.0 and above you don't need much:

* Dependencies: Zlib
* Link with: `libz`, `ws2_32` (Windows only), enable multithreading
* Classes: `osmium::io::Reader`, `osmium::io::Writer`
* Include files: `osmium/io/any_input.hpp`, `osmium/io/any_output.hpp`, `osmium/io/pbf_input.hpp`, `osmium/io/pbf_output.hpp`

For versions up to 2.2 you need some more libraries:

* Dependencies: Google Protocol Buffers, OSMPBF, Zlib
* Link with: `libprotobuf-lite`, `libosmpbf`, `libz`, `ws2_32` (Windows only), enable multithreading
* Classes: `osmium::io::Reader`, `osmium::io::Writer`
* Include files: `osmium/io/any_input.hpp`, `osmium/io/any_output.hpp`, `osmium/io/pbf_input.hpp`, `osmium/io/pbf_output.hpp`

### GDAL/OGR

The GDAL/OGR library is needed when you want to convert OSM geometries into OGR geometries or report problems building multipolygons into OGR formats.

* Link with: `libgdal`
* Classes: `osmium::geom::OGRFactory`
* Include files: `osmium/geom/ogr.hpp`, `osmium/area/problem_reporter_ogr.hpp`


### Proj.4

The Proj.4 library is only needed when you want to project OSM locations into
arbitrary coordinate reference systems. If you only want to convert to Web
Mercator, use `osmium::geom::MercatorProjection` instead and you don't need an
extra library.

* Link with: `libproj`
* Classes: `osmium::geom::Projection`
* Include files: `osmium/geom/projection.hpp`


## Compiler options

You might have to set the C++ version using the compiler option

```
-std=c++11
```

When working with OSM data you often have very large files with several
gigabytes. This can lead to problems on 32bit systems. Use the options

```
-D_LARGEFILE_SOURCE -D_FILE_OFFSET_BITS=64
```

for the compiler to make sure that large files work.


## Sample Compilation String

``` sh
g++ osm_processor.cpp --std=c++11 -lpthread -lz -lexpat -lbz2
```

