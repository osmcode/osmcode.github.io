#!/bin/sh
#
#  build-libosmium-manual.sh
#

MANUAL_DIR=../libosmium-manual

make -C $MANUAL_DIR singlehtml pdf epub

cp $MANUAL_DIR/out/libosmium-manual.pdf \
   $MANUAL_DIR/out/libosmium-manual.epub \
   $MANUAL_DIR/out/libosmium-manual.html \
   $MANUAL_DIR/out/manual.css libosmium/manual/

