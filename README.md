# ol-keycloak

Custom theme and extensions for Keycloak SSO

This repository contains two components:

- **`ol-keycloak/`** — Java SPI plugin and legacy Freemarker (FTL) theme, built with Maven
- **`ol-keycloakify/`** — React-based Keycloak theme built with [Keycloakify](https://keycloakify.dev) v11, covering login, account, and email pages

## Repository structure

```
ol-keycloak/        Java SPI plugin and Freemarker theme (Maven)
ol-keycloakify/     React/Keycloakify theme (Yarn v4, TypeScript)
scripts/            Build and utility scripts
Dockerfile.hosted   Multi-stage Docker image for hosted Keycloak deployments
```

## Setup

### Prerequisites

- **Java 17** and **Maven** — for the SPI plugin and oltheme
- **Node.js ≥ 20** and **Yarn v4** — for the Keycloakify theme

### Building locally

Run `./scripts/build-local.sh` to build both components and copy all JARs into `plugins/`:

```shell
./scripts/build-local.sh
```

This builds the Maven modules (`ol-spi`, `oltheme`) and the Keycloakify theme, then copies all output JARs to `plugins/`.

### Using the Dockerfile

The `Dockerfile.hosted` is a self-contained multi-stage build — it builds both the Java providers and the Keycloakify theme from source without requiring pre-built JARs:

```shell
docker build -f ./Dockerfile.hosted --platform=linux/amd64 .
```

### Using Nix for local environment

You can use Nix to create a reproducible local dev environment with the tools necessary to build our customizations:

- [Install nix](https://nixos.org/download)
- [Install nix-direnv](https://github.com/nix-community/nix-direnv?tab=readme-ov-file#installation)
- Run:
  ```bash
  echo "use flake . --impure" > .envrc
  direnv allow
  ```

## ol-keycloak — Java SPI and Freemarker theme

The code for the Open Learning Java SPI and legacy Freemarker theme lives in `ol-keycloak/`.

### SPI plugin (`ol-keycloak/ol-spi/`)

Custom Keycloak Service Provider Interface implementation. Provides the `ol-freemarker` login forms provider used by the hosted Keycloak deployment.

### Login Theme (`ol-keycloak/oltheme/`)

Freemarker (`.ftl`) templates for the legacy `ol` theme. These are loaded by Keycloak automatically when the theme is selected in the admin console on a **per-realm basis**.

Available login templates from the base theme:
https://github.com/keycloak/keycloak/tree/main/themes/src/main/resources/theme/base/login

## ol-keycloakify — React/Keycloakify theme

The Keycloakify theme lives in `ol-keycloakify/`. See [`ol-keycloakify/README.md`](ol-keycloakify/README.md) for full development documentation.

### Quick start

```bash
cd ol-keycloakify
yarn install
yarn dev          # local dev server
yarn start        # start Keycloak in Docker for theme testing
yarn storybook    # component development
```

### Building the theme JAR

```bash
cd ol-keycloakify
yarn build-keycloak-theme
# Output: ol-keycloakify/dist_keycloak/*.jar
```

### Releases

A GitHub release with the theme JAR is created automatically when `ol-keycloakify/package.json` version is bumped on `main`. Tags are prefixed `keycloakify-v*` (e.g. `keycloakify-v0.1.0`) to distinguish from SPI releases.

The Storybook build publishes to GitHub Pages at <https://mitodl.github.io/ol-keycloak>.
