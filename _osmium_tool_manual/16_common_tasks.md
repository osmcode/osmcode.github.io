---
chapter: 16
title: Common tasks
---

This chapter explains how to solve some common tasks with Osmium.

### Filtering by tags in history files

The `osmium tags-filter` command works well with normal OSM files, but it
probably will not do what you want with history files.

If you want to get all versions of all nodes where at least one version has
a specific tag, you can use `tags-filter` together with `getid` to do this:

    osmium tags-filter input.osh.pbf n/shop -o out.osh.pbf
    osmium getid --id-osm-file out.osh.pbf --with-history input.osh.pbf -o filtered.osh.pbf

The file `filtered.osh.pbf` now contains the result, you can use `time-filter`
to get the data for specific points in time:

    osmium time-filter filtered.osh.pbf 2018-03-01T00:00:00Z -o result.osm.pbf

If you want to filter not only nodes, but ways or relations, you'll need to
use the `--add-referenced` option on the `getid` command.

