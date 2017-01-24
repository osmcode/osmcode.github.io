---
chapter: 9
title: Creating Extracts
---

There is often the need to create a geographical extract of OSM data that only
contains the data for a specific region. Instead of working with the huge
amount of data for the whole planet, further work can then be done with much
less data.

### Creating an extract

Osmium can create such an extract with the `osmium extract` command. Here is a
simple example that will cut (from the file called `france.pbf`) everything
inside the given bounding box, in this case the city of Paris roughly inside
the ring road and write it out into the file `paris.pbf`:

    osmium extract -b 2.25,48.81,2.42,48.91 france.pbf -o paris.pbf

If you happen to have a polygon describing Paris, you can use it instead:

    osmium extract -p paris-polygon.geojson france.pbf -o paris.pbf

This assumes you have the polygon in [GeoJSON format](http://geojson.org/) in
the file `paris-polygon.geojson`. Osmium also understands the [`POLY`
format](https://wiki.openstreetmap.org/wiki/Osmosis/Polygon_Filter_File_Format),
a text-based format popularized first by Osmosis and sometimes used in the OSM
world to specify such polygons:

    osmium extract -p paris-polygon.poly france.pbf -o paris.pbf

Osmium can also read an OSM file with a (multi)polygon in it that specifies
the area to cut out. If you know the relation ID of such a multipolygon, you
can download it from the OSM server using a URL such as this:

    http://www.openstreetmap.org/api/0.6/relation/RELATION-ID/full

For Paris this could be

    http://www.openstreetmap.org/api/0.6/relation/7444/full

This works well for smaller multipolygons (such as city boundaries), but for
very large multipolygons (such as a whole country) chances are you'll get a
timeout from the API. If you have an OSM file lying around that contains the
boundary, you can use osmium to get the relation and all the nodes and ways
used in that relation:

    osmium getid -r france.pbf r7444 -o paris-boundary.osm

And now you can create the extract:

    osmium extract -p paris-boundary.osm france.pbf -o paris.pbf


### Creating multiple extracts in one go

Often you want to create several extracts from the same source, say one extract
for each département (administrative division) in France. For the 101
départments in France, this would mean you have to read the input file
that many times. Fortunately there is another way: You can specify the extracts
you want to create in a config file and then osmium can do all extracts in one
go:

    osmium extract -c departments.json france.pbf

Note that this time no output file was named on the command line. Instead the
output file names are specified in the config file. The config file (here
`departments.json`) is in JSON format and looks something like this:

    {
        "directory": "/tmp/",
        "extracts": [
            {
                "output": "dep01-ain.osm.pbf",
                "polygon": {
                    "file_name": "dep01-ain.geojson",
                    "file_type": "geojson"
                }
            },
            {
                "output": "dep02-aisne.osm.pbf",
                "polygon": {
                    "file_name": "dep02-aisne.geojson",
                    "file_type": "geojson"
                }
            },
            ...
        ]
    }

The `directory` names the common output directory (use `--directory` or `-d`
on the command line to overwrite this). And each member of the `extracts`
array specifies one extract to create. Just as on the command line you can
specify the extract by bounding box or polygon (using any of the supported
file formats). There are several ways to specify all the details. See the
[`osmium-extract(1)` man
page](http://docs.osmcode.org/osmium/latest/osmium-extract.html) and the
[example
config](https://github.com/osmcode/osmium-tool/tree/master/extract-example-config)
for the details.


### Extract strategies

Osmium offers three different *strategies* governing how the extract should
be created. Their results are different, more or less OSM objects will be
included in the output. They also differ in memory consumption and how often
they will read the input file.

#### Strategy: simple

![Extract strategy *simple*](/osmium-tool/extract-strategy-simple.svg)

When using the *simple* strategy, all nodes inside the specified region are
included and all nodes that are outside the region are not included. All ways
that have at least one node inside the region are included, but they might be
missing some nodes, they are not reference-complete. Only relations that have
a node or way that is already in the extract are included. Relations are not
reference-complete.

For the *simple* strategy the input file is only read once. This is the only
strategy that will work if the input is read from STDIN or the output written
to stdout.

#### Strategy: complete_ways

![Extract strategy *complete_ways*](/osmium-tool/extract-strategy-complete-ways.svg)

When using the *complete_ways* strategy, all nodes inside the specified region
as well as all nodes used by ways that are partially inside the specified
region will be in the output. All ways in the output will always be
reference-complete (if they were reference-complete in the input). So in the
example image the red, green, and cyan ways will be in the output with all
their nodes. The blue way is not in the output, because none of its nodes is in
the region, even though the beginning and end nodes will be in the output.
All relations that have any already included nodes or ways are in the output
as well as any of their parent relations and so on. Relations are not
reference-complete.

For the *complete_ways* strategy the input file is read twice.

For the *complete_ways* strategy is the only strategy that can be used on
history files, too. You have to add the `--with-history` option for this to
work. All objects that have at least one version in the output, will be in
the output with all their versions. So if a node moved from inside the region
to outside, all versions of this node will be in the output as well as all
ways referencing this node and so on.


#### Strategy: smart

![Extract strategy *smart*](/osmium-tool/extract-strategy-smart.svg)

When using the *smart* strategy, everything is done as in the *complete_ways*
strategy, but multipolygon relations that have at least one node in the
region will also be completely included. You can see this in the example image:
If a multipolygon relation ties the red, green, and blue ways together, the
blue way and all its nodes will be included.

By default this only works for relations tagged `type=multipolygon`, because
this is what is needed most often. A lake or forest crossing the boundary of
your region will be in the extract completely. But a boundary for instance
will not be, otherwise you might get a huge boundary around a whole country in
your extract when all you wanted was a small area at the border. You can change
this behaviour with the `-S` or `--option` option. If you want all relation
types, use `-S all`, if you only want particular types, specify them like
this: `-S multipolygon,route`.

For the *smart* strategy the input file is read three times.


### Performance and memory use

If you are trying to cut out all 101 départments from France, you'll most
likely run into difficulties, because this will need a huge amount of memory.
Osmium has to keep track of all the IDs of all nodes, ways, and relations it
needs for *each* extract. It depends on the strategy used, but you'll need
between 1 and 2 GByte RAM for each extract. You can solve this by running
`osmium extract` several times, each time cutting out smaller and smaller
areas. In our example here it might make sense to extract in a first round
each of the regions of France and then have one round per region cutting it
into the smaller départments.

There is a (small) difference in the performance between cutting out by
bounding box and by polygon. It is fastest to extract using a bounding box, for
polygons the performance depends on how detailed the polygon is. But unlike
some other tools that don't work well with very detailed polygons, this has
only a relatively small effect in Osmium. But if you want to do your extracts
often, check the performance of different strategies and region specifications
and find out what works best for you.

