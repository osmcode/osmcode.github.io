---
chapter: 11
title: Working with history files
---

Osmium can not only work with normal OSM data files, but also with history
files. History files look more or less like normal OSM data files, but they
can contain several versions of the same object. The [full history planet
dump](http://planet.osm.org/planet/full-history/) contains all versions of all
objects that ever existed in the OSM data.

Most programs using OSM data expect object IDs to be unique, so they can not
work with history data. The same is true for some Osmium subcommands. But
wherever it is possible and makes sense, Osmium also supports history files.
Often they will just work, sometimes you need special command line options.

Commands that "just work" are `cat`, `fileinfo`, `show`, `sort`. They will do
what you expect. The `apply-changes` and `extract` commands have an option
`--with-history` that makes them work with history files.

One command is only useful for history files: `time-filter`. It is used to
filter objects from a history file based on time. To get all objects visible
at a point in time use a command line like this:

    osmium time-filter history.osm.pbf 2015-01-01T00:00:00Z -o 2015.osm.pbf

The output is a normal OSM data file containing the data as it would have
looked at the start of the year 2015 (UTC time as always with OSM).

