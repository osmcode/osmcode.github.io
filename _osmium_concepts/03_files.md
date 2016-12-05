---
title: 3. OSM Files
---

# {{ page.title }}

OSM uses several different types of files containing different
types of data and it uses different formats to "encode" this data into bits
and bytes in the files.

Most programs using OSM data will need to read OSM files and/or write to
OSM files. Osmium supports most common types and formats.

Please read the <a href="/file-formats-manual/">File Formats Manual</a>
for the details of these formats and how they are used in Osmium.

## I/O Multithreading

Osmium uses multithreading behind the scenes to speed up reading and writing
files. This is something the user usually doesn't have to be concerned with.
It doesn't matter if you use the command line tools or the library, for the
user it looks like the file is simply read sequentially. But internally Osmium
does some magic to speed things up. This works better for some file types than
for others and it might influence your choice of file types. Try different file
types to get an idea of their relative speeds. Generally XML can't be
parallelized and is slow (reading and writing), PBF can be parallelized well
and especially reading with many CPUs is very fast. O5M can not be parallelized
but is fast even on a single CPU. OPL can be parallelized and is reasonably
fast.

## URLs

If a file name looks like a URL (i.e. if it starts with `http:` or `https:`),
Osmium will fork and execute `curl` to get the file for you. This happens
transparently and will work for all programs using Osmium.

On Windows this feature is not available. You need to have
[curl](https://curl.haxx.se/) installed on your system.

Note that if there is an error during download, Osmium might not be able to
detect it. So use caution if you use this feature.

