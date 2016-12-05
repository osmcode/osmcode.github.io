---
title: 13. Handling of invalid data
---

# {{ page.title }}

Libosmium can, to a certain extend, handle data that is invalid in the sense
that it is not allowed in the OSM database or even might be nonsensical, for
instance longitudes larger than 180°. This section explains the details and
reasons.

There are good reasons for this behaviour:

* Libosmium is trying to be a generic library and, while some values might be
  considered invalid in the OSM context, they might be considered valid in
  other contexts.
* Sometimes data is not checked for performance reasons. You are expected to
  give correct data to libosmium. If you don't, the result is undefined.
  Usually data will be checked in debug builds anyway using the `assert` macro.
* Invalid values do creep in and libosmium wants to be able to help you fix it.
  But unless it can read and handle the invalid data, you can't write a program
  that takes this data and fixes it in some way.
* The OSM database historically was more lenient than it is today. But
  libosmium must work with OSM files created years ago and history dumps of
  the database. So it allows those invalid values we know used to exist, but
  are not allowed any more today.

Generally more low-level classes and functions (such as basic classes
`Location`, `Node`, `Tag`, etc.) are more lenient for flexibility, while higher
level functions (such as file I/O) might be more strict to support typical use
cases.

### File input and output

It is possible to encode some data in OSM files that can be considered to be
invalid. When reading and writing OSM files libosmium does not care about that.
It will give you the data in the form it is in the file and write out data you
give to it in that form.

### Order of objects in files

OSM objects in OSM files are usually ordered by type, ID (and version for
history files). This is a useful convention, but it is not necessarily so.
All OSM file formats allow the data to be in any order and libosmium can read
and write those files. Whenever you read data using libosmium, it will be
given to you in the order it is in the file, whatever that is. Whenever you
write data, you must give it to libosmium in the order you want it to end up
in the file.

Note that the ordering of objects in a file might influence the size of the
file. Some file formats (notably PBF) will encode the data better if the same
types of objects are together and even better if they are ordered by ID.

### IDs

OSM node, way, relation, and changeset IDs are always positive. Zero is allowed
by libosmium and understood as the "unset" or "don't know" value. Negative
values are also allowed because some programs (JOSM for instance) use negative
IDs as temporary IDs. Not all parts of libosmium will just work with negative
integers, though, you might have to handle them specially in some way. Indexes
usually only work with positive IDs, if you have to handle negative IDs,
use two indexes, one for positive IDs and one for negative IDs that you have
to transform first.

OSM uses a different ID space for each entity type (nodes, ways, relations,
changesets) and gives out IDs starting from 1. Libosmium allows any kind of
ID that fits into an unsigned 64bit int, but some parts, notably the indexes,
are optimized for smaller and more or less contiguous integers.

### User ID

The user ID has to be zero ("unknown" or "anonymous") or a positive integer.
Negative values are not allowed in libosmium.

### Timestamps

Timestamps are stored internally as seconds since the epoch (1970-01-01).
Although OSM was founded much later, timestamps are not checked. Libosmium
uses a few special values here. Time 0 is the "unknown" value, time 1 is
understood to be "before any other time value" and 2^32-1 is understood to be
"after any other time value".

### Locations

Locations are given in WGS84 longitude and latitude. Both libosmium and
the OSM database store the coordinates internally as signed 32bit integers.
32bit integers have a range somewhat larger than the -180° to 180° longitude
and -90° to 90° latitude. Values outside this range, but inside the signed
32bit integers are possible and historic OSM data contains such values. Use
the `Location::valid()` function to check whether a location is in the proper
range.

### Strings and UTF-8

OSM strings use UTF-8 encoding, but a lot of the libosmium code doesn't care
about that and doesn't check that a string is valid UTF-8. This is mostly for
performance reasons, but it could also allow other character sets in non-OSM
uses of the library.

Historically the OSM database sometimes contained non-UTF-8 strings. This
should have all been fixed by now.

These parts of the library don't care about string encoding:

* PBF input and output

These parts of the library *do* care about string encoding:

* OPL and debug output expect UTF-8 encoded data and escape non-printable
  characters accordingly

### Strings and control characters

OSM strings (user names, tag keys and values, and roles) can not contain
certain control characters. The reason is that those control characters can't
be expressed in XML. (XXX More details needed.)

Strings in OSM can only have a maximum lengt of 256 unicode characters.
Libosmiums input and output routines allow any length up to 2^16 bytes.
(XXX More details needed.)

