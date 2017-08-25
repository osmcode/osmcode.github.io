---
chapter: 9
title: Blackhole Format
---

The BLACKHOLE format is special. All data written to a blackhole "file" is
thrown away without being encoded. This is useful in some cases, for instance
when you are benchmarking. Unlike writing to `/dev/null` which will encode the
data before throwing it away, the "blackhole" file type doesn't have any
overhead.

It is not possible to read the "blackhole" file format. Combinations like
"osc.blackhole" etc. are possible.

