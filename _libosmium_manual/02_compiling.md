---
chapter: 2
title: Compiling Programs Using Osmium
---

Osmium is a header-only library, so it does not need to be compiled by
itself. But of course you will have to compile programs using Osmium.
This chapter gives you some hints on how to best do this.

## C++11

Osmium uses modern standard C++11 and should compile everywhere without
warnings when you have a recent enough compiler and standard library.
It works with GCC 4.8 and clang 3.2 or newer. Some parts might work
with GCC 4.7 or older versions of clang.

You might have to set the C++ version using the compiler option

    -std=c++11


## Operating Systems

Linux

:   Osmium is developed on Linux and tested best on that system.
    Debian Jessie (testing) and current Ubuntu systems come with
    everything needed for Osmium. Debian wheezy (stable) and the
    Ubuntu LTS release 12.04 don't have compilers current enough.
    If you are stuck on these systems, use a backported compiler.

Mac OSX    

:   Osmium also works well on Mac OSX with the exception of the parts
    that need the mremap system call that is not available on Mac OSX.

Windows    

:   Most of Osmium should work on Windows, but nobody has been
    actually testing it.
        
## Build System

The example programs in the example directory use a simple
Makefile to help compiling them.  Osmium is simple enough that
it doesn't need a large build systems like automake or cmake to
compile programs using it. This means that it works with
whatever build system you are using in your programs.
        
## Large File Support

When working with OSM data you often have very large files with
several gigabytes. This can lead to problems on 32bit systems.
Use the options

    -D_LARGEFILE_SOURCE -D_FILE_OFFSET_BITS=64

for the compiler to make sure that large files work. 
        
## Include What You Need

Libosmium is a header-only library. You include those parts you need and ignore
the rest. The library makes sure internal dependencies are followed, of course.
Whatever you don't include doesn't bloat your program and it doesn't need
execution time. And, what's more important, you do not have dependencies on
external libraries that are not really needed for whatever you are doing.

The full Osmium library has a frightening array of dependencies, but thats because
its mission is to make OSM data usable with all those libraries. But if you don't
need some part of Osmium, you also will not need those libraries.
            
You will find information about which files to include in the different
chapters of this manual. Generally for a class `osmium::foo::Bar`, there will be
an include file called `<osmium/foo/bar.hpp>` that you need to include, but
sometimes it is a bit more difficult.

Do not directly include any header files in directories called "detail". They
are for internal use of the library only.
            
## Boost

Some parts of Osmium need some [Boost](http://www.boost.org/)
libraries. Libraries used are:

* [Operators](http://www.boost.org/libs/utility/operators.htm)
* [Iterator](http://www.boost.org/libs/iterator/doc/)
* [String Algorithms](http://www.boost.org/doc/libs/1_55_0/libs/algorithm/string/)

Osmium also needs some Boost unicode functions. Because they are rather new and
not available everywhere, they are currently included with Osmium in
`include/boost_unicode_iterator.hpp`.

The Osmium unit tests use the [Boost Test library](http://www.boost.org/libs/test/).


## OGR Support

Osmium can create OGR geometries from OSM data. To use this compile with what the
command

    gdal-config --cflags

returns and link with what

    gdal-config --libs

returns.

