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
            <a href="${(olSettings.homeUrl)!"#"}" class="logo-link pf-v5-u-display-flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="103" height="29" viewBox="0 0 103 29" fill="none" role="img" title="MIT Learn">
                <path d="M27.2647 28.7212H33.3235V9.57372H27.2647V28.7212ZM36.3529 6.38248H51.5V0H36.3529V6.38248ZM27.2647 0H33.3235V6.38248H27.2647V0ZM18.1765 28.7212H24.2353V0H18.1765V28.7212ZM9.08824 22.3387H15.1471V0H9.08824V22.3387ZM0 28.7212H6.05882V0H0V28.7212ZM36.3529 28.7212H42.4118V9.57372H36.3529V28.7212Z" fill="black"/>
                <path d="M58.1536 14.518H60.8408V25.572H67.0675V27.8238H58.1536V14.518Z" fill="black"/>
                <path d="M67.6603 23.0412C67.6603 20.2125 69.5691 18.0166 72.3489 18.0166C75.4066 18.0166 77.0374 20.3614 77.0374 23.767H70.1435C70.3289 25.2371 71.1442 26.149 72.5712 26.149C73.5534 26.149 74.1279 25.7024 74.4059 24.9765H76.8892C76.5371 26.67 75.036 28.103 72.5898 28.103C69.4394 28.103 67.6603 25.8884 67.6603 23.0412ZM70.1806 22.0177H74.406C74.3318 20.808 73.5349 19.9706 72.386 19.9706C71.0516 19.9706 70.403 20.7708 70.1806 22.0177Z" fill="black"/>
                <path d="M83.894 26.7631H83.8569C83.3751 27.4889 82.6894 28.0472 81.0586 28.0472C79.1127 28.0472 77.7414 27.0236 77.7414 25.1255C77.7414 23.0225 79.4464 22.3526 81.559 22.0549C83.1342 21.8316 83.857 21.7013 83.857 20.9755C83.857 20.287 83.3195 19.8403 82.2632 19.8403C81.0772 19.8403 80.5027 20.2683 80.4286 21.1802H78.1861C78.2603 19.5053 79.5019 18.0352 82.2817 18.0352C85.1356 18.0352 86.2847 19.3193 86.2847 21.5524V26.4095C86.2847 27.1352 86.3959 27.5633 86.6183 27.7308V27.8239H84.1906C84.0423 27.6378 83.9496 27.1911 83.894 26.7631ZM83.9125 24.4555V23.0225C83.4678 23.2831 82.7821 23.432 82.152 23.5808C80.8362 23.8786 80.1876 24.1764 80.1876 25.0696C80.1876 25.9629 80.7806 26.2792 81.6701 26.2792C83.1157 26.2792 83.9125 25.386 83.9125 24.4555Z" fill="black"/>
                <path d="M90.3058 19.8031H90.3614C90.9359 18.7237 91.5845 18.1654 92.6964 18.1654C92.9744 18.1654 93.1411 18.1841 93.2895 18.2399V20.4545H93.2339C91.5845 20.287 90.3984 21.1616 90.3984 23.1715V27.8239H87.8781V18.2771H90.3058L90.3058 19.8031Z" fill="black"/>
                <path d="M96.8474 19.5798H96.903C97.5516 18.5563 98.4226 18.0166 99.7198 18.0166C101.684 18.0166 103 19.5053 103 21.5897V27.8239H100.48V21.9619C100.48 20.9384 99.8867 20.2126 98.8303 20.2126C97.7184 20.2126 96.903 21.1059 96.903 22.4085V27.824H94.3827V18.2771H96.8474L96.8474 19.5798Z" fill="black"/>
              </svg>
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
                <a href="${olSettings.privacyPolicyUrl}">${msg("registerPrivacyPolicy")}</a>
              </span>
          </div>
      </footer>
    </main>
  </div>
</div>
</body>
</html>
</#macro>
