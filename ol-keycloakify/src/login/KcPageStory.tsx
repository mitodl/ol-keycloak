import type { DeepPartial } from "keycloakify/tools/DeepPartial"
import type { KcContext } from "./KcContext"
import KcPage from "./KcPage"
import { createGetKcContextMock } from "keycloakify/login/KcContext"
import type { KcContextExtension, KcContextExtensionPerPage } from "./KcContext"
import { themeNames, kcEnvDefaults } from "../kc.gen"

const kcContextExtension: KcContextExtension = {
  themeName: themeNames[0],
  properties: {
    ...kcEnvDefaults
  },
  olSettings: {
    homeUrl: "https://learn.mit.edu/",
    termsOfServiceUrl: "https://learn.mit.edu/terms"
  },
  loginAttempt: {
    userFullname: undefined,
    hasSocialProviderAuth: false,
    needsPassword: false
  }
}

const kcContextExtensionPerPage: KcContextExtensionPerPage = {}

export const { getKcContextMock } = createGetKcContextMock({
  kcContextExtension,
  kcContextExtensionPerPage,
  overrides: {},
  overridesPerPage: {}
})

export function createKcPageStory<PageId extends KcContext["pageId"]>(params: {
  pageId: PageId
}) {
  const { pageId } = params

  function KcPageStory(props: {
    kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>>
  }) {
    const { kcContext: overrides } = props

    const kcContextMock = getKcContextMock({
      pageId,
      overrides
    })

    return <KcPage kcContext={kcContextMock} />
  }

  return { KcPageStory }
}
