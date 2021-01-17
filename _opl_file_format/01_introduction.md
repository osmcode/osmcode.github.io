---
chapter: 1
title: Introduction
---

The OPL ("Object Per Line") format was created to allow easy access to and
manipulation of OpenStreetMap data with typical UNIX command line tools such as
`grep`, `sed`, and `awk`, or typical scripting languages such as Python, Ruby
or Perl. It is also great for writing compact test cases.

In an OPL file each OSM object is on its own line with a newline character at
the end. Each line contains fields separated by spaces.

This makes some ad-hoc OSM data manipulation easy to do, but it is not as fast
as some specialized tool.

OPL files are only about half the size of OSM XML files, when compressed (with
gzip or bzip2) they are about the same size.

Osmium can read and write OPL files.

