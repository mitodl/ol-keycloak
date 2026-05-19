import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Button, Form, RevealPasswordButton, StyledTextField } from "../components/Elements"

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { msg } = i18n

  const { url, messagesPerField, isAppInitiatedAction } = kcContext

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("password", "password-confirm")}
      headerNode={msg("updatePasswordTitle")}
    >
      <Form id="kc-passwd-update-form" action={url.loginAction} method="post">
        <StyledTextField
          id="password-new"
          label={msg("passwordNew")}
          name="password-new"
          type="password"
          fullWidth
          InputProps={{
            autoFocus: true,
            autoComplete: "new-password",
            "aria-invalid": messagesPerField.existsError("password", "password-confirm")
          }}
          errorText={messagesPerField.get("password")}
          error={messagesPerField.existsError("password")}
          endAdornment={<RevealPasswordButton i18n={i18n} passwordInputId="password-new" />}
        />
        <StyledTextField
          id="password-confirm"
          label={msg("passwordConfirm")}
          name="password-confirm"
          type="password"
          fullWidth
          InputProps={{
            autoComplete: "new-password",
            "aria-invalid": messagesPerField.existsError("password-confirm")
          }}
          errorText={messagesPerField.get("password-confirm")}
          error={messagesPerField.existsError("password-confirm")}
          endAdornment={<RevealPasswordButton i18n={i18n} passwordInputId="password-confirm" />}
        />

        <div id="kc-form-buttons">
          <Button type="submit">{msg("doSubmit")}</Button>
          {isAppInitiatedAction && (
            <Button type="submit" name="cancel-aia" value="true" style={{ marginTop: "16px" }}>
              {msg("doCancel")}
            </Button>
          )}
        </div>
      </Form>
    </Template>
  )
}
