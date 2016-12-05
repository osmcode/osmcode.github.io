---
title: 14. Run-time Configuration
---

# {{ page.title }}

Osmium reads some settings from environment variables. This allows you to set
configuration options for the library at run-time without any support from the
application using the library. Setting these variables is usually not needed
in normal operations but could be useful when debugging or tweaking
performance.

## OSMIUM_POOL_THREADS

The number of threads in the thread pool used for certain input/output
operations.

If this is a negative number, it will be set to the actual number of cores on
the system plus the given number, ie it will leave a number of cores unused. In
all cases the minimum number of threads in the pool is 1.

Default: -2

## OSMIUM_USE_POOL_THREADS_FOR_PBF_PARSING

Normally PBF parsing will use the thread pool. You can disable this by setting
this variable to `false`.

Default: true

