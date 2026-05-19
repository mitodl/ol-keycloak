import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { keycloakify } from "keycloakify/vite-plugin"
import { buildEmailTheme } from "keycloakify-emails"
import { BuildContext } from "keycloakify/bin/shared/buildContext"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName: ["ol-learn", "ol-data-platform"],
      accountThemeImplementation: "Single-Page",
      keycloakVersionTargets: {
        "22-to-25": true,
        "all-other-versions": `keycloakify-theme_v11-21_and_v26plus.jar`
      },
      environmentVariables: [
        { name: "POSTHOG_API_HOST", default: "https://us.i.posthog.com" },
        { name: "POSTHOG_API_KEY", default: "" }
      ],
      postBuild: async (buildContext: BuildContext) => {
        await buildEmailTheme({
          templatesSrcDirPath: __dirname + "/src/emails/templates",
          themeNames: buildContext.themeNames,
          assetsDirPath: __dirname + "/src/emails/templates/assets",
          keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
          locales: ["en"],
          cwd: __dirname,
          esbuild: {}
        })
      },
      startKeycloakOptions: {
        keycloakExtraArgs: ["--spi-login-provider=ol-freemarker"],
        extensionJars: ["./keycloak-resources/ol-spi-1.1-SNAPSHOT.jar"]
      }
    })
  ]
})
