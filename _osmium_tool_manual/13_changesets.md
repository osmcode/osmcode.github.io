---
chapter: 13
title: Working with changesets
---

Osmium can not only handle OSM objects (nodes, ways, and relations), but also
OSM changesets. Those changesets are also stored in files with the suffix
`.osm`, which can make things somewhat confusing. Some Osmium commands will
just work on changeset files: `osmium fileinfo`, `osmium show`, and
`osmium cat`. Others don't make any sense with changeset files, like
`apply-changes`.

Unlike OSM data files for which several formats are available (XML, PBF,
O5M, ...) changesets always come in XML format which is much slower to work
with than the binary formats.

There is one command specifically for changeset files: `changeset-filter`.
You can use it to select changesets from a file. If you want to get all
changesets by user "Einstein", for instance, you'd use this command:

    osmium changeset-filter -u Einstein changesets.osm.bz2 -o einstein.osm.bz2

Have a look in the
[man page](https://docs.osmcode.org/osmium/latest/osmium-changeset-filter.html)
to see the other options available. You can also combine several of them to
only get those changesets matching all criteria.

Changesets can also be written out into the OPL format which can be processed
easily with standard unix command line tools. Say you have a list of user names
and want to find all changesets in January 2015 by any of those users. You can
first use `changeset-filter` to filter out the time window and then use `grep`
to check for those users:

    osmium changeset-filter -a 2015-01-01T00:00:00Z -b 2015-01-31T23:59:59Z \
        -f opl | grep ' u\(foo\|bar\|baz\) '

This way you can use the fast, but not very flexible filtering options of the
`changeset-filter` command together with slower, but more flexible filtering
using unix command line tools or scripting languages.

