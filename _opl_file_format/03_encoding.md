---
chapter: 3
title: Encoding
---

## Numbers

Numbers, such as IDs and version numbers are written as decimal digits.


## Timestamps

Timestamps are written in the same ISO 8601 format used in OSM XML files:
`yyyy-mm-ddThh:mm:ssZ`. The time zone is always `Z`.

If the timestamp is not set, it will show up empty.


## Deleted flag

The 'Deleted flag' shows whether an object version has been deleted (`dD`) or
is visible (`dV`). For normal OSM data files this is always `dV`, but change
files and osm history files can contain deleted objects.


## Text in user names, tags, and roles

User names, tags, and relation member roles can contain any valid Unicode
character. Any characters that have special meaning in OPL files (space,
newline, ',' (comma), '=' (equals), '@', and '%') have to be escaped as well as
any non-printing characters.

Escaped characters are written as `%xxxx%`, ie a percent sign followed by the
hex code of the Unicode code point followed by another percent sign. The
number of digits in the hex code is not fixed, but must be between 1 and 6,
because all Unicode code points can be expressed in not more than 6 hex digits.

Any code reading OPL files has to cope with encoded and non-encoded characters
(except that characters used in the OPL file with special meaning will always
be encoded).

_Currently there is a hard-coded list in the Osmium source of all the characters
that don't need escaping. This list is incomplete and subject to change.
Currently two hex digits are used for code points less than 256 and at least
four hex digits for numbers above that._

(An older version of OPL tried to encode characters as `%xxxx` with always 4
hex digits, but this doesn't work because Unicode code points can need more
digits.)


## Tags

Tags are written in the form _key_ `=` _value_. Several tags are joined by a
commas (`,`). Any equal sign or comma in the key or value is escaped.


## Nodes in ways

Nodes in ways are written as a comma-separated list of `n`_ID_ combinations.


## Relation members

Relation members consist of the type `n`, `w`, or `r`, the ID, an at-sign (`@`)
and the role. Several members are joined by commas (','). Any at-sign or comma
in the roles is escaped.


