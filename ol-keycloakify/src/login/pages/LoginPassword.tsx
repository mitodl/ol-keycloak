import { useState } from "react"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Link, Form, Button, RevealPasswordButton, StyledTextField } from "../components/Elements"

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { realm, url, messagesPerField, loginAttempt } = kcContext

  const { msg } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={loginAttempt?.userFullname ? msg("loginGreeting", loginAttempt.userFullname) : ""}
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          <Form
            id="kc-form-login"
            onSubmit={() => {
              setIsLoginButtonDisabled(true)
              return true
            }}
            action={url.loginAction}
            method="post"
          >
            <StyledTextField
              id="password"
              label={msg("password")}
              name="password"
              type="password"
              fullWidth
              InputProps={{
                autoComplete: "on",
                "aria-invalid": messagesPerField.existsError("password")
              }}
              errorText={messagesPerField.get("password")}
              error={messagesPerField.existsError("password")}
              endAdornment={<RevealPasswordButton i18n={i18n} passwordInputId="password" />}
            />
            {realm.resetPasswordAllowed && (
              <span>
                <Link href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</Link>
              </span>
            )}
            <div id="kc-form-buttons">
              <Button name="login" id="kc-login" type="submit" disabled={isLoginButtonDisabled} size="large">
                Next
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Template>
  )
}
