#!/bin/bash

PATH_TO_PACKAGE=${1:-"../code-states-visualizer"};


if [ ! -d "$PATH_TO_PACKAGE" ]; then
      echo "Given argument '$PATH_TO_PACKAGE' is not a directory"
      exit 1
fi

rm -r ./node_modules/code-states-visualizer;
mkdir ./node_modules/code-states-visualizer;

if [ ! -d "$PATH_TO_PACKAGE/dist" ]; then
  PATH_TO_THIS=$PWD
  cd "$PATH_TO_PACKAGE" || exit 1
  yarn install
  cd "$PATH_TO_THIS" || exit 1
fi

cp -r "$PATH_TO_PACKAGE/dist" node_modules/code-states-visualizer/dist;
cp "$PATH_TO_PACKAGE/package.json" node_modules/code-states-visualizer/package.json;
cd node_modules/code-states-visualizer || exit 1;
# npm install --prod;
cd ../..;
