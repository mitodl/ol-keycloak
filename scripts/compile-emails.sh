#!/usr/bin/env bash
# This script file walks all the mjml templates and compile them into FTL templates

set -eu

SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(dirname "$SCRIPT_DIR")
BASE_PATH="$ROOT_DIR/ol-keycloak/oltheme/src/main/resources/theme/ol/email"

cd $BASE_PATH

echo "Compiling:"
for tmpl in mjml/*.mjml; do
  if [[ $tmpl == *".mjml"* ]]; then
    # convert the file extension first, then the directory name
    ftl_filename=$(basename $tmpl | sed -e "s/\.mjml/\.ftl/g")
    ftl_output="html/$ftl_filename"
    echo "  ${tmpl} => ${ftl_output}"
    npx mjml $tmpl -o $ftl_output
    if [[ $ftl_filename == "template.ftl" ]]; then
      printf '<#macro emailLayout>\n%s\n</#macro>\n' "$(cat $ftl_output)" > $ftl_output
    fi
  fi
done
