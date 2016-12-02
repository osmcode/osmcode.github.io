---
title: 1. Introduction
---

# {{ page.title }}

*This format is preliminary, it might change. Please send feedback if you use
this format!*

The OPL ("Object Per Line") format was created to allow easy access to and
manipulation of OSM data with typical UNIX command line tools such as `grep`,
`sed`, and `awk`. Each object is on its own line with a linefeed at the end.

This makes some ad-hoc OSM data manipulation easy to do, but it is not as fast
as some specialized tool.

OPL files are only about half the size of OSM XML files, when compressed (with
gzip or bzip2) they are about the same size.

Osmium can read and write OPL files.

