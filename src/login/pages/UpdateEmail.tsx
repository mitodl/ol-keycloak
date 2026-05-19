import styled from "@emotion/styled"
import type { JSX } from "keycloakify/tools/JSX"
import { useState } from "react"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Form, Button } from "../components/Elements"

const Buttons = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "flex-end"
}))

type UpdateEmailProps = PageProps<Extract<KcContext, { pageId: "update-email.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>
  doMakeUserConfirmPassword: boolean
}

export default function UpdateEmail(props: UpdateEmailProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  })

  const { msg, msgStr } = i18n

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)

  const { url, messagesPerField, isAppInitiatedAction } = kcContext

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={messagesPerField.exists("global")}
      headerNode={msg("updateEmailTitle")}
    >
      <Form id="kc-update-email-Form" action={url.loginAction} method="post">
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />

        <div>
          <div id="kc-form-options">
            <div />
          </div>

          <Buttons id="kc-form-buttons">
            {isAppInitiatedAction && (
              <Button type="submit" name="cancel-aia" value="true">
                {msg("doCancel")}
              </Button>
            )}
            <Button disabled={!isFormSubmittable} type="submit">
              {msgStr("doSubmit")}
            </Button>
          </Buttons>
        </div>
      </Form>
    </Template>
  )
}
