---
chapter: 6
title: Verbose mode
---

Most Osmium commands support the `-v` or `--verbose` command line option to
enable *verbose* mode. Osmium will then display information about its command
line parameters and about what it is doing to STDERR.

Each line of the output is started with the elapsed time in minutes and
seconds. This is especially useful when Osmium is run in scripts and the
output is logged, you can immediately see where the time went.

In verbose mode, most Osmium commands will also display the memory used. This
is handy because Osmium command often need a lot of memory to efficiently do
their job. There is also a `MEMORY` section in each of the man pages that
tells you about memory use of this particular command.

