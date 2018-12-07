---
chapter: 2
title: Dependencies
---

Different parts of Libosmium have different dependencies. You do not need to
install all of them, just those that you need for whatever you are doing with
Libosmium. But for a beginner it is not always easy to see which dependencies
are needed and which aren't. This manual differentiates between
_important_ dependencies and _extra_ dependencies to help you out. You should
at least install the important dependencies when starting to experiment with
Libosmium, but feel free to install all dependencies. Whatever is not needed
will not be used anway, it will not slow down your program or make the binaries
bigger.

On Linux systems most of these libraries are available through your package
manager, see the list below for the names of the packages. But make sure to
check the versions. If the packaged version available is not new enough, you'll
have to install from source. Most likely this is the case for Protozero and
Libosmium.

On macOS many of the libraries above will be available through Homebrew.

When building Libosmium tests and examples, CMake will automatically look for
these libraries in the usual places on your system. In addition it will look
for the Libosmium and Protozero libraries in the same directory where the
Libosmium repository is. So if you are building from the Git repository and
want to use the newest Libosmium and Protozero, clone both into the same
directory:

    mkdir work
    cd work
    git clone https://github.com/mapbox/protozero
    git clone https://github.com/osmcode/libosmium

In addition to the programs listed here, you'll need a C++ compiler which
supports C++11. Clang 3.4 or later and GCC 4.8 or later are known to work.


## _Important_ dependencies

### CMake and Make

To build the tests, examples, etc. you need the [CMake](https://cmake.org/)
build system. Programs using Libosmium can, of course, be built with any build
system you like, but the Libosmium repository as well as many projects based on
Libosmium use it.

CMake has an optional curses-based configuration tool called `ccmake`. It is
recommended that you install this also.

CMake usually generates a Makefile for Make, which you will also need.

* Debian/Ubuntu: `cmake`, `cmake-curses-gui`, `make`
* Fedora/CentOS: `cmake`, `make`
* openSUSE: `cmake`, `make`

### Google Protocol Buffers (until version 2.2)

_Not needed any more from version 2.3.0 onwards_

[Google Protocol Buffers](https://developers.google.com/protocol-buffers/) in
at least version 2.4.0 is needed for reading and writing [OSM PBF
files](https://wiki.openstreetmap.org/wiki/PBF_Format).

* Debian/Ubuntu: `libprotobuf-dev`, `protobuf-compiler`
* openSUSE: `protobuf-devel`
* Homebrew: `protobuf`

### OSMPBF (until version 2.2)

_Not needed any more from version 2.3.0 onwards_

The [OSMPBF library](https://github.com/scrosby/OSM-binary) is needed for
reading and writing [OSM PBF
files](https://wiki.openstreetmap.org/wiki/PBF_Format).

* Debian/Ubuntu: `libosmpbf-dev` (The package in Ubuntu 14.04 and older is too old, install from source instead.)
* Homebrew: `osm-pbf`

### Protozero >= 1.5.1 (since libosmium version 2.3.0)

The [Protozero header only library](https://github.com/mapbox/protozero) is
needed for reading and writing [OSM PBF
files](https://wiki.openstreetmap.org/wiki/PBF_Format).

You need at least version 1.5.1.

Up to version 2.13 a copy of this library was included in the libosmium
repository. For newer version you need to install either a packaged version or
a version from the git repository.

* Debian/Ubuntu: `libprotozero-dev`
* Fedora/CentOS: `protozero-devel`

### Utfcpp

The [utf8-cpp](http://utfcpp.sourceforge.net/) library is needed for the OPL
output format. A copy of this library is included in the libosmium repository
but not installed by default. Either use the packages of your distribution,
install it from the source, or use the `INSTALL_UTFCPP` option of the libosmium
CMake configuration to install the bundled version.

* Debian/Ubuntu: `libutfcpp-dev`
* Fedora/CentOS: `utf8cpp-devel`
* openSUSE: `utfcpp`

### Expat

[Expat](https://libexpat.github.io/) is needed for parsing OSM XML files.

* Debian/Ubuntu: `libexpat1-dev`
* Fedora/CentOS: `expat-devel`
* openSUSE: `libexpat-devel`
* Homebrew: `expat`

### ZLib

[zlib](https://www.zlib.net/) is needed for reading and writing OSM PBF files
and for GZip support when reading and writing XML files.

* Debian/Ubuntu: `zlib1g-dev`
* Fedora/CentOS: `zlib-devel`
* openSUSE: `zlib-devel`

### bz2lib

[bz2lib](http://www.bzip.org/) is needed for BZip2 support when reading and
writing OSM XML files.

* Debian/Ubuntu: `libbz2-dev`
* Fedora/CentOS: `bzip2-devel`
* openSUSE: `libbz2-devel`

### Boost >= 1.55

[Boost](https://www.boost.org/) Iterator is used for Tag filters, and for the
Object Pointer Collection. The CRC32 checksum implementatation from boost is
needed for caclcuation checksums over OSM objects. Libosmium versions before
2.6.1 also needed Boost for writing PBF files.

You need at least Boost version 1.55.

* Debian/Ubuntu: `libboost-dev`
* Fedora/CentOS: `boost-devel`
* openSUSE: `boost-devel`
* Homebrew: `boost`

## _Extra_ dependencies

### Google Sparsehash

Google Sparsehash (https://github.com/sparsehash/sparsehash) is needed for
the `sparse-mem-table` index map, often used as a node location store.

* Debian/Ubuntu: `libsparsehash-dev`
* Fedora/CentOS: `sparsehash-devel`
* openSUSE: `sparsehash-devel`
* Homebrew: `google-sparsehash`

### Boost Program Options (until version 2.7.2)

[Boost Program
Options](https://www.boost.org/doc/libs/1_67_0/doc/html/program_options.html) is
needed for parsing command line options in some examples.

* Debian/Ubuntu: `libboost-program-options-dev`
* Fedora/CentOS: `boost-program-options`
* openSUSE: `boost-devel`

### GDAL/OGR

[GDAL/OGR](https://gdal.org/) is needed if you want to convert OSM geometries
into OGR geometries.

* Debian/Ubuntu: `libgdal-dev`
* Fedora/CentOS: `gdal-devel`
* openSUSE: `gdal-devel`
* Homebrew: `gdal`

To use, compile with what the command

``` sh
gdal-config --cflags
```

returns and link with what

``` sh
gdal-config --libs
```

returns.


### GEOS

[GEOS](http://trac.osgeo.org/geos/) is needed if you want to convert OSM
geometries into GEOS geometries. The GEOS support is deprecated and works only
until GEOS 3.5. For details see [this
commit](https://github.com/osmcode/libosmium/commit/3424a7400d70d3b9c5b27b7f704eee2c1725450d).

* Debian/Ubuntu: `libgeos++-dev`
* Fedora/CentOS: `geos-devel`
* openSUSE: `geos-devel`
* Homebrew: `geos`

### Proj.4

The [Proj.4](https://proj4.org/) library is needed if you want to
project OSM coordinates into spatial reference systems other than Web Mercator
(EPSG 3857, often named Google Mercator).

* Debian/Ubuntu: `libproj-dev`
* Fedora/CentOS: `proj-devel`, `proj-epsg`
* openSUSE: `libproj-devel`, `proj`

### Doxygen

The Libosmium API documentation can be built using
[Doxygen](http://www.doxygen.nl/). Usually you do not need to do
this, because the API reference is available
[online](https://docs.osmcode.org/libosmium/latest/). If you want to build it
yourself, you need [Graphviz](https://www.graphviz.org/) in addition to Doxygen.

* Debian/Ubuntu: `doxygen`, `graphviz`
* Fedora/CentOS: `doxygen`, `graphviz`, `xmlstarlet`
* openSUSE: `doxygen`, `graphviz`


## Installing dependencies on some Linux systems

### Debian Jessie

You can install all dependencies with:

``` sh
apt-get install -q -y \
    cmake \
    doxygen \
    g++ \
    git \
    graphviz \
    libboost-dev \
    libbz2-dev \
    libexpat1-dev \
    libgdal-dev \
    libgeos++-dev \
    libproj-dev \
    libsparsehash-dev \
    make \
    ruby \
    ruby-json \
    spatialite-bin \
    zlib1g-dev
```

### Ubuntu Trusty (14.04)

You can install all dependencies with:

``` sh
apt-get install -q -y \
    cmake \
    doxygen \
    g++ \
    git \
    graphviz \
    libboost-dev \
    libbz2-dev \
    libexpat1-dev \
    libgdal-dev \
    libgeos++-dev \
    libproj-dev \
    libsparsehash-dev \
    make \
    ruby \
    ruby-json \
    spatialite-bin \
    zlib1g-dev
```

### Ubuntu Xenial (16.04)

You can install all dependencies with:

``` sh
apt-get install -q -y \
    cmake \
    doxygen \
    g++ \
    git \
    graphviz \
    libboost-dev \
    libbz2-dev \
    libexpat1-dev \
    libgdal-dev \
    libgeos++-dev \
    libproj-dev \
    libsparsehash-dev \
    make \
    ruby \
    ruby-json \
    spatialite-bin \
    zlib1g-dev
```

### Fedora 26

You can install all dependencies with:

``` sh
dnf install --quiet --assumeyes \
    boost-devel \
    bzip2-devel \
    cmake \
    doxygen \
    expat-devel \
    gcc-c++ \
    gdal-devel \
    geos-devel \
    git \
    graphviz \
    make \
    proj-devel \
    proj-epsg \
    ruby \
    rubygem-json \
    sparsehash-devel \
    spatialite-tools \
    zlib-devel
```

### openSUSE 42

You can install all dependencies with:

``` sh
zypper --non-interactive --no-color install \
    boost_1_61-devel \
    cmake \
    doxygen \
    gcc6-c++ \
    gdal-devel \
    geos-devel \
    graphviz \
    libbz2-devel \
    libexpat-devel \
    libproj-devel \
    proj \
    ruby2.3 \
    ruby2.3-rubygem-json \
    sparsehash-devel \
    zlib-devel
```

### Arch Linux

You can install all important dependencies with:

``` sh
sudo pacman -Suy protobuf boost-libs zlib expat cmake make bzip2
```

and all extra dependencies with:

``` sh
sudo pacman -Suy sparsehash boost gdal proj doxygen
```

