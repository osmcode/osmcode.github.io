---
chapter: 4
title: Running tests
---

Libosmium uses the [Catch](https://github.com/philsquared/Catch/) unit testing
framework and CTest which is part of the [CMake](http://www.cmake.org/) suite.

There are two kinds of tests: _unit tests_ and _data tests_. For the details
see below.

Tests should never fail. If they do fail in your environment, please report
this as a bug. Some tests will be disabled on some platforms if they are
testing functionality thats not available on that platform. Some tests will be
disabled on your host if you don't have the needed [[dependencies|Libosmium
dependencies]] installed.


## Running the tests

To run the tests, build the project es described in [[Building Libosmium]] and
then run

    ctest

which will run all the configured tests. You can run all tests matching a
pattern with something like

    ctest -R 'io_.*'

or exclude tests from being run with something like

    ctest -E io_test_reader

If there is some problem you can enable verbose mode:

    ctest -V

See the CTest documentation for more details.


## Labels

CTest allows tests to be labeled to categorize them. All unit tests have the
label `unit` and a label for their category (the directory under `test/t`). All
data tests have the label `data`. In addition all tests are labeled as `fast`
or `slow`. Fast tests don't take a noticable amount of time, slow tests do.

You can run all tests with labels matching a regular expression with `-L`. So
to run only fast tests use

    ctest -L fast

You can use

    ctest --print-labels

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
work. In the same directory you installed Libosmium in, clone the osm-testdata
repository:

    git clone https://github.com/osmcode/osm-testdata

If you have put the test data somewhere else, you can use the `OSM_TESTDATA`
variable in CMake to point to that directory.

The `testdata-multipolygon` test needs
[Spatialite](http://www.gaia-gis.it/gaia-sins/index.html) and
[Ruby](https://www.ruby-lang.org/) with the `json` gem installed. Those
dependencies are currently not checked for in the CMake configuration.


## Testing with Valgrind

You can run tests under the [Valgrind](http://valgrind.org/) memory checker
with

    ctest -D ExperimentalMemCheck

Note that this is much slower than normal tests and will probably report some
false positives.


