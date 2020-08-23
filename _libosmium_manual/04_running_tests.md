---
chapter: 4
title: Running tests
---

Libosmium uses version 1 of the [Catch](https://github.com/catchorg/Catch2)
unit testing framework and CTest which is part of the
[CMake](https://cmake.org/) suite.

There are three kinds of tests: _unit tests_, _data tests_, and _example
tests_. For the details see below.

Tests should never fail. If they do fail in your environment, please report
this as a bug. Some tests will be disabled on some platforms if they are
testing functionality thats not available on that platform. Some tests will be
disabled on your host if you don't have the needed
[dependencies](#dependencies) installed.


## Running the tests

To run the tests, build the project es described in the [Building
Libosmium](#building-libosmium) chapter and then run

``` sh
ctest
```

which will run all the configured tests. You can run all tests matching a
pattern with something like

``` sh
ctest -R 'io_.*'
```

or exclude tests from being run with something like

``` sh
ctest -E io_test_reader
```

If there is some problem you can enable verbose mode:

``` sh
ctest -V
```

See the [CTest
documentation](https://cmake.org/cmake/help/latest/manual/ctest.1.html) for
more details.


## Labels

CTest allows tests to be labeled to categorize them. All unit tests have the
label `unit` and a label for their category (the directory under `test/t`). All
data tests have the label `data`. In addition all tests are labeled as `fast`
or `slow`. Fast tests don't take a noticable amount of time, slow tests do.

You can run all tests with labels matching a regular expression with `-L`. So
to run only fast tests use

``` sh
ctest -L fast
```

You can use

``` sh
ctest --print-labels
```

to see all available labels.


## Unit tests

Unit tests check small parts of Libosmium. They can be found in the directories
under `test/t`. If you are installing Libosmium, you should probably run these
tests to make sure Libosmium works in your environment.

Unit tests are enabled or disabled with the `BUILD_TESTING` CMake setting.
Different tests have different dependencies and CMake will disable all tests
that don't have their dependencies met.

You can also run the unit tests manually without going through CTest. After
building they are in the `build/test` directory. Call them with `--help` to see
options.


## Data tests

Data tests need external OSM test data to run. They are enabled or disabled
with `BUILD_DATA_TESTS`, but you have to install the test data for them to
work. For this call `git submodule update --init` in the libosmium repository.

If you have put the test data somewhere else, you can use the `OSM_TESTDATA`
variable in CMake to point to that directory.

The `testdata-multipolygon` test needs
[Spatialite](https://www.gaia-gis.it/gaia-sins/index.html) and
[Ruby](https://www.ruby-lang.org/) with the `json` gem installed. Those
dependencies are currently not checked for in the CMake configuration.

*Note that older versions of libosmium don't have the test data installed as a
submodule, but expect it to be in the same directory you installed Libosmium
in. To do this clone the osm-testdata repository:*

``` sh
git clone https://github.com/osmcode/osm-testdata
```

## Example tests

Some example programs come with tests. Those tests are under `test/examples`.
They run the example programs with some arguments to check basic functionality.
Currently these tests are very rudimentary.

