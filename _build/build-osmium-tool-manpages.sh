#!/bin/sh
#
#  build-osmium-tool-manpages.sh
#

MANUAL_DIR=../osmium-tool/doc

DIR=`pwd`
cd $MANUAL_DIR

for i in *.md; do
    pandoc -s -t html -o $DIR/osmium/man/${i%%.md}.html $i
done

