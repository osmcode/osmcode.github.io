---
chapter: 13
title: Sorting OSM files
---

OSM files are usually sorted in a specific way: First the nodes ordered by
ID, then ways ordered by ID, then relations ordered by ID. But this is not
necessarily so. `osmium fileinfo` will tell you if a file is sorted or not:

    > osmium fileinfo -e input.osm.pbf
    ...
    Objects ordered (by type and id): yes
    ...


Many commands (Osmium or otherwise) only work correctly if the file is sorted.
Sorting a file is easy:

    osmium sort input.osm.pbf -o output.osm.pbf

Note that `osmium sort` reads the contents of the input file into main memory.
This will take roughly 10 times as much memory as the files take on disk in
.osm.bz2 or osm.pbf format. So this command is only useful for smaller OSM
files.

Osmium `sort` will work correctly on history and change files.

