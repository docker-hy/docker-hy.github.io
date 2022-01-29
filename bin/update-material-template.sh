#!/bin/bash
#
# Update material template for the directory that was provided as a parameter.

if [ $# -lt 1 ]; then
  echo 1>&2 "$0: not enough arguments"
  exit 2
elif [ $# -gt 1 ]; then
  echo 1>&2 "$0: too many arguments"
  exit 2
fi

updated_repository=${1%/}

BASEDIR=$(dirname "$0")
BASEDIR_WITHOUT_BIN=${BASEDIR%bin}

if [ -z "$BASEDIR_WITHOUT_BIN" ]; then
  BASEDIR_WITHOUT_BIN="."
fi

rm -r $updated_repository/gatsby-*
rm -r $updated_repository/package*
rm -r $updated_repository/plugins
rm -r $updated_repository/src
rm -r $updated_repository/docs
rm -r $updated_repository/bin

cp -r $BASEDIR_WITHOUT_BIN/gatsby-* $updated_repository
cp -r $BASEDIR_WITHOUT_BIN/package* $updated_repository
cp -r $BASEDIR_WITHOUT_BIN/plugins $updated_repository/plugins
cp -r $BASEDIR_WITHOUT_BIN/src $updated_repository/src
cp -r $BASEDIR_WITHOUT_BIN/docs $updated_repository/docs
cp -r $BASEDIR_WITHOUT_BIN/bin $updated_repository/bin
