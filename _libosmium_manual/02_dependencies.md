---
chapter: 2
title: Dependencies
---

Different parts of Libosmium have different dependencies. You do not need to
install all of them, just those that you need for whatever you are doing with
Libosmium. But for a beginner it is not always easy to see which dependencies
are needed and which aren't. This documentation differentiates between
_important_ dependencies and _extra_ dependencies to help you out. You should
at least install the important dependencies when starting to experiment with
Libosmium, but feel free to install all dependencies. Whatever is not needed
will not be used anway, it will not slow down your program or make the binaries
bigger.

In addition to the programs listed here, you'll need a C++ compiler which
supports C++11. Clang 3.4 or later and GCC 4.8 or later are known to work.

You might have to set the C++ version using the compiler option

    -std=c++11


## Installing dependencies on Linux

### Debian/Ubuntu

You can install all important dependencies with:

    sudo apt-get install \
        cmake cmake-curses-gui make \
        libexpat1-dev \
        zlib1g-dev libbz2-dev

and all extra dependencies with:

    sudo apt-get install libsparsehash-dev \
        libboost-dev libboost-program-options-dev \
        libgdal-dev libgeos++-dev libproj-dev \
        doxygen graphviz

### Arch Linux

You can install all important dependencies with:

    sudo pacman -Suy protobuf boost-libs zlib \
                      expat cmake make bzip2

and all extra dependencies with:

    sudo pacman -Suy sparsehash boost gdal geos \
                      proj doxygen


## _Important_ dependencies

### CMake and Make

To build the tests, examples, etc. you need the [CMake](http://www.cmake.org/)
build system. Programs using Libosmium can, of course, be built with any build
system you like, but the Libosmium repository as well as many projects based on
Libosmium use it.

CMake has an optional curses-based configuration tool called `ccmake`. It is
recommended that you install this also.

CMake usually generates a Makefile for Make, which you will also need.

* Debian/Ubuntu: `cmake`, `cmake-curses-gui`, `make`
* Fedora: `cmake`
* CentOS: `cmake`

### Google Protocol Buffers (until version 2.2)

_Not needed any more from version 2.3.0 onwards_

[Google Protocol Buffers](http://code.google.com/p/protobuf/) in at least
version 2.4.0 is needed for reading and writing [OSM PBF
files](http://wiki.openstreetmap.org/wiki/PBF_Format).

* Debian/Ubuntu: `libprotobuf-dev`, `protobuf-compiler`
* openSUSE: `protobuf-devel`
* Homebrew: `protobuf`

### OSMPBF (until version 2.2)

_Not needed any more from version 2.3.0 onwards_

The [OSMPBF library](https://github.com/scrosby/OSM-binary) is needed for
reading and writing [OSM PBF
files](http://wiki.openstreetmap.org/wiki/PBF_Format).

* Debian/Ubuntu: `libosmpbf-dev` (The package in Ubuntu 14.04 and older is too old, install from source instead.)
* Homebrew: `osm-pbf`

### Protozero (since version 2.3.0)

The [Protozero header only library](https://github.com/mapbox/protozero) is
needed for reading and writing [OSM PBF
files](http://wiki.openstreetmap.org/wiki/PBF_Format). A copy of this library
is included in the libosmium repository but not installed by default. Either
use the packages of your distribution, install it from Github, or use the
`INSTALL_PROTOZERO` option of the libosmium CMake configuration to install the
bundled version.

* Debian/Ubuntu: `protozero`
* Fedora: `protozero-devel`

### Utfcpp

The [utf8-cpp](http://utfcpp.sourceforge.net/) library is needed for the OPL
output format. A copy of this library is included in the libosmium repository
but not installed by default. Either use the packages of your distribution,
install it from the source, or use the `INSTALL_UTFCPP` option of the libosmium
CMake configuration to install the bundled version.

* Debian/Ubuntu: `libutfcpp-dev`
* Fedora: `utf8cpp-devel`

### Expat

[Expat](http://expat.sourceforge.net/) is needed for parsing OSM XML files.

* Debian/Ubuntu: `libexpat1-dev`
* openSUSE: `libexpat-devel`
* Homebrew: `expat`
* Fedora: `expat-devel`
* CentOS: `expat-devel`

### ZLib

[zlib](http://www.zlib.net/) is needed for reading and writing OSM PBF files
and for GZip support when reading and writing XML files.

* Debian/Ubuntu: `zlib1g-dev`
* openSUSE: `zlib-devel`
* Fedora: `zlib-devel`
* CentOS: `zlib-devel`

### bz2lib

[bz2lib](http://www.bzip.org/) is needed for BZip2 support when reading and
writing OSM XML files.

* Debian/Ubuntu: `libbz2-dev`
* Fedora: `bzip2-devel`
* CentOS: `bzip2-devel`

### Boost

[Boost](http://www.boost.org/) Iterator is used for Tag filters, and for the
Object Pointer Collection. The CRC32 checksum implementatation from boost is
needed for caclcuation checksums over OSM objects. Libosmium versions before
2.6.1 also needed Boost for writing PBF files.

You need at least Boost version 1.55.

* Debian/Ubuntu: `libboost-dev`
* openSUSE: `boost-devel`
* Homebrew: `boost`
* Fedora: `boost-devel`
* CentOS: `boost-devel`

## _Extra_ dependencies

### Google Sparsehash

Google Sparsehash (http://code.google.com/p/google-sparsehash/) is needed for
the `sparse-mem-table` index map, often used as a node location store.

* Debian/Ubuntu: `libsparsehash-dev`
* openSUSE: `sparsehash`
* Homebrew: `google-sparsehash`
* Fedora: `sparsehash-devel`
* CentOS: `sparsehash-devel`

### Boost Program Options (until version 2.7.2)

[Boost Program
Options](http://www.boost.org/doc/libs/1_54_0/doc/html/program_options.html) is
needed for parsing command line options in some examples.

* Debian/Ubuntu: `libboost-program-options-dev`
* CentOS: `boost-program-options`

### GDAL/OGR

[GDAL/OGR](http://gdal.org/) is needed if you want to convert OSM geometries
into OGR geometries.

* Debian/Ubuntu: `libgdal-dev`
* openSUSE: `libgdal-devel`
* Homebrew: `gdal`
* Fedora: `gdal-devel`
* CentOS: `gdal-devel`

Osmium can create OGR geometries from OSM data. To use this compile with what
the command

    gdal-config --cflags

returns and link with what

    gdal-config --libs

returns.


### GEOS

[GEOS](http://trac.osgeo.org/geos/) is needed if you want to convert OSM
geometries into GEOS geometries. The GEOS support is deprecated and works only
until GEOS 3.5. For details see
https://github.com/osmcode/libosmium/commit/3424a7400d70d3b9c5b27b7f704eee2c1725450d.

* Debian/Ubuntu: `libgeos++-dev`
* openSUSE: `libgeos-devel`
* Homebrew: `geos`
* Fedora: `geos-devel`
* CentOS: `geos-devel`

### Proj.4

The [Proj.4](http://trac.osgeo.org/proj/) library is needed if you want to
project OSM coordinates into spatial reference systems other than Web Mercator
(EPSG 3857, often named Google Mercator).

* Debian/Ubuntu: `libproj-dev`
* Fedora: `proj-devel`, `proj-epsg`
* CentOS: `proj-devel`, `proj-epsg`

### Doxygen

The Libosmium API documentation can be built using
[Doxygen](http://www.stack.nl/~dimitri/doxygen/). Usually you do not need to do
this, because the API reference is available
[online](http://osmcode.org/libosmium/reference). If you want to build it
yourself, you need [Graphviz](http://www.graphviz.org/) in addition to Doxygen.

* Debian/Ubuntu: `doxygen`, `graphviz`
* Fedora: `doxygen`, `graphviz`, `xmlstarlet`
* CentOS: `doxygen`

