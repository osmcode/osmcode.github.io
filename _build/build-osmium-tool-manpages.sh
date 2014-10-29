#!/bin/sh
#
#  build-osmium-tool-manpages.sh
#

MANUAL_DIR=../osmium-tool/doc

DIR=`pwd`
cd $MANUAL_DIR

for i in *.md; do
    OUT="$DIR/osmium/man/${i%%.md}.html"
    TITLE=`head -1 $i | sed -e 's/% //'`
    echo "---\nlayout: default\ntitle: $TITLE - Osmium Manpages\n---" >$OUT
    echo "&uarr; <a href='..'>Osmium</a>" >>$OUT
    echo "<h1 class='title'>$TITLE</h1>" >>$OUT
    sed -e 's/^#/##/' $i | pandoc -t html - >>$OUT
done

