---
title: 2. File Format
---

# {{ page.title }}

Each line of the file contains one OSM object (a node, way, or relation) or an
OSM changeset. Lines end in a newline character.

Each line is made up of several fields separated by a space character.
Each field is introduced by a specific character defining the type of the
field.

When OPL files are written by Osmium, the fields always appear in the same
order in a line and are always all present (except when the file is written
without metadata, see below).

When Osmium parses a line, fields can appear in any order and all fields except
the first one are optional.

## Fields in OSM data files

One of these fields is always the first:

    n - Node ID (nodes only)
    w - Way ID (ways only)
    r - Relation ID (relations only)

Then in the given order:

    v - Version
    d - Deleted flag ('V' - visible or 'D' - deleted)
    c - Changeset ID
    t - Timestamp (ISO Format)
    i - User ID
    u - Username
    T - Tags
    x - Longitude (nodes only)
    y - Latitude (nodes only)
    N - Nodes (ways only)
    M - Members (relations only)

If the file was written without metadata (using the option `add_metadata=false`
in Osmium), the fields `v`, `d`, `c`, `t`, `i`, and `u` are missing.

The t, N, M, and T fields can be empty. If the user is anonymous, the 'User ID'
will be 0 and the 'Username' field will be empty: `... i0 u ...`. If the
node is deleted, the 'Longitude' and 'Latitude' fields are empty. All other
fields always contain data.

## Fields in OSM changeset files

For changesets the fields are:

    c - Changeset ID
    k - num_changes
    s - created_at (start) timestamp (ISO Format)
    e - closed_at (end) timestamp (ISO Format)
    d - number of comments in the discussion
    i - User ID
    u - Username
    x - Longitude (left bottom corner, min_lon)
    y - Latitude (left bottom corner, min_lat)
    X - Longitude (right top corner, max_lon)
    Y - Latitude (right top corner, max_lat)
    T - Tags

The field `e` is empty when the changeset is not closed yet. The fields `x`,
`y`, `X`, `Y` can be empty when no bounding box could be derived. The field `k`
can be 0. The field `T` can be empty if there are no tags.

Changeset discussions do not appear in the OPL format!

