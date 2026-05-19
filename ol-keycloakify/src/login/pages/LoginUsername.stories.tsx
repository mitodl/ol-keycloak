import type { Meta, StoryObj } from "@storybook/react-vite"
import { createKcPageStory } from "../KcPageStory"

const { KcPageStory } = createKcPageStory({ pageId: "login-username.ftl" })

const meta = {
  title: "login/login-username.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <KcPageStory />
}

export const WithEmailAsUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: {
          loginWithEmailAllowed: true,
          registrationEmailAsUsername: true
        }
      }}
    />
  )
}

export const WithErrorMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          summary: "Your sign in attempt timed out. Sign in will start from the beginning.",
          type: "error"
        }
      }}
    />
  )
}

export const WithSocialProviders: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        social: {
          displayInfo: true,
          providers: [
            {
              displayName: "Okta test",
              providerId: "saml",
              loginUrl: "/realms/olapps/broker/okta-test/login?client_id=ol-mitlearn-client&tab_id=-ObQDXtAv0M&client_data=***",
              iconClasses: "",
              alias: "okta-test"
            },
            {
              displayName: "Fake Touchstone",
              providerId: "saml",
              loginUrl: "/realms/olapps/broker/fake-touchstone/login?client_id=ol-mitlearn-client&tab_id=-ObQDXtAv0M&client_data=***",
              iconClasses: "",
              alias: "fake-touchstone"
            },
            {
              displayName: "Use Touchstone@MIT",
              providerId: "saml",
              loginUrl: "/realms/olapps/broker/touchstone-idp/login?client_id=ol-mitlearn-client&tab_id=-ObQDXtAv0M&client_data=***",
              iconClasses: "",
              alias: "touchstone-idp"
            }
          ]
        }
      }}
    />
  )
}

export const WithTryAnotherWayLink: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        auth: {
          showTryAnotherWayLink: true
        }
      }}
    />
  )
}
