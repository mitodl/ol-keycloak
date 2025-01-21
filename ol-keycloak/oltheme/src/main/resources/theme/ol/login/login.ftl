<#import "template.ftl" as layout>
  <@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password')
    displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section="header">
      <#if loginAttempt.userFullname?has_content>
        ${msg("loginGreeting")} ${loginAttempt.userFullname}!
        <#else>
          ${msg("loginAccountTitle")}
      </#if>
      <#elseif section="form">
        <div id="kc-form">
          <div id="kc-form-wrapper">
            <#if realm.password && social.providers?size == 0>
              <#if !loginAttempt.needsPassword>
                <form id="kc-form-login" class="${properties.kcFormClass!} onsubmit=" login.disabled=true; return true;"
                  action="${url.loginAction}" method="post">
                  <#if !usernameHidden??>
                    <div class="${properties.kcFormGroupClass!}">
                      <label for="username" class="${properties.kcLabelClass!}">
                        <span class="pf-v5-c-form__label-text">
                          <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif
                              !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if>
                        </span>
                      </label>

                      <span
                        class="${properties.kcInputClass!} ${messagesPerField.existsError('username','password')?then('pf-m-error', '')}">
                        <input id="username" name="username" value="${(login.username!'')}" type="email" autofocus
                          autocomplete="off"
                          aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>" />
                        <#if messagesPerField.existsError('username','password')>
                          <span class="pf-v5-c-form-control__utilities">
                            <span class="pf-v5-c-form-control__icon pf-m-status">
                              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                            </span>
                          </span>
                        </#if>
                      </span>

                      <#if messagesPerField.existsError('username','password')>
                        <span id="input-error" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                          ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
                        </span>
                      </#if>

                    </div>
                  </#if>

                  <div class="${properties.kcFormGroupClass!}">
                    <label for="password" class="${properties.kcLabelClass!}">
                      <span class="pf-v5-c-form__label-text">${msg("password")}</span>
                    </label>

                    <div class="${properties.kcInputGroup!} password-toggle-field">
                      <input id="password" name="password" type="password" autocomplete="off"
                        aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                        class="${properties.kcInputClass!}" />
                      <div class="toggle-password-button">
                        <button class="${properties.kcFormPasswordVisibilityButtonClass!}" type="button"
                          aria-label="${msg('showPassword')}" aria-controls="password" data-password-toggle
                          data-icon-show="${properties.kcFormPasswordVisibilityIconShow!}"
                          data-icon-hide="${properties.kcFormPasswordVisibilityIconHide!}"
                          data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}">
                          <i class="${properties.kcFormPasswordVisibilityIconShow!}" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>

                    <#if usernameHidden?? && messagesPerField.existsError('username','password')>
                      <span id="input-error" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                        ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
                      </span>
                    </#if>

                  </div>

                  <#if (realm.rememberMe && !usernameHidden) || realm.resetPasswordAllowed>
                    <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                      <#if realm.rememberMe && !usernameHidden??>
                        <div id="kc-form-options">
                          <div class="checkbox">
                            <label>
                              <span class="pf-v5-c-form__label-text">
                                <#if login.rememberMe??>
                                  <input id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                                  <#else>
                                    <input id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                                </#if>
                              </span>
                            </label>
                          </div>
                        </div>
                      </#if>
                      <#if realm.resetPasswordAllowed>
                        <div class="${properties.kcFormOptionsWrapperClass!}">
                          <span><a href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                        </div>
                      </#if>

                    </div>
                  </#if>

                  <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                    <input type="hidden" id="id-hidden-input" name="credentialId" <#if
                      auth.selectedCredential?has_content>value="${auth.selectedCredential}"
              </#if>/>
              <input
                class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                name="login" id="kc-login" type="submit" value="${msg("doLogIn")}" />
          </div>
          </form>
          <#elseif realm.resetPasswordAllowed>
            <div id="kc-form-login" class="${properties.kcFormClass!}">
              <div class="${properties.kcFormGroupClass!}">
                <p>
                  <b>Password required.</b>
                  For security reasons you will need to create a new password for your account.
                </p>
              </div>
              <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                <a
                  href="${url.loginResetCredentialsUrl}"
                  class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                  id="kc-create-password" type="submit">
                  ${msg("createPassword")}
                </a>
              </div>
            </div>
          <#else>
            <div class="${properties.kcFormGroupClass!}">
              <p>Unable to log you in - no password and password reset is disabled by the administrator.</p>
            </div>
    </#if>
    </#if>
    </div>
    </div>
    <script type="module" src="${url.resourcesPath}/js/passwordVisibility.js"></script>
    <#elseif section="info">
      <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
        <div id="kc-info" class="${properties.kcSignUpClass!}">
          <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
            <div id="kc-registration-container">
              <div id="kc-registration">
                <span>${msg("noAccount")} <a href="${url.registrationUrl}">${msg("doRegister")}</a></span>
              </div>
            </div>
          </div>
        </div>
      </#if>
      <#elseif section="socialProviders">
        <#if realm.password && social.providers?size != 0>
          <p class="pf-v5-u-font-weight-bold pf-v5-u-mb-sm">You already have a login with:</p>
        </#if>
        <#include "social-providers.ftl">
      </#if>

  </@layout.registrationLayout>
