---
title: OSM Files
---

# OSM Files

OSM uses several different *types* of files containing different
types of data and it uses different *formats* to "encode" this data into bits
and bytes in the files.

Most programs using OSM data will need to read OSM files and/or write to
OSM files. Osmium supports most common types and formats.

## File types

OSM uses three types of files for its main data:

**Data files**
:   These are the most common files containing the OSM data at a specific point
    in time. This can either be a planet file containing *all* OSM data or some
    kind of extract. At most one version of every object (node, way, or
    relation) is contained in this file. Deleted objects are *not* in this
    file. The usual suffix used is `.osm`.

**History files**
:   These files contain not only the current version of an object, but their
    history, too. So for any object (node, way, or relation) there can be zero
    or more versions in this file. Deleted objects can also be in this file.
    The usual suffix used is `.osm` or `.osh`. Because sometimes the same
    suffix is used as for normal data files (`.osm`) and because there is no
    clear indicator in the header, it is not always clear what type of file
    you have in front of you.

**Change files**
:   Sometimes called *diff files* or *replication diffs* these files
    contain the changes between one state of the OSM database and another
    state. Change files can contains several versions of an object.
    The usual suffix used is `.osc`.

All these files have in common that they contain OSM objects (nodes, ways, and
relations). History files and change files can contain several versions of the
same object and also deleted objects, data files can't.

Osmium handles all these files in the same way. It knows about the different
ways those files are formatted, but semantically all these files produce the
same internal objects. The only difference is that the `visible` flag on OSM
objects is always true for data files, but not for history and change files.

(Note that this is different from how Osmosis handles these files: Osmosis
differentiates between "entity streams" and "change streams".)

XML Change files have each object in a section called `<create>`, `<modify>`
or `<delete>`. When reading change files, Osmium gives you normal OSM objects
and sets the `visible` flag to *false* for objects in `<delete>` sections.
When writing out OSM objects into change files, deleted objects are marked
so and all other objects are either marked as `<create>` if their version is
1 or `<modify>` if their version is greater than 1.

You can also see a change file as a *partial history file* with a strange
format.

While Osmium itself is mostly file type agnostic, applications built on top
of Osmium usually only handle specific types of files for their use cases.


## File formats

Osmium supports several different OSM file formats. File formats are about
the way the content is encoded in bits and bits on the wire.

**XML**
:   The original XML-based OSM format. This format is rather verbose and
    working with it is slow, but it is still used often and in some
    cases there is no alternative. The main OSM database API also returns
    its data in this format. More information about this format on the
    [OSM Wiki](http://wiki.openstreetmap.org/wiki/OSM_XML).

**PBF**
:   The binary format based on the Protobuf library. This is the most compact
    format. More information on the
    [OSM Wiki](http://wiki.openstreetmap.org/wiki/PBF_Format).

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
    Manual](http://docs.osmcode.org/opl-file-format-manual/) for details.

**DEBUG**
:   A nicely formatted text-based format that is easier to read for a human
    than the XML or OPL formats. As the name implies this is intended for
    debugging. The format can only be written by Osmium, not read.

See below for more detailed descriptions.

## Compression

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

Usally Osmium-based programs will allow you to tell them the _name_ of an
input or output file and, optionally a _format description_. Osmium detects
the format of a file from the file name suffix, so usually you do not have
to set the format manually.

Osmium knows about the following suffixes:

Format  Suffix    Description
------- -------   ------------
XML     .osm      XML data file, but can also be one history file
XML     .osh      XML history file
XML     .osc      XML change file
PBF     .pbf      PBF
OPL     .opl      OPL
DEBUG   .debug    DEBUG

You can stack formats: `.osm.pbf` is the same as `.pbf`, `.osh.pbf` is a
history file in PBF format.

The change file format (`.osc`) is only available in the XML version, use
`.osh` instead for other formats.

Osmium supports compression and decompression of XML, OPL, and DEBUG files
internally using the GZIP and BZIP2 formats. As usual, these files have an
additional suffix `.gz`, or `.bz2`.

So a typical PBF file will be named `planet.pbf`, a packed history file could
be named `history.osh.bz2`.

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
the _dense_ format is used, but you can disable it like this:

File name: `foo.pbf`, Format: `.pbf,pbf_dense_nodes=false`

Note that, if a format is given, it always must start with the format
description, even if the file name has the correct suffix.

Here is a list of optional settings currently supported:

Format  Option             Default  Description
------- -------            -------- ------------
PBF     pbf_dense_nodes    true     Use DenseNodes (more space efficient)
PBF     pbf_compression    gzip     Compress blocks using gzip (use "none" to disable)
XML     xml_change_format  false    Set change format, can also be set by using `osc` instead of `osm` suffix
XML     force_visible_flag false    Write out `visible` flag on each object, also set if `osh` instead of `osm` suffix used
all     add_metadata       true     Add metadata (version, timestamp, etc. to objects)


## XML

There are several different XML formats in use in the OSM project. The main
formats are the one used for planet files, extracts, and API responses (suffix
`.osm`), the format used for change files (suffix `.osc`) and the history
format (suffixes `.osm` or `.osh`).

Some variants are also used, such as the JOSM format which is similiar to the
normal OSM format but has some additions. Support for the features of these
formats varies.

When reading, the OSM change format (`.osc`) is detected automatically. When
writing, you have to set it using the format specifier `osc` or the format
parameter `xml_change_format=true`.


### PBF

The [PBF](http://wiki.openstreetmap.org/wiki/PBF_Format) file format is based
on the [Google Protocol Buffers library](http://code.google.com/p/protobuf/).
PBF files are very space efficient and faster to use than XML files. PBF files
can contain normal OSM data or OSM history data, but there is no equivalent to
the XML .osc format.

Osmium supports reading and writing of nodes in *DenseNodes* and non-*DenseNodes*
formats. Default is *DenseNodes*, as this is much more space-efficient. Add the
format parameter `pbf_dense_nodes=false` to disable *DenseNodes*.

Osmium usually will compress PBF blocks using zlib. To disable this, use the
format parameter `pbf_compression=none`.

PBF files contain a string table in each data block. Some programs sort this
string table for slightly better compression. Osmium does not do this to make
writing of PBF files faster.

Usually PBF files contain all the metadata for objects such as changeset id,
username, etc. To save some space you can disable writing of metatdata with the
format option `add_metadata=false`.

### O5M/O5C Format

### OPL ("Object Per Line") Format

See the [OPL File Format Manual](http://docs.osmcode.org/opl-file-format-manual/).


### DEBUG Format

## Which format should I use?

In many cases you can't choose which format to use, because you get a file in a
specific format and have to work with it. Osmium can read all popular formats,
so you are covered here. Osmium can also create most popular formats, so if
some other software needs a specific format, you should be okay.

But sometimes you can decide. Here are some guidelines:

* Usually PBF is the right format. The files are very small and reading and
  writing is fast in Osmium, because it uses multithreading. The only drawback
  is that you can't easily look inside those files because of the binary
  format.
* You can disable compression (option `pbf_compression=none`) on PBF files
  which makes them larger but faster to read. This might make sense if you
  will read those files very often and aren't concerned about disk usage. You
  have to experiment.
* The OSM API uses the XML format, so if you interact with that API, you'll
  want to use XML. Also OSM change files only come in XML format, so most
  software can only use them in that format.
* O5M files are about the same size as PBF files, but they are slower to read
  than PBF, because they can only be read in a single thread.
* OPL files are reasonably fast to read or write, but they are much bigger than
  files in one of the binary formats. You can use compression, but that makes
  reading and writing slower and you loose the advantage that you can easily
  read the contents. Use OPL if you want to filter or manipulate the OSM data
  with scripting languages or command line tools.
* The debug format is nice for a quick glance at the contents of a file.


## Seeing what's in an OSM file

If you have an OSM file and want to take a quick look at its content, the
[osmium command line tool](http://osmcode.org/osmium) is your friend.

Use the `fileinfo` command to get an overview of the file including the header:

    osmium fileinfo OSMFILE

Use the `-e` option to get more information about the file contents:

    osmium fileinfo -e OSMFILE

If you want to look at the actual contents, the `cat` command can convert the
file into the `debug` format and you can pipe the result into `less`:

    osmium cat OSMFILE -f debug | less

