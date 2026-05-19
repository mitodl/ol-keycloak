/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ExtendKcContext } from "keycloakify/login"
import type { KcEnvName, ThemeName } from "../kc.gen"

export type KcContextExtension = {
  themeName: ThemeName
  properties: Record<KcEnvName, string> & {}
  // NOTE: Here you can declare more properties to extend the KcContext
  // See: https://docs.keycloakify.dev/faq-and-help/some-values-you-need-are-missing-from-in-kccontext

  loginAttempt: {
    userFullname?: string
    needsPassword: boolean
    // Deprecated: No longer used in template logic (removed from Login.tsx to fix bug where
    // users with both SSO and password auth get stuck)
    hasSocialProviderAuth?: boolean
  }

  olSettings: {
    homeUrl: string
    termsOfServiceUrl: string
  }
}

export type KcContextExtensionPerPage = {}

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>
