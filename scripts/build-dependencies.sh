#!/bin/bash

set -e

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --no-color)
    NOCOLOR=true
    ;;
    *) # If it wasn't --no-color, we assume it was the path of the root of the project
    SUPPLIED_APP_FOLDER_PATH=$key
    ;;
esac
shift
done

if [ "$SUPPLIED_APP_FOLDER_PATH" = "" ] ; then
    echo "usage: build-dependencies.sh [--no-color] app_directory"
    echo "app_directory: the folder where application javascript is located (such as app.js)"
    exit 1
fi

if [ ! -d "$SUPPLIED_APP_FOLDER_PATH" ]; then
    echo "cannot find supplied app_directory"
    exit 1
fi

MYPATH=$( cd $SUPPLIED_APP_FOLDER_PATH && pwd )
EXTRA_NPM_ARGS=""

if [ "$NOCOLOR" = true ]; then
    EXTRA_NPM_ARGS="--no-color $EXTRA_NPM_ARGS"
fi

if [ ! -d $MYPATH/app-www/js/build ] ; then
    mkdir -p $MYPATH/app-www/js/build
fi

echo "Installing dependencies at the project root: $MYPATH"
pushd $MYPATH/..
    npm install $EXTRA_NPM_ARGS
popd

pushd $MYPATH/node_modules/mobify-progressive-app-sdk
    echo "Installing dependencies for mobify-progressive-app-sdk"
    npm install --no-progress --no-spin $EXTRA_NPM_ARGS
    echo "Building astro-client.js"
    npm run build:astro_client
popd

echo "Copying astro-client.js into app bundle"
cp $MYPATH/node_modules/mobify-progressive-app-sdk/js/build/astro-client.js $MYPATH/app-www/js/build

echo "SUCCESS: build dependencies"
