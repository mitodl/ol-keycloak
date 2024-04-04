# ol-keycloak

Custom theme and extensions for Keycloak SSO

## Setup

### Steps to integrate with Keycloak

The steps needed to integrate the custom theme and extensions are:

1. Clone this repository.
2. Open a terminal and navigate to this cloned project
3. In the terminal, from the `ol-keycloak` directory, build the custom java and theme into 2 separate jar files.

```
 mvn clean install
```

4. The output from the `mvn` command above should indicate where the two .jar files were created.
5. Copy both jar files to the `<keycloak_application_folder>/providers` folder. This folder should be present when you download the quarkus version of Keycloak.
6. Start the Keycloak application based on the directions from Keycloak.

### Using the Dockerfile

To use the Dockerfile, you must ensure that the directory `plugins/` exists:

```shell
mkdir -p plugins/
```

If you need to test locally, you may run `./scripts/build-local.sh` to build the sources and copy the JAR files into `plugins/`.

### Using Nix for local environment

You can use Nix to create a reproducible local dev environment with the tools necessary to build our customizations:

- [Install nix](https://nixos.org/download)
- [Install nix-direnv](https://github.com/nix-community/nix-direnv?tab=readme-ov-file#installation)
- Run:
  ```bash
  echo "use flake . --impure" > .envrc
  direnv allow
  ```

## Theme

The code for the Open Learning theme is located at `ol-keycloak/oltheme/src/main/resources/theme/ol/`. These are comprised of [Freemarker templates](https://freemarker.apache.org/) (`.ftl` files). Keycloak picks these up automatically when the theme is selected in the Keycloak admin on a **per-realm basis**. Themes behave such that if a given template file isn't found in our theme, Keycloak will look up the template in the parent theme(s) and use that. This means if we don't style a template it will use the default one.

### Login Theme

The login theme builds on Keycloak's built in theme's usage of the [`PatternFly`](https://www.patternfly.org/). UI framework. This is customized largely through CSS variables defined in the `style.css` file. We should strive to use or tweak that framwork rather than building our own bespoke CSS as this will be the easiest for upgrades.

Available login templates can be found in the base theme here:
https://github.com/keycloak/keycloak/tree/main/themes/src/main/resources/theme/base/login

### Email Theme

The email theme utilizes the HTML email framework/toolset [`mjml`](https://mjml.io/). This is a popular framework for building/generating HTML emails that display well across a variety of mail clients, incorporating the knowledge and experience of others into a fairly simple markup language. This results in at least an order of magnitude less code that Just Works.

Available email templates can be found in the base theme here:
https://github.com/keycloak/keycloak/tree/main/themes/src/main/resources/theme/base/email/html

These mjml tempalates live in `./ol-keycloak/oltheme/src/main/resources/theme/ol/email/mjml/`. There is a script `./scripts/compile-emails.sh` that compiles these templates into `./ol-keycloak/oltheme/src/main/resources/theme/ol/email/html/` as `.ftl` files. To use this script you'll need to run `npm install`.

**You should run this script and commit the compiled files when you make template changes.**

Note that when you need to place FTL template expressions in a mjml template, you need to wrap it in a `<mj-raw>` tag (see [the documentation on this tag](https://documentation.mjml.io/#mj-raw)).
