#!/usr/bin/env bash
# This script file walks all the mjml templates and compile them into FTL templates

SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(dirname "$SCRIPT_DIR")
BASE_PATH="$ROOT_DIR/ol-keycloak/oltheme/src/main/resources/theme/ol/email"
MJML_PATH="mjml/*.mjml"
FTL_PATH="html/generated"

cd $BASE_PATH
echo "In: $BASE_PATH"
echo ""

mkdir -p $FTL_PATH

echo "Cleaning: $FTL_PATH"
echo ""
rm $FTL_PATH/*

echo "Compiling:"
for tmpl in $MJML_PATH; do
  if [[ $tmpl == *".mjml"* ]]; then
    # convert the file extension first, then the directory name
    ftl_filename=$(basename $tmpl | sed -e "s/\.mjml/\.ftl/g")
    ftl_output="$FTL_PATH/$ftl_filename"
    echo "  ${tmpl} => ${ftl_output}"
    npx mjml $tmpl -o $ftl_output
  fi
done
