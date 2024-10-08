<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username') displayInfo=(realm.password &&
  realm.registrationAllowed && !registrationDisabled??); section>
  <#if section="header">
    ${msg("loginAccountTitle")}
  <#elseif section="form">
    <div id="kc-form">
      <div id="kc-form-wrapper">
        <#if realm.password>
          <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}"
            method="post" class="${properties.kcFormClass}">
            <#if !usernameHidden??>
              <div class="${properties.kcFormGroupClass!}">
                <label for="username" class="${properties.kcLabelClass!}">
                  <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>
                      ${msg("usernameOrEmail")}<#else>${msg("email")}</#if>
                </label>

                <input id="username" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
                  class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}" type="text"
                  autofocus autocomplete="off" />

                <#if messagesPerField.existsError('username')>
                  <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}"
                    aria-live="polite">
                    ${kcSanitize(messagesPerField.get('username'))?no_esc}
                  </span>
                </#if>
              </div>
            </#if>

            <#if realm.rememberMe && !usernameHidden??>
              <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                <div id="kc-form-options">
                  <div class="checkbox">
                    <label>
                      <#if login.rememberMe??>
                        <input id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                        <#else>
                          <input id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                      </#if>
                    </label>
                  </div>
                </div>
              </div>
            </#if>

            <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
              <input
                class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                name="login" id="kc-login" type="submit" value="${msg('doLogIn')}" />
              <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                <div id="kc-registration">
                  <span>${msg("noAccount")} <a href="${url.registrationUrl}">${msg("doRegister")}</a></span>
                </div>
              </#if>
            </div>
          </form>
        </#if>
      </div>
    </div>
  <#elseif section="socialProviders">
    <div class="separator pf-v5-u-py-md">
      <span class="pf-v5-u-px-md">or</span>
    </div>
    <#include "social-providers.ftl">
  </#if>

</@layout.registrationLayout>
