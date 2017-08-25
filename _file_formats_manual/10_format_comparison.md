---
chapter: 10
title: Format Comparison
---

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
* O5M files are about the same size as PBF files or slightly larger, but they
  are slower to read than PBF, because they can only be read in a single thread.
  (If you have multiple CPUs.)
* OPL files are reasonably fast to read or write, but they are much bigger than
  files in one of the binary formats. You can use compression, but that makes
  reading and writing slower and you loose the advantage that you can easily
  read the contents. Use OPL if you want to filter or manipulate the OSM data
  with scripting languages or command line tools.
* The debug format is nice for a quick glance at the contents of a file.

