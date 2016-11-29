---
title: 2. OSM Entities
---

# {{ page.title }}

Osmium can handle the four basic types of OSM entities: *Nodes*, *Ways*, and
*Relations* (which are collectively known as *OSM Objects*) and it can handle
*Changesets*. In addition *Areas* are supported, which are not native OSM
objects, but Osmium can create Areas from closed ways and multipolygon
relations and then treat those Areas almost like the other, real OSM objects.

<img src="/osmium-concepts/osm-entities.png" width="397"/>

## OSM Objects

The OSM data is in OSM objects: nodes, ways, and relations. All OSM
objects have a set of attributes and zero or more tags.

### Attribute: ID

All OSM objects have a unique integer ID. ID spaces for object types are
different, so there is a node with ID 17 and it is different from the way with
ID 17. OSM uses only positive IDs starting with 1, but some software (notably
JOSM) uses negative IDs for internal use.

Osmium can handle any 64bit signed integer ID in most operations. Some
parts only work with positive IDs, notable the node location indexes. For
detail see there.

If not explicitly set, objects in Osmium have ID 0.

Note that Osmium uses the same data type for IDs of all types of objects.
This simplifies handling, but it can also mean that some memory is wasted.
For nodes 64bit IDs are necessary (because there are so many of them), but the
IDs of ways or relations will fit into a 32bit signed integer.

### Attribute: Version

Objects are created in OSM with version 1 and each change to an object
increments this version.

If not explicitly set, objects in Osmium have version 0.

Deleting on object will also create a new object
version with a the visible flag (see below) set to false.

### Attribute: Visible Flag

Objects can be visible or not visible, deleted.

If not explicitly set, objects in Osmium are flagged as visible.

Usual OSM data files only contain visible objects, but OSM history files
contain also deleted objects.

### Attribute: Timestamp

Each object has a timestamp giving the date and time when this version of the
object was created.

Timestamps have one second resolution. They are always in UTC.

If not explicitly set, objects in Osmium have an "invalid" timestamp.

### Attribute: Changeset ID

Changes to the OSM database are done in Changesets (see below), so each
version of an object belongs to a changeset. The ID of this changeset is
stored in the object.

The changeset ID is a 32bit unsigned integer.

If not explicitly set, objects in Osmium have changeset ID 0.

### Attribute: User ID

The user who created or changed this object. A 32 bit unsigned integer.

The user ID 0 isn't used for a real user and is usually used to mark
anonymous users. It used to be possible to mark your edits in OSM as
anonymous, but today it is not possible any more. So user ID 0 will show
up in the data, but new changes will always have a valid user.

If not explicitly set, objects in Osmium have user ID 0.

### Attribute: User Name

An UTF-8 string with a maximum length of 256 characters. Note that these are
characters not bytes and note that all valid Unicode characters can be used.

If not explicitly set, objects in Osmium have an empty user name.

### Tags

All OSM objects have a (possibly empty) list of *tags*. Each tag has a *key*
and a *value*, both are UTF-8 strings with a maximum length of 256 characters.
Note that these are characters not bytes and note that all valid Unicode
characters can be used. Key and values can both be empty.

Osmium handles the tags as an ordered list, it will never change this order.
Usually tags are ordered alphabetically by key, but this is in no way
guaranteed or needed.

## Nodes

In addition to the attributes and tags nodes have a *location*. A location
consists of two coordinates, a *longitude* and *latitude*.

Coordinates are stored internally as 32 bit signed integer. This gives us a
resolution of about 1cm or better. This is the same storage format as used
internally in the main OSM database.

Historically it was possible to add invalid locations (outside the ranges
-180 < longitude < 180, -90 < latitude < 90) to the OSM database. Today this
isn't possible any more, but Osmium can still handle those invalid locations.

In function calls etc. Osmium always uses the coordinates in the order first
longitude, then latitude, because of the usual order of coordinates in
mathematics (first x, then y) and professional GIS use.

## Ways

In addition to the attributes and tags ways have an ordered list of *node
references*.

In Osmium, ways can optionally also have a location for each node reference.
This will usually be empty but can be filled, for instance using the
NodeLocationForWays handler. This is very convenient for many use cases.

Ways with zero, one or more node references are allowed. In current OSM data
ways have a maximum length of 2000 nodes, but this limit is not enforced by
Osmium. Historical OSM data might contain longer node lists.

## Relations

In addition to the attributes and tags ways have an ordered list of *members*.
Each member has a type (node, way, or relation), a reference to an object ID
of the given type, and a *role*. The role is a 256 character UTF-8 string and
can be empty.

Relation with zero, one or more members are allowed. There is no upper limit
on the number of members.

## Areas

Areas are "synthetic OSM objects". They can be created from closed ways and
multipolygon relations. Areas have all the same attributes as real OSM objects
and they have tags, too. In addition they have a set of outer and inner rings
describing the MultiPolygon geometry.

## Changesets

Changesets describe a set of associated changes in the OSM database.

