---
chapter: 4
title: XML Format
---

There are several different XML formats in use in the OSM project. The main
formats are the one used for planet files, extracts, and API responses (suffix
`.osm`), the format used for change files (suffix `.osc`) and the history
format (suffixes `.osm` or `.osh`).

Some variants are also used, such as the JOSM format which is similiar to the
normal OSM format but has some additions. Support for the features of these
formats varies.

When reading, the OSM change format (`.osc`) is detected automatically. When
writing, you have to set it using the format specifier `osc` or the format
parameter `xml_change_format=true`.

