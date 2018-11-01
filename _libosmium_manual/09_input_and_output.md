---
chapter: 9
title: Input and Output
---

Libosmium can read several different OSM file formats.


## Headers

Whenever you want to use Osmium to access OSM files you need to include the
right header files and link your program to the right libraries. If you want
to support all the different formats you add

``` c++
#include <osmium/io/any_input.hpp>
```

and/or

``` c++
#include <osmium/io/any_output.hpp>
```

to your C++ files. These headers will pull in all the file formats and all
the compression types for input and output, respectively. Usually this is
what you want to use. But if you are sure you don't need all formats or if
you don't have all the libraries needed for all the formats, you can pick
and choose formats and compression types.

If you only need some file formats, you can include any combinations of the
following headers:

``` c++
#include <osmium/io/pbf_input.hpp>
#include <osmium/io/xml_input.hpp>

#include <osmium/io/debug_output.hpp>
#include <osmium/io/opl_output.hpp>
#include <osmium/io/pbf_output.hpp>
#include <osmium/io/xml_output.hpp>
```

If you want compression support, you have to add the includes for the different
compression algorithms:

``` c++
#include <osmium/io/gzip_compression.hpp>
#include <osmium/io/bzip2_compression.hpp>
```

Or, if you want both anyway, you can just use the shortcut:

``` c++
#include <osmium/io/any_compression.hpp>
```


## Compression

If you want to use compression you have to include the right header files and
link to the `libz` and `libbz2` libraries, respectively.


## File Formats

### XML

For read support you need the expat parser library. Link with:

    -lexpat

For write support no special library is needed.

### PBF

To build with PBF support you have to compile with threads and need `libz`:

    -pthread -lz

Note that in older versions of `libosmium` you needed to link with the
`protobuf` and `osmpbf` libraries. They are not used any more. Instead the
[protozero](https://github.com/mapbox/protozero) header-only library is used.


## Reading and Writing OSM Files with Osmium

### The osmium::io::File class

Before reading from or writing to an OSM file, you have to instantiate an
object of class osmium::io::File. It encapsulates the file name as well as
any information about the format of the file. In the simplest case the
File class can derive the file format from the file name:

``` c++
osmium::io::File input_file{"planet.osm.pbf"} // PBF format
osmium::io::File input_file{"planet.osm.bz2"} // XML with bzip2 compression
osmium::io::File input_file{"planet.osc.gz"}  // XML change file, gzip2 compression
```

The constructor of the File class has a second, optional argument giving the
format of the file, which can be used if the format can't be deduced from the
file name. In the simplest form the format argument looks the same as the
usual file suffixes:

``` c++
osmium::io::File input_file{"somefile", "osm.bz2"};
```

This setting of the format is often needed when reading from STDIN or
writing to STDOUT. Both an empty string and a single dash as filename
signify STDIN/STDOUT:

``` c++
osmium::io::File input_file{"-", "osm.bz2"};
osmium::io::File output_file{"", "pbf"};
```

The format string can also take optional arguments separated by commas.

``` c++
osmium::io::File output_file{"out.osm.pbf", "pbf,pbf_dense_nodes=false"};
```


It is also possible to change the format after creating a File object using the accessor functions:

``` c++
osmium::io::File input_file{"some_file.osm"};
input_file.format(osmium::io::file_format_pbf);
```

### Reading a File

After you have a File object you can instantiate a Reader object to open the file for reading:

``` c++
osmium::io::File input_file{"input.osm.pbf"};
osmium::io::Reader reader{input_file};
```

As a shortcut you can just give a file name to the Reader if you are relying
on the automatic file format detection and don't want to do any special format
handling:

``` c++
osmium::io::Reader reader{"input.osm.pbf"};
```

Optionally you can add a second argument to the Reader constructor giving the
types of OSM entities you are interested in. Sometimes you only need, say, the
ways from the file, but not the nodes and relations. If you tell the Reader
about it, it might be able to read the file more efficiently by skipping those
parts you are not interested in:

``` c++
osmium::io::Reader reader{"input.osm.pbf", osmium::osm_entity_bits::way};
```

You can set the following flags:

| Flag                                 | Description
| ----                                 | -----------
| `osmium::osm_entity_bits::nothing`   | Do not ready any entities at all (useful if you are only interested in the file header)
| `osmium::osm_entity_bits::node`      | Read nodes
| `osmium::osm_entity_bits::way`       | Read ways
| `osmium::osm_entity_bits::relation`  | Read relations
| `osmium::osm_entity_bits::changeset` | Read changesets
| `osmium::osm_entity_bits::all`       | Read all of the above

You can also "or" several flags together if needed.

You can get the header information from the file using the `header()` function:

``` c++
osmium::io::Header header = reader.header();
```

You read the OSM entities from the file using the `read()` which returns a
buffer with the data:

``` c++
while (osmium::memory::Buffer buffer = reader.read()) {
    ...
}
```

At the end of the file an invalid buffer is returned which evaluates to false
in boolean context.

You can close the file at any time. It will also be automatically closed when
the Reader object goes out of scope.

``` c++
reader.close();
```

In most cases you do not want to work with the buffers, but with the OSM
entities within them. See the [Iterators] chapter and the [Handlers]
chapter for more convenient methods of working with open files.


### The File Header

Some OSM file formats contain a file header. The most popular formats XML
and PBF have a header as well as the O5M/O5C format. The OPL format doesn't
have a header.

You access the header information of a file you are reading from the `Reader`
object with the `header()` method:

``` c++
osmium::io::Header header = reader.header();
```

When writing a file the header can be set in the constructor of the `Writer`
object, see below.

The header can contain any number of bounding boxes, although usually there is
only a single one (or none). PBF files only allow a single bounding box, but
XML files can have multiple ones, although it is unusual and the semantics are
unclear, so it is discouraged to create files with multiple bounding boxes.

The header contains a flag telling you whether this file can contain multiple
versions of the same object. This is true for history files and for change
files, but not for normal OSM data files. Not all OSM file formats can
distinguish between those cases, so the flag might be wrong.

In addition the header can contain any number of key-value pairs with
additional information. Most often this is used to set the `generator`, the
program that generated the file. Depending on the file format some of these
key-value pairs are handled specially. Because there is no generic header
option facility in OSM files, you can only read/write options that Osmium
recognizes. Unknown options or options not suitable for the file format you
are writing are silently ignored.

See the description of the `osmium::io::Header` and the `osmium::util::Options`
class for details on setting and accessing these options.

These header options are recognized by Osmium:

| Format       | R/W | Option                                | Description
| ------       | --- | ------                                | -----------
| XML,PBF      | r/w | `generator`                           | The program that generated this file. If this is not set by an application, Libosmium will set it to `libosmium/VERSION` on writing.
| XML          | r/w | `xml_josm_upload`                     | Value of the `upload` attribute on the `osm` XML element (`true` or `false`) for use in JOSM.
| XML          | r   | `version`                             | File version (currently always set to `0.6`).
| PBF, O5M/O5C | r   | `timestamp`                           | (Replication) timestamp (*1*).
| PBF          | r   | `pbf_dense_nodes`                     | Set when reading a PBF file with DenseNodes (*2*).
| PBF          | r   | `pbf_optional_feature_#`              | Set for all optional features specified in PBF header (*3*).
| PBF          | r/w | `osmosis_replication_timestamp`       | Timestamp used in replication (*1*, *4*).
| PBF          | r/w | `osmosis_replication_sequence_number` | Sequence number used in replication (*4*).
| PBF          | r/w | `osmosis_replication_base_url`        | Base URL for change files used in replication (*4*).
| O5M/O5C      | r   | `o5m_timestamp`                       | (Replication) timestamp (*1*).

Notes:

1. The `timestamp` field is set to the same value as either
   `osmosis_replication_timestamp` or `o5m_timestamp` (if available). When
   writing a file, a `timestamp` option is ignored, you have to use one of
   the other ones.
2. To disable DenseNodes when writing a file (they are enabled by default),
   you have to set this option not on the `Header` but on the `File` object.
3. Example: When there are two optional features names "Foo" and "Bar" set in
   the PBF header, the options `pbf_optional_feature_0=Foo` and
   `pbf_optional_feature_1=Bar` are set.
4. See the section "What are the replication fields for?" on
   `https://wiki.openstreetmap.org/wiki/PBF_Format` for details.

### Writing a File

To create an OSM file, create an instance of the `osmium::io::Writer` class
and move buffers with OSM objects into its `write()` function:

``` c++
osmium::memory::Buffer buffer;
// Add objects to the buffer (see above) or read it from
// an input file using osmium::io::Reader::read().
osmium::io::File output_file{"output.osm.pbf"};
osmium::io::Writer writer{output_file};
writer.write(std::move(buffer));
writer.close();
```

As a shortcut, you can directly give the filename to the Writer if you are
relying on the automatic file format detection (the same as for Readers) and
don't need any special handling.

``` c++
osmium::io::Writer writer{"output.osm.pbf"};
```

You can give additional arguments to the constructor of the Writer class, for
instance a customized header or to allow writing over an existing file:

``` c++
osmium::io::Header header;
header.set("generator", "FastOSMTool");
osmium::io::Writer writer{"output.osm.pbf",
                          header,
                          osmium::io::overwrite::allow,
                          osmium::io::fsync::yes};
```

