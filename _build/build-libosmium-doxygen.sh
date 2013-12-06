#!/bin/sh
#
#  build-libosmium-doxygen.sh
#

LIBOSMIUM_DIR=../libosmium

make -C $LIBOSMIUM_DIR doc

cp -r $LIBOSMIUM_DIR/doc/html/* libosmium/reference/

