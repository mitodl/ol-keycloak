import { Suspense } from "react"
import type { ClassKey } from "keycloakify/login"
import type { KcContext } from "./KcContext"
import { useI18n } from "./i18n"
import DefaultPage from "keycloakify/login/DefaultPage"
import Template from "./Template"
import { ThemeProvider } from "@mitodl/smoot-design"
import { GlobalStyles } from "./components/GlobalStyles"
import Login from "./pages/Login"
import LoginUsername from "./pages/LoginUsername"
import Register from "./pages/Register"
import UserProfileFormFields from "./UserProfileFormFields"
import LoginResetPassword from "./pages/LoginResetPassword"
import LoginPassword from "./pages/LoginPassword"
import LoginUpdatePassword from "./pages/LoginUpdatePassword"
import LoginVerifyEmail from "./pages/LoginVerifyEmail"
import LoginPageExpired from "./pages/LoginPageExpired"
import UpdateEmail from "./pages/UpdateEmail"
import Error from "./pages/Error"

const doMakeUserConfirmPassword = true

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props

  const { i18n } = useI18n({ kcContext })

  return (
    <Suspense>
      <ThemeProvider>
        <GlobalStyles />
        {(() => {
          switch (kcContext.pageId) {
            case "login.ftl":
              return (
                <Login
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "login-username.ftl":
              return (
                <LoginUsername
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "login-password.ftl":
              return (
                <LoginPassword
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "register.ftl":
              return (
                <Register
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                  UserProfileFormFields={UserProfileFormFields}
                  doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
              )
            case "login-reset-password.ftl":
              return (
                <LoginResetPassword
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "login-update-password.ftl":
              return (
                <LoginUpdatePassword
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "login-verify-email.ftl":
              return (
                <LoginVerifyEmail
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "login-page-expired.ftl":
              return (
                <LoginPageExpired
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            case "update-email.ftl":
              return (
                <UpdateEmail
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                  UserProfileFormFields={UserProfileFormFields}
                  doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
              )
            case "error.ftl":
              return (
                <Error
                  {...{ kcContext, i18n, classes }}
                  Template={Template}
                  doUseDefaultCss={false}
                />
              )
            default:
              return (
                <DefaultPage
                  kcContext={kcContext}
                  i18n={i18n}
                  classes={classes}
                  Template={Template}
                  doUseDefaultCss={false}
                  UserProfileFormFields={UserProfileFormFields}
                  doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
              )
          }
        })()}
      </ThemeProvider>
    </Suspense>
  )
}

const classes = {} satisfies { [key in ClassKey]?: string }
