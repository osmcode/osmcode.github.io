---
chapter: 2
title: File Types
---

OSM uses three types of files for its main data:

**Data files**
:   These are the most common files containing the OSM data at a specific point
    in time. This can either be a planet file containing *all* OSM data or some
    kind of extract. At most one version of every object (node, way, or
    relation) is contained in this file. Deleted objects are *not* in this
    file. The usual suffix used is `.osm`.

**History files**
:   These files contain not only the current version of an object, but their
    history, too. So for any object (node, way, or relation) there can be zero
    or more versions in this file. Deleted objects can also be in this file.
    The usual suffix used is `.osm` or `.osh`. Because sometimes the same
    suffix is used as for normal data files (`.osm`) and because there is no
    clear indicator in the header, it is not always clear what type of file
    you have in front of you.

**Change files**
:   Sometimes called *diff files* or *replication diffs* these files
    contain the changes between one state of the OSM database and another
    state. Change files can contains several versions of an object.
    The usual suffix used is `.osc`.

All these files have in common that they contain OSM objects (nodes, ways, and
relations). History files and change files can contain several versions of the
same object and also deleted objects, data files can't.

Osmium handles all these files in the same way. It knows about the different
ways those files are formatted, but semantically all these files produce the
same internal objects. The only difference is that the `visible` flag on OSM
objects is always true for data files, but not for history and change files.

(Note that this is different from how Osmosis handles these files: Osmosis
differentiates between "entity streams" and "change streams".)

XML Change files have each object in a section called `<create>`, `<modify>`
or `<delete>`. When reading change files, Osmium gives you normal OSM objects
and sets the `visible` flag to *false* for objects in `<delete>` sections.
When writing out OSM objects into change files, deleted objects are marked
so and all other objects are either marked as `<create>` if their version is
1 or `<modify>` if their version is greater than 1.

You can also see a change file as a *partial history file* with a strange
format.

And then there are *changeset files*. They don't contain OSM objects, but
changesets. Some changeset files contain the discussion comments together
with the changesets, some files don't have the comments (the `num_comments`
attribute is always set, though). Changeset files can be combined with OSM
data or history files into one. So there can be one file that contains both
the OSM objects and the changesets.

Don't mix up "change files" and "changeset files", those are completely
different concepts. The "change files" contain the new versions of OSM
objects and describe the changes that way. The "changeset files" contain
changesets containing the change metadata.

While Osmium itself is mostly file type agnostic, applications built on top
of Osmium usually only handle specific types of files for their use cases.

