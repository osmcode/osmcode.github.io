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

