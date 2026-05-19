import type { JSX } from "keycloakify/tools/JSX"
import { useState } from "react"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Form, ValidationMessage, Button, Link, Info, Subtitle } from "../components/Elements"
import { ORG_EMAIL_DOMAINS } from "../constants"

const isOrgEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false
  const emailParts = email.trim().split("@")
  if (emailParts.length !== 2) return false
  const domain = emailParts[1].toLowerCase()
  return ORG_EMAIL_DOMAINS.some(
    (orgEmailDomain: string) => domain === orgEmailDomain.toLowerCase() || domain.endsWith(`.${orgEmailDomain.toLowerCase()}`)
  )
}

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<
    (props: Omit<UserProfileFormFieldsProps, "kcClsx"> & { onEmailValueChange?: (email: string) => void }) => JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function Register(props: RegisterProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
    olSettings
  } = kcContext

  const { msg, advancedMsg } = i18n

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)
  const [areTermsAccepted, setAreTermsAccepted] = useState(false)
  const [emailValue, setEmailValue] = useState<string>("")

  // Block form submission if org email is detected
  const hasOrgEmail = emailValue.trim() && isOrgEmail(emailValue)
  const isFormSubmittableWithOrgCheck = isFormSubmittable && !hasOrgEmail

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
      displayMessage={messagesPerField.exists("global")}
      displayInfo
      infoNode={
        <Info>
          {msg("registerLegalAgreementText")} <Link href={olSettings?.termsOfServiceUrl || "#"}>{msg("registerTermsOfService")}</Link>.
        </Info>
      }
    >
      <Subtitle>{msg("registerInstruction")}</Subtitle>
      <Form id="kc-register-form" action={url.registrationAction} method="post">
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          onEmailValueChange={setEmailValue}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />
        {termsAcceptanceRequired && (
          <TermsAcceptance
            i18n={i18n}
            messagesPerField={messagesPerField}
            areTermsAccepted={areTermsAccepted}
            onAreTermsAcceptedValueChange={setAreTermsAccepted}
          />
        )}
        {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
          <div className="form-group">
            <div>
              <div className="g-recaptcha" data-size="normal" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
            </div>
          </div>
        )}
        <div>
          {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
            <div id="kc-form-buttons">
              <Button
                data-sitekey={recaptchaSiteKey}
                data-callback={() => {
                  ;(document.getElementById("kc-register-form") as HTMLFormElement).submit()
                }}
                data-action={recaptchaAction}
                type="submit"
              >
                {msg("doRegister")}
              </Button>
            </div>
          ) : (
            <div id="kc-form-buttons">
              <Button disabled={!isFormSubmittableWithOrgCheck || (termsAcceptanceRequired && !areTermsAccepted)} type="submit" size="large">
                {msg("doRegister")}
              </Button>
            </div>
          )}

          <div id="kc-form-options">
            <div>
              <Info>
                {msg("alreadyHaveAnAccountRegister")}
                <Link href={url.loginRestartFlowUrl}>{msg("backToLogin")}</Link>.
              </Info>
            </div>
          </div>
        </div>
      </Form>
    </Template>
  )
}

function TermsAcceptance(props: {
  i18n: I18n
  messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">
  areTermsAccepted: boolean
  onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void
}) {
  const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props

  const { msg } = i18n

  return (
    <>
      <div className="form-group">
        <div>
          {msg("termsTitle")}
          <div id="kc-registration-terms-text">{msg("termsText")}</div>
        </div>
      </div>
      <div className="form-group">
        <div>
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={areTermsAccepted}
            onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
            aria-invalid={messagesPerField.existsError("termsAccepted")}
          />
          <label htmlFor="termsAccepted">{msg("acceptTerms")}</label>
        </div>
        {messagesPerField.existsError("termsAccepted") && (
          <div>
            <ValidationMessage
              id="input-error-terms-accepted"
              aria-live="polite"
              dangerouslySetInnerHTML={{
                __html: kcSanitize(messagesPerField.get("termsAccepted"))
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}
