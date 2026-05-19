import { useState } from "react"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Link, Button, Form, ButtonLink, SocialProviderButtonLink, OrBar, RevealPasswordButton, StyledTextField } from "../components/Elements"
import mitLogo from "../components/mit-logo.svg"

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, loginAttempt } = kcContext

  const { msg, msgStr } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("password")}
      headerNode={loginAttempt?.userFullname ? msg("loginGreeting", loginAttempt.userFullname) : msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers">
              <OrBar />
              {social.providers.map(p => (
                <SocialProviderButtonLink key={p.alias} id={`social-${p.alias}`} type="button" href={p.loginUrl} variant="bordered" size="large">
                  {p.iconClasses && <i aria-hidden="true"></i>}
                  {p.alias === "touchstone-idp" ? <img src={mitLogo} alt="MIT Logo" width={40} /> : null}
                  <span>{p.displayName}</span>
                </SocialProviderButtonLink>
              ))}
            </div>
          )}
        </>
      }
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password &&
            (!loginAttempt?.needsPassword ? (
              <Form
                id="kc-form-login"
                onSubmit={() => {
                  setIsLoginButtonDisabled(true)
                  return true
                }}
                action={url.loginAction}
                method="post"
              >
                {!usernameHidden && (
                  <StyledTextField
                    id="username"
                    label={
                      !realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")
                    }
                    name="username"
                    type="text"
                    fullWidth
                    InputProps={{
                      defaultValue: login.username ?? "",
                      autoFocus: true,
                      autoComplete: "username",
                      "aria-invalid": messagesPerField.existsError("username")
                    }}
                    errorText={messagesPerField.getFirstError("username")}
                    error={messagesPerField.existsError("username")}
                  />
                )}

                <StyledTextField
                  id="password"
                  label={msg("password")}
                  name="password"
                  type="password"
                  fullWidth
                  InputProps={{
                    autoComplete: "current-password",
                    "aria-invalid": messagesPerField.existsError("password")
                  }}
                  errorText={messagesPerField.getFirstError("password")}
                  error={messagesPerField.existsError("password")}
                  endAdornment={<RevealPasswordButton i18n={i18n} passwordInputId="password" />}
                />
                <div>
                  {realm.resetPasswordAllowed && (
                    <span>
                      <Link href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</Link>
                    </span>
                  )}
                </div>
                <div id="kc-form-buttons">
                  <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                  <Button disabled={isLoginButtonDisabled} name="login" id="kc-login" type="submit" variant="primary" size="large">
                    {msgStr("doLogIn")}
                  </Button>
                </div>
              </Form>
            ) : realm.resetPasswordAllowed ? (
              <div id="kc-form-login">
                <div>
                  <p>
                    <strong>Password required.</strong>
                    <br />
                    For security reasons you will need to create a new password for your account.
                  </p>
                </div>
                <div id="kc-form-buttons">
                  <ButtonLink href={url.loginResetCredentialsUrl} id="kc-create-password" type="submit">
                    {msgStr("createPassword")}
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div>
                <p>Unable to log you in - no password and password reset is disabled by the administrator.</p>
              </div>
            ))}
        </div>
      </div>
    </Template>
  )
}
