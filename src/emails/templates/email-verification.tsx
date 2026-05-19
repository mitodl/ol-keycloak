import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails"
import { createVariablesHelper } from "keycloakify-emails/variables"
import { Text, Body, Container, Section, Preview, Html, Head, render } from "jsx-email"

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginBottom: "64px",
  padding: "20px 0 48px"
}

const box = {
  padding: "0 48px"
}
const paragraph = {
  color: "#777",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const
}

// used by Preview App of jsx-email
export const previewProps: Omit<GetTemplateProps, "plainText"> = {
  locale: "en",
  themeName: "vanilla"
}

export const templateName = "Email Verification"

const { exp } = createVariablesHelper("email-verification.ftl")

export const Template = ({ locale }: Omit<GetTemplateProps, "plainText">) => (
  <Html lang={locale}>
    <Head />
    <Preview>Verification link from {exp("realmName")}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={paragraph}>
            Someone has created a {exp("realmName")} account with this email address. If
            this was you, click the link below to verify your email address
          </Text>
          <Text style={paragraph}>
            <a href={exp("link")}>Link to e-mail address verification</a>
          </Text>
          <Text style={paragraph}>
            This link will expire within {exp("linkExpirationFormatter(linkExpiration)")}.
          </Text>
          <Text style={paragraph}>
            If you didn&apos;t create this account, just ignore this message.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const getTemplate: GetTemplate = async props => {
  return await render(<Template {...props} />, { plainText: props.plainText })
}

export const getSubject: GetSubject = async () => {
  return "Verify email"
}
