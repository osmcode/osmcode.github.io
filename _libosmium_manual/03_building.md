---
chapter: 3
title: Building Libosmium
---

Libosmium is a header-only library, that means that you do not have to build
anything. But you might want to build the tests, examples, benchmarks or the
documentation. This page explains how to do that.

Before building you need to install all the [[dependencies|Libosmium
dependencies]].


## CMake

Libosmium uses the [CMake](http://www.cmake.org/) configuration system
available on all major platforms. CMake will generate a configuration for a
build system of your choice. On Linux and Mac OS/X this is usually GNU Make, on
Windows Nmake or MSBuild.


## Build types

CMake knows several different _build types_ that result in the use of different
compiler options and different build options (see below). By default the build
type `RelWithDebInfo` (Release with debug info) will be used, but you can
change this either by setting `CMAKE_BUILD_TYPE` in `ccmake` or on the command
line:

    cmake -DCMAKE_BUILD_TYPE=Dev

Here are the build types used for Libosmium:

* `Debug`: Debug mode, no optimizations.
* `Dev`: For Libosmium developers. All build options are set to ON and very
  strict compiler warnings are enabled.
* `MinSizeRel`: Release mode, optimize for small binary.
* `RelWithDebInfo`: Release mode with debug information compiled in. Use this
  unless the binaries generated are too big for you.
* `Release`: Release mode.


## Build options

Depending on the build type (see above), different build options are `ON` or
`OFF`. You can change the settings in `ccmake` or on the command line with
something like

    cmake -DBUILD_EXAMPLES=ON

etc.

* `BUILD_BENCHMARKS` Build the benchmark programs. `OFF` by default unless in
  `Dev` build. You only need this if you intend to run the benchmarks.
* `BUILD_DATA_TESTS` Build the _data tests_. This if `OFF` by default unless in
   `Dev` build. These tests need OSM test data from a different repository, so
   they are a bit more difficult to run. See [[Testing Libosmium]] for details.
* `BUILD_EXAMPLES` Build the examples. `ON` by default. The examples will be in the `examples` directory.
* `BUILD_HEADERS` This is `OFF` by default unless in `Dev` build, because it is
   only interesting for Libosmium developers. This will build every Libosmium
   header file by itself to check if the include dependencies are all set
   correctly.
* `BUILD_TESTING` Build the unit tests. `ON` by default. See [[Testing Libosmium]] for details.


## Building on Linux and Mac OS/X

Linux: Osmium is developed on Linux and tested best on that system. Debian
Jessie (testing) and current Ubuntu systems come with everything needed for
Osmium. Debian wheezy (stable) and the Ubuntu LTS release 12.04 don't have
compilers current enough. If you are stuck on these systems, use a backported
compiler.

Mac OSX: Osmium also works well on Mac OSX with the exception of the parts that
need the mremap system call that is not available on Mac OSX.

First clone Libosmium from the git repository (or install it in some other way):

    git clone https://github.com/osmcode/libosmium
    cd libosmium

Then create a directory in which the build should happen. In this documentation
we will use the directory `build`, but you can choose any other name. You can
have several build directories at the same time with different build options
and they will not interfere with each other.

    mkdir build
    cd build

The call CMake to create an initial configuration:

    cmake ..

CMake will check your system, determine locations of programs, include headers,
libraries etc. It will also set some default build options. You can then call

    ccmake ..

to enter a cursed-based tool that allows you to edit any configuration setting.
Use the cursor keys to choose any variable and press `Enter` to change it. Once
you are done, press `c` to configure and handle any errors that might appear.
You might have to do this step several times. Then press `g` to generate the
configuration and exit the program. For more advanced usage info, see the
`ccmake` help.

Now you can call

    make

to complete the build.

For Mac users: If you have clang 3.2 or newer, use the system compiler. If not
you have to build the compiler yourself. See the instructions on
http://clang.llvm.org/ .


## Building on Windows

You need a rather new Visual C++ compiler for this to work. Visual C++ 2013
(a.k.a 12.0) is __not__ supported. You'll need 2014 CTP or the 2015 Preview.
This is due to the limited C++11 support in earlier versions of Visual C++.

The easiest way on Windows is to use `windows-builds` repository
(https://github.com/mapbox/windows-builds).

When the pre-requisites (Visual Studio 2014/2015, git) are in place, it should
not take more than these steps to compile libosmium:
 
```
git clone https://github.com/mapbox/windows-builds.git
cd windows-builds
settings.bat
scripts\build_libosmium_deps
scripts\package_libosmium_deps
scripts\build_libosmium vs
```


## Building the reference documentation

To build the documentation you'll need [[Doxygen|Libosmium
dependencies#doxygen]].

After configuring with CMake as described above, call

    make doc

to create the reference documentation.


## If something didn't work

Here are some tips if your build failed:

* Make sure you have all dependencies installed. Sometimes it is not easy to
  see from the error message which dependency is missing.
* Usually CMake and Make are quite good at tracking what needs rebuilding when
  you change configurations etc. But sometimes they get confused. Try
  restarting from scratch with an empty build directory.
* Check the `cmake` output to see if there are any warnings.
* Try `cmake` with `-DOsmium_DDEBUG=ON` to see some more debug information.
* Run `make VERBOSE=1` to see the commands Make is calling.
* Check the advanced CMake configuration section below.


## Advanced CMake configuration

The following variables can be set in the CMake configuration to further change
the build. Changes here are usually not necessary though:

* `BENCHMARK`: If `BUILD_BENCHMARKS` is `ON`, this variable contains the
  semicolon-separated list of all benchmarks that should be built. The prefix
  `osmium_benchmark_` will be added to all executables.
* `EXAMPLES`: If `BUILD_EXAMPLES` is `ON`, this variable contains the
  semicolon-separated list of all examples that should be built. The prefix
  `osmium_` will be added to all executables.
* `OSMIUM_WARNING_OPTIONS`: C++ compiler warning options used in `Dev` mode.


## Large File Support

When working with OSM data you often have very large files with
several gigabytes. This can lead to problems on 32bit systems.
Use the options

    -D_LARGEFILE_SOURCE -D_FILE_OFFSET_BITS=64

for the compiler to make sure that large files work. 


## Running CPPCheck

To check for problems in the source code not detected by compilers, you can run
the `cppcheck` command. If it is installed and CMake found it, you can call
Make with the `cppcheck` target:

    make cppcheck

This will check all `.hpp` and `.cpp` files and can take a while.

