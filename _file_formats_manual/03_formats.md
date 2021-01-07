---
chapter: 3
title: File Formats
---

There are several different OSM file formats in common use. File formats
describe the way the content is encoded in bits and bytes on disk or on the
wire. Osmium can read and write most of these formats. Here is an overview,
later chapters will go into more details.

**XML**
:   The original XML-based OSM format. This format is rather verbose and
    working with it is slow, but it is still used often and in some
    cases there is no alternative. The main OSM database API also returns
    its data in this format. More information about this format on the
    [OSM Wiki](https://wiki.openstreetmap.org/wiki/OSM_XML).

**PBF**
:   The binary format based on the Protocol Buffers encoding. This is the
    most compact format. More information on the
    [OSM Wiki](https://wiki.openstreetmap.org/wiki/PBF_Format).

**O5M**/**O5C**
:   This binary format is simpler than the PBF format but not used as widely.
    Osmium can read this format to be compatible with other software, but not
    write it. O5m is the format for data files, O5c the version for change
    files. More information on the
    [OSM Wiki]https://wiki.openstreetmap.org/wiki/O5m).

**OPL**
:   A simple format similar to CSV-files with one OSM entity per line. This
    format is intended for easy use with standard UNIX command line tools such
    as `grep`, `cut`, and `awk`. See the [OPL File Format
    Manual](/opl-file-format/) for details.

**DEBUG**
:   A nicely formatted text-based format that is easier to read for a human
    than the XML or OPL formats. As the name implies this is intended for
    debugging. The format can only be written by Osmium, not read.

**BLACKHOLE**
:   A "dummy" format that throws away all data. Can only be written to, not
    read from.

See below for more detailed descriptions.


## Compression

Files in the text-based formats (XML, OPL, Debug) can optionally be compressed
using `gzip` or `bzip2`.

Osmium will handle this internally. Just use the right file name suffix
(`.osm.gz`, or `.opl.bz2` for instance) for this to work.


## Ordering of objects in files

All OSM files can have the entities they contain in any order. This is
independant of the type or format of the file. Usually the entities are sorted
in a specific way, but whether the entities are sorted or not and in what way
is not part of the file format itself.

When you tell Osmium to read a file, it will always gives you the entities in
the order they are in the file. And when you write to a file, you give the
entities to Osmium in a certain order and they will end up in the file in that
order. To be consistent and performant, Osmium doesn't re-order anything for
you. If it would enforce some kind of order, it might have to do extra work,
that you might not need or want.

All of this being said, OSM files are almost always ordered in a specific way:
First nodes, then ways, then relations. Each group ordered by ascending ID (and
ascending version in history files). Changeset files are usually ordered by
changeset ID.

If you write software built on Osmium you have to decide whether you impose any
restrictions on the internal order of input files and whether you want to
guarantee any order when writing out files. This mostly has something to do
with performance and ease of programming. Ordered files are often easier and
faster to work with, but not necessarily so. You should always think about this
issue and document what your programs expect or generate.

While reading and writing files with Osmium is independant of entity order,
some other parts of Osmium might expect certains orders or guarantee to
generate data in certain orders. Look for those details in the rest of the
documentation.


## Header data

Some file formats (XML, PBF, O5M, and Debug, but not OPL) have a file *header*
that contains metadata about the file. Which data is available differs widely
between formats and most of the data is optional and often not available or
inaccurate.

The Osmium library gives you access to the header data when reading files and
you can set header fields when writing a file.


## Accessing Files

Usually Osmium-based programs will allow you to tell them the _name_ of an
input or output file and, optionally a _format description_. Osmium detects
the format of a file from the file name suffix, so usually you do not have
to set the format explicitly.

Osmium knows about the following suffixes:

| Format | Suffix | Description
| ------ | ------ | ------------
| XML    | .osm   | XML data or changeset file, can also be a history file
| XML    | .osh   | XML history file
| XML    | .osc   | XML change file
| PBF    | .pbf   | PBF
| OPL    | .opl   | OPL
| O5M    | .o5m   | o5m data file
| O5C    | .o5m   | o5c change file
| DEBUG  | .debug | DEBUG

You can stack formats: For example `.osm.pbf` is the same as `.pbf`, `.osh.pbf`
is a history file in PBF format.

The change file format (`.osc`) is only available in the XML version, use
`.osh` instead for other formats.

Osmium supports compression and decompression of XML, OPL, and DEBUG files
internally using the GZIP and BZIP2 formats. As usual, these files have an
additional suffix `.gz`, or `.bz2`.

So a typical PBF file will be named `planet.pbf` or `planet.osm.pbf`, a
packed history file in XML format could be named `history.osh.bz2`.

If the file name does not end in the suffix needed for autodetection, you
have to supply a format string to Osmium describing the format. Just use
the suffix the file name would have as a format string:

File name: `foobar`, Format: `.osm.opl`

This is needed most often when referring to STDIN or STDOUT. To refer to
STDIN or STDOUT use an empty filename or a single hyphen (`-`).

File name: `-`, Format: `.osm.pbf`


## File Format Options

Some file formats allow different options to be set. Options follow in a
comma-separated list after the file name format. So, for instance, the PBF
format allows two different ways of writing nodes to the file, by default
the *dense* format is used, but you can disable it like this:

File name: `foo.pbf`, Format: `.pbf,pbf_dense_nodes=false`

Note that, if a format is given, it must always start with the format
description, even if the file name has the correct suffix.

Here is a list of optional settings currently supported:

| Format        | Option                  | Default | Description
| ------        | ------                  | ------- | -----------
| PBF           | `pbf_dense_nodes`       | true    | Use DenseNodes (more space efficient)
| PBF           | `pbf_compression`       | zlib    | Compression for PBF blocks (`none`, `zlib`, `lz4`)
| PBF           | `pbf_compression_level` |         | Compression level for PBF blobs
| XML           | `xml_change_format`     | false   | Set change format, can also be set by using `osc` instead of `osm` suffix
| XML           | `force_visible_flag`    | false   | Write out `visible` flag on each object, also set if `osh` instead of `osm` suffix used
| *all*         | `add_metadata`          | true    | *see below*
| PBF, XML, OPL | `locations_on_ways`     | false   | Add node locations to way nodes (libosmium-specific extension)
| DEBUG         | `use_color`             | false   | Output with ANSI colors
| DEBUG         | `add_crc32`             | false   | Add CRC32 checksum to all objects

### Writing metadata on OSM objects (`add_metadata`)

There are several metadata attributes on OSM objects:
* id
* version
* timestamp
* changeset
* uid
* user

Usually all these attributes are written out to a file, but you can decide
which attributes you want and which you want to leave out. The `id` attribute
will always be added.

You can set the file format option to these values:

* `true`, `yes`, `all`: Add all attributes. This is the default.
* `false`, `no`, `none`: Only add `id` attribute
* A list of one or more attributes separated by `+` (plus sign): Only add
  those attribute (and the `id` attribute) (Example:
  `add_metadata=version+timestamp`).

*Note: In libosmium versions up to 2.13.x it was only possible to set this
option to `true` or `false`. Adding only some attributes to OSM files but not
others was not possible.*

*Note that some programs reading OSM files might not work correctly if no or
only some of the attributes are present.*

