---
chapter: 1
title: Introduction
---

[Osmium](https://osmcode.org/osmium) is a versatile command line tool for
working with OpenStreetMap data. It includes many useful functions for
manipulating OSM data and often outperforms similar tools. This manual will
introduce the tool, give a general overview and describe some use cases. For
the nitty gritty detail consult the [manual
pages](https://docs.osmcode.org/osmium/latest/).

Osmium is Open Source and available under the GNU General Public License.
It works and is regularly tested on Linux, Mac OSX, and Windows.

Osmium is based on the C++ library [libosmium](https://osmcode.org/libosmium)
and it gets most of its functionality from it. If the command line tool doesn't
do something you need, have a look at the library. Maybe you can use it to
create a program that does what you want.

*Osmium is not complete. Of course most software will never be complete, but I
mention this here, because there are some glaring gaps in Osmium's
functionality, missing functions that would be useful for many people and that
would fit Osmium's mission as a general OSM data manging tool. They might be
missing because nobody thought of writing them, but more likely nobody did have
the time yet. Osmium, like most Open Source Software, is built piece by piece
based on what the author and others need. I some cases we haven't implemented
some functionality, because it is available somewhere else and while it would
be nice to have it in the same package, available alternatives make adding it a
lower priority. In any case, [tell
us](https://github.com/osmcode/osmium-tool/issues) if you need something.*

