---
chapter: 7
title: Getting OSM objects by ID
---

Sometimes you have the ID of a node, way or relation (or a bunch of IDs) and
want to get the objects with those IDs from a file. That's what the `getid`
command is for. The following command will get the nodes 17 and 18, the way
42, and the relation 3 out of the file:

    osmium getid input.osm.pbf n17 n18 w42 r3 -o output.osm.pbf

As you can see the IDs are written with a one-letter prefix denoting the type.
IDs without this prefix are understood to be node IDs (but this can be changed
with the `--default-type` option).

If you have more than a few IDs you can put them into a file, one ID per line
and use the `-i` option to read them from that file:

    osmium getid input.osm.pbf -i ids -o output.osm.pbf

Empty lines and everything after a space or hash (#) sign is ignored. And you
can read from STDIN. So this command

    echo "r123 foo bar" | osmium getid input.osm.pbf -i - -f debug

will find the relation with the ID 123 in `input.osm.pbf` and output it to
STDOUT in debug format.

Often you need not only the OSM objects with the given IDs but also all
objects referenced by those objects. So for ways you need the nodes in it
and for relations the members. Use the `-r` or `--add-referenced` option to
add them to the output:

    osmium getid -r input.osm.pbf w222 -o output.osm.pbf

The output will contain first all nodes references by way 222 and then the
way. The `getid` command will read the input file up to three times to
follow all the references. Output will be sorted in the usual fashion: first
nodes ordered by ID, then ways, then relations.

