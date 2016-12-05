---
chapter: 4
title: Showing OSM files
---

Before you can do anything with an OSM file you'll often want to know what's in
that file. To find out run

    osmium fileinfo OSMFILE

Say you downloaded an extract of the tiny country of
[Liechtenstein](https://www.openstreetmap.org/relation/1155955)
(it is always good to start your experiments with a small extract)
from [Geofabrik](http://download.geofabrik.de/)
and want to know what's in it:

    osmium fileinfo liechtenstein-latest.osm.pbf

This will show you something like the following:

    File:
      Name: liechtenstein-latest.osm.pbf
      Format: PBF
      Compression: none
      Size: 1532846
    Header:
      Bounding boxes:
        (9.47108,47.0477,9.63622,47.2713)
      With history: no
      Options:
        generator=Osmium (http://wiki.openstreetmap.org/wiki/Osmium)
        osmosis_replication_timestamp=2016-04-12T19:14:02Z
        pbf_dense_nodes=true
        timestamp=2016-04-12T19:14:02Z

The `File` section contains the information gleaned from the file system,
the `Header` section contains, as the name implies, the information from the
file header. To get some more detail use the `-e` or `--extended` flag:

    osmium fileinfo -e liechtenstein-latest.osm.pbf

In this case the whole file will be read, which will take more time. But it
gives you a lot more information:

    File:
      Name: liechtenstein-latest.osm.pbf
      Format: PBF
      Compression: none
      Size: 1532846
    Header:
      Bounding boxes:
        (9.47108,47.0477,9.63622,47.2713)
      With history: no
      Options:
        generator=Osmium (http://wiki.openstreetmap.org/wiki/Osmium)
        osmosis_replication_timestamp=2016-04-12T19:14:02Z
        pbf_dense_nodes=true
        timestamp=2016-04-12T19:14:02Z
    Data:
      Bounding box: (9.39778,46.9688,9.67146,47.5258)
      Timestamps:
        First: 2007-06-19T06:25:12Z
        Last: 2016-04-11T07:49:32Z
      Objects ordered (by type and id): yes
      Multiple versions of same object: no
      CRC32: 727f1abf
      Number of changesets: 0
      Number of nodes: 168683
      Number of ways: 18784
      Number of relations: 374
      Largest changeset ID: 0
      Largest node ID: 4112691184
      Largest way ID: 409348773
      Largest relation ID: 6122095

Sometimes your are only interested in a specific piece of information from this
list. Use the `-g`, `--get` option to ask for it. For instance to get the last
timestamp used:

    osmium fileinfo -e -g data.timestamp.last liechtenstein-latest.osm.pbf

This will result in just the timestamp:

    2016-04-11T07:49:32Z

This format makes it easy to use the output in other shell commands. To put the
CRC32 checkum into the `checksum` shell variable you can use the following
command, for instance:

    checksum=$(osmium fileinfo -e -g data.crc32 $filename)

Of course you might also want to look at the contents of the file. For a quick
look, use the `show` command:

    osmium show liechtenstein-latest.osm.pbf

This will show the contents of the file in the *debug* format (more on the
different formats below) using your favourite pager (`less` by default):

![osmium show](/osmium-tool/osmium-show.png)

This *debug* format is intended to be easy to read, on terminals that support
it, colors make it even easier. But you can change the output format to any
format supported by Osmium.

