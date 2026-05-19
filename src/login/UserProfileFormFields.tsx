import { useEffect, Fragment, ReactElement, useState } from "react"
import emailSpellChecker from "@zootools/email-spell-checker"
import { assert } from "keycloakify/tools/assert"
import type { KcClsx } from "keycloakify/login/lib/kcClsx"
import {
  useUserProfileForm,
  getButtonToDisplayForMultivaluedAttributeField,
  type FormAction,
  type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { Attribute } from "keycloakify/login/KcContext"
import type { KcContext } from "./KcContext"
import type { I18n } from "./i18n"
import { Label, ValidationMessage, RevealPasswordButton, HelperText, Suggestion } from "./components/Elements"
import { StyledTextField } from "./components/Elements"
import { ORG_EMAIL_DOMAINS } from "./constants"

const isOrgEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false
  const emailParts = email.trim().split("@")
  if (emailParts.length !== 2) return false
  const domain = emailParts[1].toLowerCase()
  return ORG_EMAIL_DOMAINS.some(
    (orgEmailDomain: string) => domain === orgEmailDomain.toLowerCase() || domain.endsWith(`.${orgEmailDomain.toLowerCase()}`)
  )
}

export default function UserProfileFormFields(
  props: Omit<UserProfileFormFieldsProps<KcContext, I18n>, "kcClsx"> & {
    onEmailValueChange?: (email: string) => void
  }
) {
  const { kcContext, i18n, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField, onEmailValueChange } = props

  const { advancedMsg } = i18n

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword
  })

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable)
  }, [isFormSubmittable, onIsFormSubmittableValueChange])

  const emailValue = formFieldStates.find(state => state.attribute.name === "email")?.valueOrValues

  useEffect(() => {
    if (typeof emailValue === "string") {
      onEmailValueChange?.(emailValue)
    }
  }, [emailValue, onEmailValueChange])

  const groupNameRef = { current: "" }

  return (
    <>
      {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
        if (attribute.name === "emailOptIn") {
          return <input type="hidden" name="emailOptIn" value="1" key={attribute.name} />
        }

        /* We have an attribute group configured in Prod with firstName and lastName
           that is not shown in the ol-keycloak register.ftl template migrated from. */
        if (attribute.group?.name === "legal-address") {
          return <input type="hidden" name={attribute.name} value={valueOrValues} key={"legal-address-" + attribute.name} />
        }

        return (
          <Fragment key={attribute.name}>
            <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} />
            {BeforeField !== undefined && (
              <BeforeField
                attribute={attribute}
                dispatchFormAction={dispatchFormAction}
                displayableErrors={displayableErrors}
                valueOrValues={valueOrValues}
                kcClsx={(() => {}) as KcClsx}
                i18n={i18n}
              />
            )}
            <div
              style={{
                display:
                  attribute.annotations.inputType === "hidden" || (attribute.name === "password-confirm" && !doMakeUserConfirmPassword)
                    ? "none"
                    : undefined
              }}
            >
              <div>
                {attribute.annotations.inputHelperTextBefore && (
                  <HelperText id={`form-help-text-before-${attribute.name}`} aria-live="polite">
                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                  </HelperText>
                )}
                <InputFieldByType
                  attribute={attribute}
                  label={advancedMsg(attribute.displayName ?? "")}
                  valueOrValues={valueOrValues}
                  displayableErrors={displayableErrors}
                  dispatchFormAction={dispatchFormAction}
                  i18n={i18n}
                />
                <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={undefined} />
                {attribute.annotations.inputHelperTextAfter !== undefined && (
                  <ValidationMessage id={`form-help-text-after-${attribute.name}`} aria-live="polite">
                    {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                  </ValidationMessage>
                )}
                {AfterField !== undefined && (
                  <AfterField
                    attribute={attribute}
                    dispatchFormAction={dispatchFormAction}
                    displayableErrors={displayableErrors}
                    valueOrValues={valueOrValues}
                    i18n={i18n}
                    kcClsx={(() => {}) as KcClsx}
                  />
                )}
                {/* NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook */}
              </div>
            </div>
          </Fragment>
        )
      })}
    </>
  )
}

function GroupLabel(props: {
  attribute: Attribute
  groupNameRef: {
    current: string
  }
  i18n: I18n
}) {
  const { attribute, groupNameRef, i18n } = props

  const { advancedMsg } = i18n

  if (attribute.group?.name !== groupNameRef.current) {
    groupNameRef.current = attribute.group?.name ?? ""

    if (groupNameRef.current !== "") {
      assert(attribute.group !== undefined)

      return (
        <div {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}>
          {(() => {
            const groupDisplayHeader = attribute.group.displayHeader ?? ""
            const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name

            return (
              <div>
                <Label id={`header-${attribute.group.name}`} style={{ fontWeight: "bold" }}>
                  {groupHeaderText}
                </Label>
              </div>
            )
          })()}
          {(() => {
            const groupDisplayDescription = attribute.group.displayDescription ?? ""

            if (groupDisplayDescription !== "") {
              const groupDescriptionText = advancedMsg(groupDisplayDescription)

              return (
                <div>
                  <Label id={`description-${attribute.group.name}`}>{groupDescriptionText}</Label>
                </div>
              )
            }

            return null
          })()}
        </div>
      )
    }
  }

  return null
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined }) {
  const { attribute, fieldIndex } = props

  const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex)

  if (displayableErrors.length === 0) {
    return null
  }

  return (
    <span id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`} aria-live="polite">
      {displayableErrors
        .filter(error => error.fieldIndex === fieldIndex)
        .map(({ errorMessage }, i, arr) => (
          <ValidationMessage key={i}>
            {errorMessage}
            {arr.length - 1 !== i && <br />}
          </ValidationMessage>
        ))}
    </span>
  )
}

type InputFieldByTypeProps = {
  attribute: Attribute
  label: string | ReactElement
  valueOrValues: string | string[]
  displayableErrors: FormFieldError[]
  dispatchFormAction: React.Dispatch<FormAction>
  i18n: I18n
}

function InputFieldByType(props: InputFieldByTypeProps) {
  const { attribute, valueOrValues } = props

  switch (attribute.annotations.inputType) {
    // NOTE: Unfortunately, keycloak won't let you define input type="hidden" in the Admin Console.
    // sometimes in the future it might.
    case "hidden":
      return <input type="hidden" name={attribute.name} value={valueOrValues} />
    case "textarea":
      return <TextareaTag {...props} />
    case "select":
    case "multiselect":
      return <SelectTag {...props} />
    case "select-radiobuttons":
    case "multiselect-checkboxes":
      return <InputTagSelects {...props} />
    default: {
      const InputComponent = attribute.name === "email" ? EmailTag : InputTag

      if (valueOrValues instanceof Array) {
        return (
          <>
            {valueOrValues.map((...[, i]) => (
              <InputComponent key={i} {...props} fieldIndex={i} />
            ))}
          </>
        )
      }

      return <InputComponent {...props} fieldIndex={undefined} />
    }
  }
}

function BaseInputTag(
  props: InputFieldByTypeProps & {
    fieldIndex: number | undefined
    transformValue?: (value: string) => string
    onBeforeChange?: () => void
    onBlur?: () => void
    onFocus?: () => void
  }
) {
  const {
    attribute,
    fieldIndex,
    dispatchFormAction,
    valueOrValues,
    i18n,
    displayableErrors,
    label,
    transformValue,
    onBeforeChange,
    onBlur,
    onFocus
  } = props

  const { advancedMsgStr } = i18n

  return (
    <>
      <StyledTextField
        size="medium"
        id={attribute.name}
        name={attribute.name}
        label={label}
        type={(() => {
          if (attribute.name === "password" || attribute.name === "password-confirm") {
            return "password"
          }

          const { inputType } = attribute.annotations

          if (inputType?.startsWith("html5-")) {
            return inputType.slice(6)
          }

          return inputType ?? "text"
        })()}
        disabled={attribute.readOnly}
        value={(() => {
          if (fieldIndex !== undefined) {
            assert(valueOrValues instanceof Array)
            return valueOrValues[fieldIndex]
          }

          assert(typeof valueOrValues === "string")

          return valueOrValues || valueOrValues
        })()}
        placeholder={
          attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
        }
        onChange={event => {
          if (onBeforeChange) {
            onBeforeChange()
          }

          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: (() => {
              const rawValue = event.target.value
              const processedValue = transformValue ? transformValue(rawValue) : rawValue

              if (fieldIndex !== undefined) {
                assert(valueOrValues instanceof Array)

                return valueOrValues.map((value, i) => {
                  if (i === fieldIndex) {
                    return processedValue
                  }

                  return value
                })
              }

              return processedValue
            })()
          })
        }}
        onBlur={() => {
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: fieldIndex
          })
          if (onBlur) {
            onBlur()
          }
        }}
        {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
        InputProps={{
          "aria-invalid": displayableErrors.length !== 0,
          autoComplete: attribute.autocomplete
        }}
        inputProps={{
          onFocus: () => {
            onFocus?.()
          }
        }}
        fullWidth
        endAdornment={
          attribute.name === "password" || attribute.name === "password-confirm" ? (
            <RevealPasswordButton i18n={props.i18n} passwordInputId={attribute.name} />
          ) : undefined
        }
      />
      {(() => {
        if (fieldIndex === undefined) {
          return null
        }

        assert(valueOrValues instanceof Array)

        const values = valueOrValues

        return (
          <>
            <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
            <AddRemoveButtonsMultiValuedAttribute
              attribute={attribute}
              values={values}
              fieldIndex={fieldIndex}
              dispatchFormAction={dispatchFormAction}
              i18n={i18n}
            />
          </>
        )
      })()}
    </>
  )
}

const EMAIL_SUGGESTION_DOMAINS = [
  ...emailSpellChecker.POPULAR_DOMAINS,
  // Users with MIT addresses should have been directed to Touchstone on login. We might prevent some mistyped registrations here, though correct organization addresses will be show a validation error prompting to return to login.
  ...ORG_EMAIL_DOMAINS
]

function EmailTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
  const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n } = props

  const { advancedMsgStr } = i18n

  const [touched, setTouched] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false)

  const [initialValue, setInitialValue] = useState<string | null>(() => {
    if (fieldIndex === undefined) {
      return sessionStorage.getItem("email")
    }
    return null
  })

  const checkEmailForSuggestion = () => {
    if (typeof valueOrValues !== "string" || !valueOrValues) {
      return
    }
    setHasBeenBlurred(true)
    const suggestion = emailSpellChecker.run({
      email: valueOrValues,
      domains: EMAIL_SUGGESTION_DOMAINS
    })
    setSuggestion(suggestion?.full || null)
  }

  const orgEmailDetected = typeof valueOrValues === "string" && valueOrValues.trim() && isOrgEmail(valueOrValues)

  useEffect(() => {
    if (initialValue && !touched) {
      dispatchFormAction({
        action: "update",
        name: attribute.name,
        valueOrValues: initialValue
      })
      setTouched(true)
    }
  }, [initialValue, touched, dispatchFormAction, attribute.name])

  return (
    <>
      <BaseInputTag
        {...props}
        transformValue={(value: string) => {
          // Email-specific transformation: trim whitespace
          return value.trim()
        }}
        onBeforeChange={() => {
          if (!touched) {
            setTouched(true)
          }
          if (initialValue) {
            setInitialValue(null)
          }
          if (suggestion) {
            setSuggestion(null)
          }
        }}
        onBlur={checkEmailForSuggestion}
        onFocus={() => {
          setHasBeenBlurred(false)
        }}
      />
      {orgEmailDetected && hasBeenBlurred ? (
        <ValidationMessage id="form-help-text-mit-email" aria-live="polite">
          {advancedMsgStr("orgEmailRegistrationMessage")}
        </ValidationMessage>
      ) : null}
      {suggestion ? (
        <Suggestion
          onClick={() => {
            setSuggestion(null)
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: suggestion
            })
          }}
        >
          Did you mean: {suggestion}?
        </Suggestion>
      ) : null}
    </>
  )
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
  return <BaseInputTag {...props} />
}

function AddRemoveButtonsMultiValuedAttribute(props: {
  attribute: Attribute
  values: string[]
  fieldIndex: number
  dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>
  i18n: I18n
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props

  const { msg } = i18n

  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex })

  const idPostfix = `-${attribute.name}-${fieldIndex + 1}`

  return (
    <>
      {hasRemove && (
        <>
          <button
            id={`kc-remove${idPostfix}`}
            type="button"
            className="pf-c-button pf-m-inline pf-m-link"
            onClick={() =>
              dispatchFormAction({
                action: "update",
                name: attribute.name,
                valueOrValues: values.filter((_, i) => i !== fieldIndex)
              })
            }
          >
            {msg("remove")}
          </button>
          {hasAdd ? <>&nbsp;|&nbsp;</> : null}
        </>
      )}
      {hasAdd && (
        <button
          id={`kc-add${idPostfix}`}
          type="button"
          className="pf-c-button pf-m-inline pf-m-link"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""]
            })
          }
        >
          {msg("addValue")}
        </button>
      )}
    </>
  )
}

function InputTagSelects(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, i18n, valueOrValues } = props

  const { inputType } = (() => {
    const { inputType } = attribute.annotations

    assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes")

    switch (inputType) {
      case "select-radiobuttons":
        return {
          inputType: "radio"
        }
      case "multiselect-checkboxes":
        return {
          inputType: "checkbox"
        }
    }
  })()

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations

      if (inputOptionsFromValidation === undefined) {
        break walk
      }

      const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation]

      if (validator === undefined) {
        break walk
      }

      if (validator.options === undefined) {
        break walk
      }

      return validator.options
    }

    return attribute.validators.options?.options ?? []
  })()

  return (
    <>
      {options.map(option => (
        <div key={option}>
          <input
            type={inputType}
            id={`${attribute.name}-${option}`}
            name={attribute.name}
            value={option}
            aria-invalid={props.displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
            onChange={event =>
              dispatchFormAction({
                action: "update",
                name: attribute.name,
                valueOrValues: (() => {
                  const isChecked = event.target.checked

                  if (valueOrValues instanceof Array) {
                    const newValues = [...valueOrValues]

                    if (isChecked) {
                      newValues.push(option)
                    } else {
                      newValues.splice(newValues.indexOf(option), 1)
                    }

                    return newValues
                  }

                  return event.target.checked ? option : ""
                })()
              })
            }
            onBlur={() =>
              dispatchFormAction({
                action: "focus lost",
                name: attribute.name,
                fieldIndex: undefined
              })
            }
          />
          <Label htmlFor={`${attribute.name}-${option}`}>{inputLabel(i18n, attribute, option)}</Label>
        </div>
      ))}
    </>
  )
}

function TextareaTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, valueOrValues } = props

  assert(typeof valueOrValues === "string")

  const value = valueOrValues

  return (
    <textarea
      id={attribute.name}
      name={attribute.name}
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
      rows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
      maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
      value={value}
      onChange={event =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined
        })
      }
    />
  )
}

function SelectTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props

  const isMultiple = attribute.annotations.inputType === "multiselect"

  return (
    <select
      id={attribute.name}
      name={attribute.name}
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      multiple={isMultiple}
      size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
      value={valueOrValues}
      onChange={event =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: (() => {
            if (isMultiple) {
              return Array.from(event.target.selectedOptions).map(option => option.value)
            }

            return event.target.value
          })()
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined
        })
      }
    >
      {!isMultiple && <option value=""></option>}
      {(() => {
        const options = (() => {
          walk: {
            const { inputOptionsFromValidation } = attribute.annotations

            if (inputOptionsFromValidation === undefined) {
              break walk
            }

            assert(typeof inputOptionsFromValidation === "string")

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation]

            if (validator === undefined) {
              break walk
            }

            if (validator.options === undefined) {
              break walk
            }

            return validator.options
          }

          return attribute.validators.options?.options ?? []
        })()

        return options.map(option => (
          <option key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </option>
        ))
      })()}
    </select>
  )
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n

  if (attribute.annotations.inputOptionLabels !== undefined) {
    const { inputOptionLabels } = attribute.annotations

    return advancedMsg(inputOptionLabels[option] ?? option)
  }

  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`)
  }

  return option
}
