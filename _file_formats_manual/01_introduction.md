---
chapter: 1
title: Introduction
---

OpenStreetMap uses several different types of files containing different types
of data and it uses different formats to "encode" this data into bits and bytes
on your disk.

This manual gives an overview over the different file formats and encodings and
explains what they have in common and what their differences are. It has been
written for the users of the Libosmium library or any of the tools built on top
of this library, but it is useful beyond that.

If you are an Osmium user, read this first to get an overview on OSM files,
possibly together with the <a href="/osmium-concepts/">Osmium Concepts
Manual</a>. After you have understood the information in here, you can read
the <a href="/docs.html">other documenation</a> for the details.


## Seeing what's in an OSM file

If you have an OSM file and want to take a quick look at its content, the
[osmium command line tool](/osmium-tool/) is your friend.

Use the `fileinfo` command to get a quick overview of the file. This will only
read the metadata available from the file system and the header of the file,
so it is very fast:

    osmium fileinfo OSMFILE

Use the `-e` option to get more information about the file contents. This will
actually read the complete file and give you some statistics etc.

    osmium fileinfo -e OSMFILE

If you want to look at the actual contents, use the `show` command:

    osmium show OSMFILE

It will convert the file to the [DEBUG format](#debug-format) and pipe the
result into your favorite pager program.

