#!/usr/bin/env bash
#

set -eux

SCRIPT_DIR=$( dirname -- "${BASH_SOURCE[0]}" )

pushd "$SCRIPT_DIR/.." || exit 1

pushd ol-keycloak || exit 1

mvn clean install

popd || exit 1

cp ol-keycloak/{oltheme,ol-spi}/target/*.jar plugins/

popd || exit 1
