#!/bin/bash

PATH_TO_PACKAGE=${1:-"../quizzes/packages/moocfi-quizzes"};


if [ ! -d "$PATH_TO_PACKAGE" ]; then
      echo "Given argument '$PATH_TO_PACKAGE' is not a directory"
      exit -1
fi

rm -r ./node_modules/moocfi-quizzes;
mkdir ./node_modules/moocfi-quizzes;

if [ ! -d "$PATH_TO_PACKAGE/dist" ]; then
  PATH_TO_THIS=$PWD
  cd $PATH_TO_PACKAGE
  yarn install
  cd $PATH_TO_THIS
fi

cp -r $PATH_TO_PACKAGE/dist node_modules/moocfi-quizzes/dist;
cp $PATH_TO_PACKAGE/package.json node_modules/moocfi-quizzes/package.json;
cd node_modules/moocfi-quizzes;
npm install --prod;
cd ../..;
