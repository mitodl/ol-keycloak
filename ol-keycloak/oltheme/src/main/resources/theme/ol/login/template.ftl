<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<html class="${properties.kcHtmlClass!}"<#if realm.internationalizationEnabled> lang="${locale.currentLanguageTag}"</#if>>

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if authenticationSession??>
        <script type="module">
            import { checkCookiesAndSetTimer } from "${url.resourcesPath}/js/authChecker.js";

            checkCookiesAndSetTimer(
              "${authenticationSession.authSessionId}",
              "${authenticationSession.tabId}",
              "${url.ssoLoginInOtherTabsUrl}
        box-shadow: 0px 2px 2px 0px rgba(3, 21, 45, 0.05);
            );
        </script>
    </#if>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap')
    </style>
</head>

<body id="keycloak-bg" class="${properties.kcBodyClass!}">
<div class="pf-v5-c-login"
    x-data="{
        open: false,
        toggle() {
            if (this.open) {
                return this.close()
            }

            this.$refs.button.focus()

            this.open = true
        },
        close(focusAfter) {
            if (! this.open) return

            this.open = false

            focusAfter && focusAfter.focus()
        }
    }"
    x-on:keydown.escape.prevent.stop="close($refs.button)"
    x-on:focusin.window="! $refs.panel?.contains($event.target) && close()"
    x-id="['language-select']"
>
  <div class="pf-v5-c-login__container">
    <main>
      <header class="pf-v5-c-login__main-header">
        <div class="pf-v5-u-mb-2xl">
          <h1 class="pf-v5-c-title pf-m-4xl">
            <a href="${olSettings.homeUrl}" class="logo-link pf-v5-u-display-flex pf-v5-u-justify-content-center">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 1680 1040" enable-background="new 0 0 1680 1040" xml:space="preserve">
                <path d="M880,880h160V400H880V880z M1120,320h400V160h-400V320z M880,160.00003h160v160H880V160.00003z M640,880h160V160H640V880z
                       M400,720h160V160H400V720z M160,880h160V160H160V880z M1120,880h160V400h-160V880z"/>
              </svg>
              Open
            </a>
          </h1>
        </div>

        <#-- App-initiated actions should not see warning messages about the need to complete the action -->
        <#-- during login.                                                                               -->
        <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
            <div class="${properties.kcAlertClass!} pf-v5-u-mb-md pf-m-${(message.type = 'error')?then('danger', message.type)}">
                <div class="pf-v5-c-alert__icon">
                    <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                    <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                    <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                    <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                </div>
                    <span class="${properties.kcAlertTitleClass!}">${kcSanitize(message.summary)?no_esc}</span>
            </div>
        </#if>

        <h2 class="pf-v5-c-title pf-m-3xl"><#nested "header"></h2>

        <#if auth?has_content && auth.showUsername() && !auth.showResetCredentials()>
            <div>
                <#nested "show-username">

                <div id="kc-username" class="${properties.kcFormGroupClass!}">
                    <label id="kc-attempted-username" class="pf-v5-u-font-size-sm">${auth.attemptedUsername}</label>
                </div>
            </div>
        </#if>

        <#if realm.internationalizationEnabled  && locale.supported?size gt 1>
        <div class="pf-v5-c-login__main-header-utilities">
          <div class="pf-v5-c-select">
            <span id="login-select-label" hidden>Choose one</span>

            <button
              x-ref="button"
              x-on:click="toggle()"
              :aria-expanded="open"
              :aria-controls="$id('language-select')"
              class="pf-v5-c-select__toggle"
              type="button"
              id="login-select-toggle"
              aria-haspopup="true"
              aria-labelledby="login-select-label login-select-toggle"
            >
              <div class="pf-v5-c-select__toggle-wrapper">
                <span class="pf-v5-c-select__toggle-text">${locale.current}</span>
              </div>
              <span class="pf-v5-c-select__toggle-arrow">
                <i class="fas fa-caret-down" aria-hidden="true"></i>
              </span>
            </button>
            <ul
              class="pf-v5-c-select__menu"
              :id="$id('language-select')"
              x-on:click.outside="close($refs.button)"
              role="listbox"
              aria-labelledby="login-select-label"
              x-transition.origin.top.left
              x-ref="panel"
              x-show="open"
              style="display: none;"
            >
                <#list locale.supported as l>
                    <li role="presentation">
                        <button class="pf-v5-c-select__menu-item ${(locale.current == l.label)?then('pf-m-selected', '')}"
                          aria-selected="${(locale.current == l.label)?string}"
                          role="option" onclick="window.location = '${l.url}'">
                          ${l.label}
                          <#if locale.current == l.label>
                            <span class="pf-v5-c-select__menu-item-icon">
                              <i class="fas fa-check" aria-hidden="true"></i>
                            </span>
                          </#if>
                        </button>
                    </li>
                </#list>
            </ul>
          </div>
        </div>
        </#if>
      </header>
      <div class="pf-v5-c-login__main-body">
        <#if displayRequiredFields>
            <div class="${properties.kcContentWrapperClass!}">
                <div class="${properties.kcLabelWrapperClass!} subtitle">
                    <span class="pf-v5-c-helper-text__item-text"><span class="pf-v5-c-form__label-required">*</span> ${msg("requiredFields")}</span>
                </div>
            </div>
        </#if>

        <#nested "form">

        <#if auth?has_content && auth.showTryAnotherWayLink()>
          <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post">
              <div class="${properties.kcFormGroupClass!}">
                  <input type="hidden" name="tryAnotherWay" value="on"/>
                  <a href="#" id="try-another-way"
                      onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
              </div>
          </form>
        </#if>

        <#if displayInfo>
          <div id="kc-info" class="${properties.kcSignUpClass!}">
              <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                  <#nested "info">
              </div>
          </div>
        </#if>
      </div>
      <div class="pf-v5-c-login__main-footer">
        <#nested "socialProviders">
        <#nested "footer">
      </div>
      <footer class="footer">
          <div id="footer-links">
          </div>
          <div id="copywrite">
              <span>
                ©${.now?string('yyyy')} Massachusetts Institute of Technology, All Rights Reserved.
                <a href="#">${msg("registerTermsOfService")}</a> ${msg("and")}
                <a href="#">${msg("registerPrivacyPolicy")}</a>
              </span>
          </div>
      </footer>
    </main>
  </div>
</div>
</body>
</html>
</#macro>
