---
chapter: 5
title: OSM file formats and converting between them
---

Osmium supports all popular OSM file formats (and some more): XML, PBF,
O5M/O5C, OPL, and the already mentioned *debug* format. Some formats can
only be read or only be written. See the
[osmium-file-formats](https://docs.osmcode.org/osmium/latest/osmium-file-formats.html)
man page for details. All the text-based formats can be automatically
(de)compressed if they use the `gzip` or `bzip2` compression.

Often you need to convert OSM data files from one format to another. This
is easily done with the `osmium cat` command. To convert the Liechtenstein
PBF file into XML format compressed with `bzip2`, use this command:

    osmium cat liechtenstein-latest.osm.pbf -o liechtenstein.osm.bz2

Osmium will automatically detect the file format based on the file name.
Usually it will do what you want, but you can force the file format with
the command line options `-f` (for the output file) and `-F` for the input
file. This is useful when reading from STDIN or writing to STDOUT:

    osmium cat input.osm.pbf -f osm | some_program_reading_osm_xml

The format for the `-f` and `-F` options is simply the suffix you would usually
use for an OSM file (here `osm`). It also works with `pbf` (or `osm.pbf`),
`osm.gz` etc.

Most file formats have special options to change the details of the file
format. You can set those special options with the same command line options.
For instance, if you want a bz2ip-compressed XML file without metadata use
this:

    osmium cat input.osm.pbf -o output.osm.bz2 -f osm.bz2,add_metadata=false

The output file will not have the `version`, `timestamp`, etc. fields and so
it is much more compact than the usual XML format.

As you can see, you can add the options to the format separated by commas,
multiple options are possible. Some options are available for several or all
formats (`add_metadata` for instance), others are specific to one of the
formats, `pbf_dense_nodes` for instance only works on the PBF format. Note
that unknown options are silently ignored, so if you mistype an option, you
will not get an error message!

See the
[osmium-file-formats](https://docs.osmcode.org/osmium/latest/osmium-file-formats.html)
man page for all the details. Btw: all these file formats and options are
implemented in the [libosmium library](https://osmcode.org/libosmium/), so most
libosmium-based programs will understand them in the same fashion.

While playing around with the command you might have noticed an error
message like `Open failed for 'output.osm.bz2': File exists`. By default
Osmium will not overwrite an existing file. This is a safety measure to
keep you from accidentally deleting that 60GB planet file, that took you
all day to download. With the `-O` or `--overwrite` option you can disable
this check.

The `osmium cat` command can do more: Just like the shell `cat` command, it
can take several input files and it will concatenate them to generate the
output. In fact that's where the name (con"cat"enate) comes from. Its ability
to convert from one file format to another is only a side-effect really, most
Osmium subcommands can read and write OSM files in any format and support the
same `-f` and `-F` options. Note that this command will really just
concatenate its inputs and not sort them in any way. This might or might not
be what you want.

There is one additional option of the `osmium cat` command that often comes
handy. With `-t TYPE` it can be instructed to only copy objects of the given
type. So

    osmium cat input.osm.pbf -t node -o output.osm.pbf

will only copy the nodes, not the ways, or relations.

