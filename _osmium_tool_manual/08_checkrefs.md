---
chapter: 8
title: Checking references
---

A full planet dump is referentially complete. All objects referenced by other
objects are in the file. So if a relation has a member way 123, then this way
will also be in the file. This is not always true for geographical extracts or
other partial OSM files.

This often leads to confusion. Many programs that use OSM data will fail
in unexpected ways when something is missing in its input data. If you have
a situation like this you can use the `check-refs` command to find out whether
your OSM file is referentially complete:

    osmium check-refs input.osm.pbf

This command will check that all nodes referenced in the ways are in the input
file. If you want to check relation members, too, use the `-r` or
`--check-relations` option.

