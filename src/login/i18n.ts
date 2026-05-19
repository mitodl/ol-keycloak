/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login"
import type { ThemeName } from "../kc.gen"

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      doLogIn: "Next",
      loginAccountTitle: "Enter your email to start.",
      loginGreeting: "Hello, {0}!",
      noAccount: "Don't have an account? ",
      doRegister: "Sign Up",
      doForgotPassword: "Reset password?",
      registerTitle: "Join MIT Learn for free",
      backToLogin: "Log In",
      alreadyHaveAnAccountRegister: "Already have an account? ",
      emailForgotTitle: "Reset Password",
      emailInstruction: "Enter your email for a password reset link.",
      doResetPasswordSubmit: "Send Reset Email",
      updatePasswordTitle: "Create a new password",
      doSubmit: "Next",
      emailVerifyInstruction1: "A verification email has been sent to: {0}",
      emailVerifyInstruction2: "Please click the link from your email to continue.",
      emailVerifyInstruction3:
        "Check the email inbox you signed up with. You may need to check the Spam folder.",
      emailVerifyInstruction4Bold: "Still no verification email? ",
      emailVerifyInstruction4: "Please contact our",
      createPassword: "Create Password",
      termsOfService: "Terms of Service",
      registerLegalAgreementText: "By creating an account I agree to the",
      registerTermsOfService: "Terms of Service",
      // From ol-keycloak https://github.com/mitodl/ol-keycloak/blob/main/ol-keycloak/oltheme/src/main/resources/theme/ol/email/messages/messages_en.properties
      doRegisterSubmit: "Sign Up",
      registerInstruction: "Enter your information to sign up",
      registerPrivacyPolicy: "Privacy Policy",
      "ol-linked-identity-provider-label": "You already have a login with",
      // doResetPasswordSubmit: "Next",
      resetPasswordSubtitle: "Enter your email for a password reset link.",
      emailForgotSubtitle: "Enter your email for a password reset link.",
      logInRegister: "Log In",
      loginSubtitle: "Please enter your email address.",
      loginUsernameSubtitle: "Choose one of the options to log in",
      forgotPasswordSendResetEmail: "Send Reset Email",
      emailVerifyResend: "Resend Email",
      emailVerifySupportLinkTitle: "Customer Support Center",
      passwordRequiredTitle: "Password Required.",
      passwordRequiredText:
        "For security reasons you will need to create a new password for your account.",
      passwordRequiredUnableText:
        "Unable to log you in - you have no password and password reset is disabled by the administrator.",
      and: "and",
      touchstoneAtMIT: "Use Touchstone@MIT",
      doRegisterSecurityKey: "Sign up",
      loginTitle: "MIT Learn",
      loginTitleHtml: "Open Learning",
      loginTimeout:
        "Your sign in attempt timed out.  Sign in will start from the beginning.",
      browserRequired: "Browser required to sign in",
      usernameOrEmail: "Email",
      fullName: "Full name",
      restartLoginTooltip: "Restart sign in",
      loginChooseAuthenticator: "Select sign in method",
      pageExpiredMsg1: "To restart the sign in process",
      pageExpiredMsg2: "To continue the sign in process",
      invalidUsernameOrEmailMessage:
        " We do not have an account for that email on record. Please try another email or sign up for free.",
      invalidEmailMessage: "Invalid email address.",
      orgEmailRegistrationMessage:
        "Please return to login to be directed to your identity provider.",
      invalidPasswordMessage:
        "The password you have entered is incorrect. Please try again or select Reset Password below.",
      expiredCodeMessage: "Sign in timeout. Please sign in again.",
      expiredActionMessage: "Action expired. Please continue with sign in now.",
      federatedIdentityExistsMessage:
        "User with {0} {1} already exists. Please sign in to account management to link the account.",
      emailSentMessage:
        "We emailed you instructions for setting your password. You should receive them shortly.",
      delegationCompleteHeader: "Sign In Successful",
      delegationFailedHeader: "Sign In Failed",
      delegationFailedMessage:
        "You may close this browser window and go back to your console application and try signing in again.",
      invalidCodeMessage:
        "An error occurred, please sign in again through your application.",
      identityProviderLinkSuccess:
        "You successfully verified your email. Please go back to your original browser and continue there with the sign in.",
      staleCodeMessage:
        "This page is no longer valid, please go back to your application and sign in again",
      "password-help-text": "Sign in by entering your password.",
      "auth-username-form-help-text": "Start sign in by entering your username",
      "auth-username-password-form-help-text":
        "Sign in by entering your username and password.",
      updateEmailTitle: "Update your email",
      "error-user-attribute-required": "Please fill in this field.",
      backToApplication: "Back to Application",
      supportName: "MIT Learn Customer Support Center",
      supportEmail: "mitlearn-support@mit.edu"
    }
  })
  .build()

type I18n = typeof ofTypeI18n

export { useI18n, type I18n }
