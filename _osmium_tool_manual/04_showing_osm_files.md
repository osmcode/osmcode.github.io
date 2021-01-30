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
from [Geofabrik](https://download.geofabrik.de/)
and want to know what's in it:

    osmium fileinfo liechtenstein-latest.osm.pbf

This will show you something like the following:

    File:
      Name: liechtenstein-latest.osm.pbf
      Format: PBF
      Compression: none
      Size: 2397841
    Header:
      Bounding boxes:
          (9.471078,47.04774,9.636217,47.27128)
      With history: no
      Options:
        generator=osmium/1.8.0
        osmosis_replication_base_url=http://download.geofabrik.de/europe/liechtenstein-updates
        osmosis_replication_sequence_number=2866
        osmosis_replication_timestamp=2021-01-29T21:41:04Z
        pbf_dense_nodes=true
        timestamp=2021-01-29T21:41:04Z

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
      Size: 2397841
    Header:
      Bounding boxes:
        (9.471078,47.04774,9.636217,47.27128)
      With history: no
      Options:
        generator=osmium/1.8.0
        osmosis_replication_base_url=http://download.geofabrik.de/europe/liechtenstein-updates
        osmosis_replication_sequence_number=2866
        osmosis_replication_timestamp=2021-01-29T21:41:04Z
        pbf_dense_nodes=true
        timestamp=2021-01-29T21:41:04Z
    Data:
      Bounding box: (8.8331793,46.9688169,9.6717077,47.5258072)
      Timestamps:
        First: 2007-06-19T06:25:12Z
        Last: 2021-01-29T20:29:57Z
      Objects ordered (by type and id): yes
      Multiple versions of same object: no
      CRC32: not calculated (use --crc/-c to enable)
      Number of changesets: 0
      Number of nodes: 270019
      Number of ways: 27962
      Number of relations: 853
      Smallest changeset ID: 0
      Smallest node ID: 26032956
      Smallest way ID: 4781367
      Smallest relation ID: 8497
      Largest changeset ID: 0
      Largest node ID: 8376540565
      Largest way ID: 899612122
      Largest relation ID: 12192313
      Number of buffers: 402 (avg 743 objects per buffer)
      Sum of buffer sizes: 25005184 (0.025 GB)
      Sum of buffer capacities: 26345472 (0.026 GB, 95% full)
    Metadata:
      All objects have following metadata attributes: version+timestamp
      Some objects have following metadata attributes: version+timestamp

Sometimes your are only interested in a specific piece of information from this
list. Use the `-g`, `--get` option to ask for it. For instance to get the last
timestamp used:

    osmium fileinfo -e -g data.timestamp.last liechtenstein-latest.osm.pbf

This will result in just the timestamp:

    2021-01-29T20:29:57Z

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

