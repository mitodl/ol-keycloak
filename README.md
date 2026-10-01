# ol-keycloak

Custom extensions for Keycloak SSO

## Development

Code checks run with [prek](https://prek.j178.dev/), which reads `.pre-commit-config.yaml`. The `prek` check runs the same hooks on every pull request, and [autofix.ci](https://autofix.ci/) pushes a commit with any fixes they make.

Install the version pinned by `prek-version` in `.github/workflows/autofix.yml`:

```bash
uv tool install prek==0.5.4
prek install -f             # replaces a pre-commit git hook, if one is installed
prek run --all-files
```

## Setup

### Steps to integrate with Keycloak

The steps needed to integrate the custom extensions are:

1. Clone this repository.
2. Open a terminal and navigate to this cloned project
3. In the terminal, from the `ol-keycloak` directory, build the custom java into a jar file.

```
 mvn clean install
```

4. The output from the `mvn` command above should indicate where the .jar file was created.
5. Copy the jar file to the `<keycloak_application_folder>/providers` folder. This folder should be present when you download the quarkus version of Keycloak.
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
