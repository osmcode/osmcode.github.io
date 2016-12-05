---
title: 12. Exceptions
---

# {{ page.title }}

Libosmium uses various C++ standard exceptions and some Osmium-specific
exceptions to tell you about problems. All Osmium-specific exceptions are in
the `osmium` namespace, they are all derived from one of the standard C++
exceptions, usually `std::runtime_error` or `std::system_error`.

## List of Osmium Exceptions

| Exception           | Derived from | Description
| ---------           | ------------ | -----------
| `osmium::io_error`  |              | Some kind of input/output error. Derived classes describe the error in more detail.
| `osmium::xml_error` | `io_error`   | Some kind of XML parser error.
| `osmium::format_version_error` | `io_error` | The OSM file format version was not understood. Osmium currently can only read version 0.6 files.
| `osmium::geometry_error` |         | Some kind of geometry error.
| `osmium::projection_error` |       | Thrown when a projection from one coordinate system into another fails in some way. Either the projection can't be initialized because of invalid parameters or the projection can't be calculated because the coordinates can't be transformed into the target coordinate system.
| `osmium::not_found` |              | This exception is thrown when a key is not found in an index.
| `osmium::invalid_location` |       |
| `osmium::unknown_type`     |       | Thrown by visitors when they encounter an unknown (or in this context unexpected) item type in a buffer. This should not happen in usual circumstances.

## Standard Exceptions thrown by Osmium


`std::invalid_argument`
:   Thrown by some Osmium functions.

