#!/bin/bash -eu

set -o pipefail
 
MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd ) 
ROOT=$MYPATH/..

# Kill background processes when this script exits.
trap 'kill $(jobs -p)' EXIT

function prettifyOutput() {
    # xcpretty makes output nicer
    if which xcpretty 2>/dev/null; then
        xcpretty -t
    else
        cat
    fi
}

appium --log-level error &

pushd $ROOT/ios/
xcodebuild \
    -workspace "velo.xcworkspace/" \
    -scheme "velo" \
    -destination "platform=iOS Simulator,name=iPhone 5s" \
    -derivedDataPath "build" \
    build | prettifyOutput
popd

pushd $ROOT/app/
grunt nightwatch -e ios-sim
