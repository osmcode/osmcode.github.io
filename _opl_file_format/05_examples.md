---
title: 5. Usage Examples
---

# {{ page.title }}

Here are some examples how the OPL format can be used to easily get some data
out of an OSM file.

Note that some of these commands generate quite a lot of output. You might
want to add a `| less` or redirect into a file. For larger OSM files some of
these commands might take quite a while, so try them out on small files first.

Find all objects tagged `highway=...`:

    egrep "( T|,)highway=" data.osm.opl

Find all IDs of ways tagged `highway=...`:

    egrep '^w' data.osm.opl | egrep "( T|,)highway=" | cut -d' ' -f1 | cut -c2-

Find all nodes with version > 9:

    egrep '^n' data.osm.opl | egrep -v ' v. '

Find the first fields of the relation with the highest version number:

    egrep '^r' data.osm.opl | sort -b -n -k 2.2,2 | tail -1 | cut -d' ' -f1-7

Find all objects with changeset ID 123:

    egrep ' c123 ' data.osm.opl

Count how many objects were created in each hour of the day:

    egrep ' v1 ' data.osm.opl | cut -d' ' -f5 | cut -dT -f2 | \
        cut -d: -f1 | sort | uniq -c

Find all closed ways:

    egrep '^w' data.osm.opl | egrep 'N(n[0-9]+),.*\1 '

Find all ways tagged with `area=yes` that are not closed:

    egrep '^w' data.osm.opl | egrep 'area=yes' | egrep -v 'N(n[0-9]+),.*\1 '

Find all users who have created post boxes:

    egrep ' v1 ' data.osm.opl | egrep 'amenity=post_box' | \
        cut -d' ' -f7 | cut -c2- | sort -u

Find all node IDs used in `via` roles in relations:

    egrep '^r' data.osm.opl | sed -e 's/^.* M\(.*\) .*$/\1/' | egrep '@via[, ]' | \
        sed -e 's/,/\n/g' | egrep '^n.*@via$' | cut -d@ -f1 | cut -c2- | sort -nu

Find all nodes having any tags igoring `created_by` tags:

    egrep '^n' data.osm.opl | egrep -v ' T$' | \
        sed -e 's/\( T\|,\)created_by=[^,]\+\(,\|$\)/\1/' | egrep -v ' T$'

Count tag key usage:

    sed -e 's/^.* T//' data.osm.opl | egrep -v '^$' | sed -e 's/,/\n/g' | \
        cut -d= -f1 | sort | uniq -c | sort -nr

Order by object type, object id and version (ie the usual order for OSM files):

    sed -e 's/^r/z/' data.osm.opl | sort -b -k1.1,1.1 -k1.2,1n -k2.2,2n | sed -e 's/^z/r/'

Create statistics on number of nodes in ways:

    egrep '^w' data.osm.opl | cut -d' ' -f9 | tr -dc 'n\n' | \
        awk '{a[length]++} END {for(i=1;i<=2000;++i) { print i, a[i] ? a[i] : 0 } }'

