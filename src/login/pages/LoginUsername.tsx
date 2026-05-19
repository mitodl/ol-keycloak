import { useState, useRef, useEffect, useCallback } from "react"
import { clsx } from "keycloakify/tools/clsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Button, Form, SocialProviderButtonLink, OrBar, StyledTextField, ValidationMessage, Suggestion } from "../components/Elements"
import mitLogo from "../components/mit-logo.svg"
import emailSpellChecker from "@zootools/email-spell-checker"
import { EMAIL_SPELLCHECKER_CONFIG, EMAIL_SUGGESTION_DOMAINS } from "../constants"

const isValidEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false
  const emailRegex = /^[^\s@]+@([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/
  return emailRegex.test(email.trim())
}

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField, loginAttempt } = kcContext

  const [username, setUsername] = useState(login.username ?? "")

  const { msg, msgStr } = i18n

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isFocusedRef = useRef(isFocused)
  const usernameRef = useRef(username)

  isFocusedRef.current = isFocused
  usernameRef.current = username

  const shouldValidateEmail = realm.loginWithEmailAllowed

  const checkValidity = useCallback(
    (value: string) => {
      if (shouldValidateEmail && value.trim()) {
        const valid = isValidEmail(value.trim())
        setIsEmailValid(valid)
        return valid
      }
      setIsEmailValid(true)
      return true
    },
    [shouldValidateEmail]
  )

  const checkEmailForSuggestion = useCallback((value: string) => {
    if (!value.trim()) {
      return
    }

    const parts = value.trim().split("@")
    const domain = parts[1]
    const startMatch = EMAIL_SUGGESTION_DOMAINS.some(d => d.startsWith(domain))
    // Don't show a suggestion while the user is typing towards a match
    if (startMatch) {
      setSuggestion(null)
      return
    }

    const suggestionResult = emailSpellChecker.run({
      email: value.trim(),
      ...EMAIL_SPELLCHECKER_CONFIG
    })

    setSuggestion(suggestionResult?.full || null)
  }, [])

  const isSubmitDisabled = isSubmitting || !username.trim() || (shouldValidateEmail && !isEmailValid)

  useEffect(() => {
    if (shouldValidateEmail) {
      checkValidity(username)
    }
  }, [username, shouldValidateEmail, checkValidity])

  useEffect(() => {
    const input = inputRef.current
    if (!input || !shouldValidateEmail) return

    const handleInvalid = (e: Event) => {
      e.preventDefault() // Prevent browser's default validation message
      if (!isFocusedRef.current && usernameRef.current.trim()) {
        setEmailInvalid(true)
      }
    }

    input.addEventListener("invalid", handleInvalid)

    return () => {
      input.removeEventListener("invalid", handleInvalid)
    }
  }, [shouldValidateEmail])

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      headerNode={loginAttempt?.userFullname ? msg("loginGreeting", loginAttempt.userFullname) : msg("loginAccountTitle")}
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers">
              <OrBar />
              {social.providers.map(p => (
                <SocialProviderButtonLink key={p.alias} id={`social-${p.alias}`} type="button" href={p.loginUrl} variant="bordered" size="large">
                  {p.iconClasses && <i className={clsx(p.iconClasses)} aria-hidden="true"></i>}
                  {p.alias === "touchstone-idp" ? <img src={mitLogo} width={40} /> : null}
                  <span className={clsx(p.iconClasses && "kc-social-icon-text")}>{p.displayName}</span>
                </SocialProviderButtonLink>
              ))}
            </div>
          )}
        </>
      }
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password && (
            <Form
              id="kc-form-login"
              noValidate
              onSubmit={() => {
                if (realm.registrationEmailAsUsername && username) {
                  sessionStorage.setItem("email", username.trim())
                }
                setIsSubmitting(true)
                return true
              }}
              action={url.loginAction}
              method="post"
            >
              {!usernameHidden && (
                <div>
                  <StyledTextField
                    id="username"
                    label={
                      !realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")
                    }
                    name="username"
                    type="email"
                    fullWidth
                    InputProps={{
                      autoFocus: true,
                      autoComplete: "username",
                      "aria-invalid": messagesPerField.existsError("username") || emailInvalid
                    }}
                    inputProps={{
                      ref: inputRef,
                      onFocus: () => {
                        setIsFocused(true)
                        setEmailInvalid(false)
                        setSuggestion(null)
                      },
                      onBlur: () => {
                        setIsFocused(false)
                        const value = inputRef.current?.value ?? ""
                        const isValid = checkValidity(value)
                        if (!isValid && value.trim()) {
                          setEmailInvalid(true)
                          setSuggestion(null)
                        } else if (isValid && shouldValidateEmail && value.trim()) {
                          checkEmailForSuggestion(value.trim())
                        }
                      }
                    }}
                    errorText={messagesPerField.getFirstError("username")}
                    error={messagesPerField.existsError("username") || emailInvalid}
                    onChange={e => {
                      const value = e.target.value
                      setUsername(value.trim())
                      const isValid = checkValidity(value)
                      if (isValid) {
                        setEmailInvalid(false)
                        if (shouldValidateEmail && value.trim()) {
                          checkEmailForSuggestion(value.trim())
                        } else {
                          setSuggestion(null)
                        }
                      } else {
                        setSuggestion(null)
                      }
                    }}
                    value={username}
                  />
                  {emailInvalid && !isFocused && (
                    <ValidationMessage id="form-help-text-after-username" aria-live="polite">
                      {msgStr("invalidEmailMessage")}
                    </ValidationMessage>
                  )}
                  {suggestion && (
                    <Suggestion
                      onClick={() => {
                        setSuggestion(null)
                        setUsername(suggestion)
                        checkValidity(suggestion)
                        setEmailInvalid(false)
                      }}
                    >
                      Did you mean: {suggestion}?
                    </Suggestion>
                  )}
                </div>
              )}
              <div id="kc-form-buttons">
                <Button disabled={isSubmitDisabled} name="login" id="kc-login" type="submit" size="large">
                  Next
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </Template>
  )
}
