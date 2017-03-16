---
chapter: 11
title: Working with Change files
---

While OSM data files contain the OSM data of a specific point in time and
OSM history files contain all the data that is now and ever was in the data,
an OSM change file contains the data that changed between two points in
time. Those change files (usually with the suffix `.osc` or `.osc.gz` or
`.osc.bz2`) can be used to update an OSM file or OSM database from an earlier
state to a later state.

Osmium has commands to deal with those change files. Most often you will use
the `apply-changes` command which applies one or more change files to a data
file:

    osmium apply-changes planet.osm.pbf change-123.osc.gz change-124.osc.gz \
        -o planet-new.osm.pbf

You can give as many change files as you want on the command line and in any
order. All changes will be read into memory and sorted before they are applied
to the data file. If you have a lot of change files, it might be better to
apply them one bunch at a time so this will not use too much memory.

The same command also works with history files:

    osmium apply-changes australia.osh.pbf australia-changes.osc.bz2 \
        -o australia-new.osh.pbf

Note the `.osh` file suffix which tells Osmium that you want your history file
updated. Sometimes history files are named `.osm`. In this case you can force
history mode with a command line option:

    osmium apply-changes australia.osh.pbf australia-changes.osc.bz2 \
        --with-history -o australia-new.osh.pbf

Sometimes you don't want to apply changes to an OSM file, but to a database
or so. For instance when you are upgrading a `osm2pgsql` rendering database.
If you have a lot of change files, it is often better to merge them into one
larger change file and then use that one to do the database import. Merging is
done with

    osmium merge-changes --simplify ch456.osc.gz ch457.osc.gz \
        -o merged-changes.osc.gz

The `--simplify` option usually makes sense: If an object changed multiple
times, all intermediate versions will be removed and only the last version
remains.

Osmium can also do the reverse: Create a change file from two OSM data files.
This is done with `derive-changes`:

    osmium derive-changes yesterday.osm.pbf today.osm.pbf \
        -o changes-since-yesterday.osc

There is another command that, on the surface, appears to be similar to
`derive-changes` but serves a totally different purpose, the `diff` command.
The `diff` commands allow you to see the difference between any two OSM files
in various formats. It compares all details of all OSM objects, so it will,
for instance, detect if there is an object with the same type, id, and version,
but different timestamp. This is different from the `derive-changes` command
which will only look at the object type, id, and version to do its work.

The difference in behaviour comes from the different intended uses. The
`derive-changes` command is only used to, well, derive a change file from
two OSM files. Those OSM files must be snapshots of the OSM database or some
extracts from different points in time. The `diff` command, on the other hand,
can be used to check *any* two OSM files. This is useful for instance for
developers who want to compare the output of two different versions of the
same program creating some kind of OSM file.

