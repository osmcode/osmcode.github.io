---
chapter: 17
title: Run-time Configuration
---

Osmium reads some settings from environment variables. This allows you to set
configuration options for the library at run-time without any support from the
application using the library. Setting these variables is usually not needed
in normal operations but could be useful when debugging or tweaking
performance.

## `OSMIUM_POOL_THREADS`

The number of threads in the thread pool used for certain input/output
operations.

If this is a negative number, it will be set to the actual number of cores on
the system plus the given number, ie it will leave a number of cores unused. In
all cases the minimum number of threads in the pool is 1.

Default: -2

## `OSMIUM_USE_POOL_THREADS_FOR_PBF_PARSING`

Normally PBF parsing will use the thread pool. You can disable this by setting
this variable to `false`.

Default: true

## Queue Sizes

The following environment variables can be used to change the queue sizes used
for file IO:

* Raw input data queue: `OSMIUM_MAX_INPUT_QUEUE_SIZE` (default 20)
* Parsed OSM input data queue: `OSMIUM_MAX_OSMDATA_QUEUE_SIZE` (default 20)
* Output data queue: `OSMIUM_MAX_OUTPUT_QUEUE_SIZE` (default 20)
* Worker threads input queue: `OSMIUM_MAX_WORK_QUEUE_SIZE` (default 10)

Smaller queue sizes mean that potentially less memory is used, but it also
means that the work can't be parallelized as effectively.

The minimum value for all queue sizes is 2. When set to 0, the default is
used.

## `OSMIUM_CLEAN_PAGE_CACHE_AFTER_READ`

Since 2.17.0 Osmium will, when reading files, tell the kernel using `fadvise`
that it can remove pages from the buffer cache that are not needed any more.
This is usually beneficial, because the memory can be used for something else.
But if you are reading the same OSM file multiple times at the same time or in
short succession, it might be better to keep those buffer pages.

Since 2.17.1 you can set the environment variable
`OSMIUM_CLEAN_PAGE_CACHE_AFTER_READ` to `no` and Osmium will not call
`fadvise`. Set it to `yes` or anything else (or not set it at all) to get the
default behaviour.

