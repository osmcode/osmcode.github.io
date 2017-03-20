---
chapter: 10
title: Filtering by tags
---

We are often interested in only a subset of the OSM data, maybe only the roads
(if we want to do navigation on them), or all restaurants, or everything that
is some kind of forest.

Osmium supports this through the `tags-filter` command. For example to get
everything in Rome that's a road, you could use something like:

    osmium tags-filter rome.osm.pbf w/highway \
        -o highways-in-rome.osm.pbf

The `w/highway` tells Osmium that we are looking for all ways that have a tag
with key `highway`. If we want to look for more specific road types, we can
do that, too, with something like `w/highway=primary`. Finding all the primary
roads would look like this:

    osmium tags-filter rome.osm.pbf w/highway=primary \
        -o highways-in-rome.osm.pbf

You can filter by several expressions at the same time, so finding everything
that's tagged as some kind of wooded area is easy:

    osmium tags-filter park.osm.pbf wr/natural=wood wr/landuse=forest \
        -o wooded-areas.osm.pbf

The first positional parameter after `tags-filter` is always an OSM file, all
the following ones are filter expressions. Filter expressions start with the
type or types of objects we want to filter (`n` for nodes, `w` for ways, and
`r` for relations) and than something describing the key and optionally the
value of a tag. So this will find all nodes tagged as restaurant:

    n/amenity=restaurant

But POIs can also be mapped as area, so we really have to look for the ways
and relations, too:

    nwr/amenity=restaurant

This can be shortend to just

    amenity=restaurant

Also allowed are lists of values:

    w/highway=motorway,trunk,primary

This also works in keys:

    n/name,name:en=London

Or you can exclude a specific value:

    r/type!=multipolygon,route

This will find all relations that have a `type` key with a value that's not
`multipolygon` and not `route`.

An asterisk at the end signals that this should be a prefix check. Everything
with a tag starting with `addr:` can be found this way:

    n/addr:*

An asterisk at the beginning turns this into a substring search:

    nw/name=*school

will find any nodes or ways that have the word `school` in their name. Osmium
always uses a case-sensitive search, so you might have to use something like
this to get everything:

    nw/name=*school nw/name=*School

Note that in all these cases you will get the full objects back. Osmium is not
removing tags from objects, it is only filtering complete objects from the
input based on those tags.

Osmium will automatically add all nodes referenced by the ways it found and all
members referenced by the relations it found. If you don't want this, you can
use the `--omit-referenced` or `-R` option. So

    osmium tags-filter rome.osm.pbf -R name=Via* \
        -o via.osm.pbf

will find only the ways named with something starting with `Via`, but will not
include the nodes needed to draw those ways on a map.

Sometimes it is useful to filter the other way around. Let's say you want to
work with some OSM data, but don't know yet what tags you need exactly. But
you do know that you are definitely not interested in buildings. Then you can
use the `--invert-match` or `-i` option to invert the sense of your match:

    osmium tags-filter -i city.osm.pbf wr/building \
        -o no-buildings.osm.pbf

As always, you can find all the details in the [man
page](http://docs.osmcode.org/osmium/latest/osmium-tags-filter.html)

