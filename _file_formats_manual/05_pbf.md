---
chapter: 5
title: PBF Format
---

The [PBF](https://wiki.openstreetmap.org/wiki/PBF_Format) file format is based
on the [Google Protocol Buffers](https://developers.google.com/protocol-buffers/).
PBF files are very space efficient and faster to use than XML files. PBF files
can contain normal OSM data or OSM history data, but there is no equivalent to
the XML .osc format.

Osmium supports reading and writing of nodes in *DenseNodes* and non-*DenseNodes*
formats. Default is *DenseNodes*, as this is much more space-efficient. Add the
format parameter `pbf_dense_nodes=false` to disable *DenseNodes*.

Osmium usually will compress PBF blocks using zlib. To disable this, use the
format parameter `pbf_compression=none`. This makes reading and writing faster,
but the resulting files are larger.

From Libosmium 2.16, the compression type LZ4 is also supported
(`pbf_compression=lz4`). Compression and decompression with LZ4 is much faster
than with zlib, but the compression ratio is not quite as good. Note that LZ4
compression is optional and only available if it was compiled in. Most other
programs reading PBF files will not be able to read it.

Also from Libosmium version 2.16 you can set the compression level with the
file format option `pbf_compression_level`. Allowed values depend on the
PBF compression used.

| PBF compression | Option | Level     |
| --------------- | ------ | --------- |
| No compression  | `none` | n/a       |
| ZLIB            | `zlib` | 0 - 9     |
| LZ4             | `lz4`  | 1 - 65537 |

PBF files contain a string table in each data block. Some programs sort this
string table for slightly better compression. Osmium does not do this to make
writing of PBF files faster.

Usually PBF files contain all the metadata for objects such as changeset id,
username, etc. To save some space you can disable writing of metadata with the
format option `add_metadata=false`.

