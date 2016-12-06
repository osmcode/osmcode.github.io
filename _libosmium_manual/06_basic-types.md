---
chapter: 6
title: Basic Types
---

All the types and classes described in this chapter are value types, ie they
are small and can be copied around cheaply.

## IDs

Typedef: `osmium::object_id_type`

Include: `<osmium/osm/types.hpp>`

For object IDs use the type `osmium::object_id_type`. It is a 64bit
signed integer that can represent the more than 2 billion nodes
we already have in OSM. While way and relation IDs could theoretically
use a smaller ID type (signed 32 bit are currently enough), for
consistency and to be future-proof, they will also use this type
in most cases.

OSM objects always have positive IDs. But some software (such as JOSM)
uses negative IDs for objects that have not yet been uploaded to the
main OSM database. To support these use cases, the `object_id_type` is
a signed integer.

Some parts of Osmium, notably the different index classes, can only
work with positive IDs. In those cases the type
`osmium::unsigned_object_id_type` is used. If you know that your data
only contains positive IDs or only negative IDs, you can use the
`positive_id()` member function on the `Object` class to get IDs of that type.
It will return the absolute value of the ID.

If your data contains a mix of positive and negative IDs, this simple
approach will fail! In that case you have to use two indexes, one
for the positive IDs and one for the negative IDs. The
`osmium::handler::NodeLocationsForWay` class takes this approach.

## Other Primitive Types

Include: `<osmium/osm/types.hpp>`

There are several other typedefs:

| Type                  | Description
| -----                 | ------------
| `object_version_type` | type for OSM object version number
| `changeset_id_type`   | type for OSM changeset IDs
| `user_id_type`        | type for OSM user IDs
| `num_changes_type`    | type for number of changes in a changeset

All these types are currently 32bit integers. Version numbers, changeset
IDs and User IDs are always positive (they start out with 1). The number
of changes can be 0 or larger.

## Locations

Class: `osmium::Location`

Include: `<osmium/osm/location.hpp>`

In Osmium all positions on Earth are stored in objects of the
osmium::Location class. Coordinates are stored as 32 bit signed integers
after multiplying the coordinates with `osmium::coordinate_precision`
= 10,000,000.
This means we can store coordinates with a resolution of better
than one centimeter, good enough for OSM use. The main OSM
database uses the same system. We do this to save memory, a
32 bit integer uses only 4 bytes, a double uses 8.

Coordinates are not checked when they are set.

To create a location:

``` c++
osmium::Location location{9.3, 49.7};
```

or using integers:

``` c++
osmium::Location location{9300000000, 49700000000};
```

Make sure you are using the right number type or you will get very
wrong coordinates.

You can also create an undefined location. This is used for
instance for coordinates in ways that are not set yet:

``` c++
osmium::Location location{};
```

In a boolean context an undefined location returns false, a defined
true. So you can write something like:

``` c++
if (location) {
    ...defined location here...
}
```

You can get and set the coordinates using the internal (integer)
format with the `x()` and `y()` member functions and the external (double)
format with the `lon()` and `lat()` member functions.

The normal bounds for the longitude and latitude are -180 to 180 and -90 to 90,
respectively. But in historic OSM data you can sometimes find locations outside
these bounds. Call

```
location.valid()
```

to find out if a location is inside those bounds.

The `lon()` and `lat()` getter calls will throw an exception if the location is
invalid or undefined.

## Segments

Class: `osmium::Segment`

Include: `<osmium/osm/segment.hpp>`

Segments are the directed connection between two locations. They
are not OSM objects but sometimes useful in algorithms.

## Undirected Segments

Class: `osmium::UndirectedSegment`

Include: `<osmium/osm/undirected_segment.hpp>`

Undirected Segments are connection between two locations. They
are not OSM objects but sometimes useful in algorithms.

## Boxes

Class: `osmium::Box`

Include: `<osmium/osm/box.hpp>`

A box is a rectangle described by the minimum and maximum longitude and
latitude. It is used, for instance, in the header of OSM files and in
changesets to describe the bounding box.

``` c++
osmium::Box box;
box.extend(osmium::Location{3.2, 4.3});
box.extend({4.5, 7.2});
box.extend({3.3, 8.9});
std::cout << box;  // (3.2,4.3,4.5,8.9)
```

