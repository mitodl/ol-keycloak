#!/usr/bin/env bash
# This script file walks all the mjml templates and compile them into FTL templates

SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(dirname "$SCRIPT_DIR")
TEMPLATE_PATH="ol-keycloak/oltheme/src/main/resources/theme/ol/email/mjml/*.mjml"

for tmpl in $ROOT_DIR/$TEMPLATE_PATH; do
  if [[ $tmpl == *".mjml"* ]]; then
    # convert the file extension first, then the directory name
    html_file=$(echo $tmpl | sed -e "s/\.mjml/\.ftl/g" | sed -e "s/mjml/html/g")
    echo "Compiling: ${tmpl} to ${html_file}"
    npx mjml $tmpl -o $html_file
  fi
done
