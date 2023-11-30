<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<html class="${properties.kcHtmlClass!}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle")}</title>
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
</head>

<body class="${properties.kcBodyClass!}">
<div class="${properties.kcLoginClass!}">
    <div id="kc-header" class="${properties.kcHeaderClass!}">
        <#if auth?has_content && auth.showUsername()>
            <a id="reset-login" href="${url.loginRestartFlowUrl}" aria-label="${msg("restartLoginTooltip")}">
                <div class="kc-login-tooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <g clip-path="url(#clip0_17_237)">
                        <path d="M15.8125 20.625L6.1875 11L15.8125 1.375" stroke="#03152D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_17_237">
                          <rect width="22" height="22" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                </div>
            </a>
        </#if>
        <div id="kc-header-wrapper"
             class="${properties.kcHeaderWrapperClass!}">
            <a href="https://mit.edu" class="logo-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="44" viewBox="0 0 150 44" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M54.2792 13.4738H59.6082L61.5561 20.5206C61.6307 20.7758 61.7164 21.1098 61.8137 21.5224C61.9105 21.9353 62.0115 22.3367 62.116 22.7265C62.2354 23.1922 62.3545 23.6802 62.4743 24.1901H62.5191C62.6232 23.6802 62.7353 23.1922 62.8547 22.7265C62.9443 22.3367 63.0415 21.9353 63.146 21.5224C63.2501 21.1098 63.3397 20.7758 63.4147 20.5206L65.3851 13.4738H70.7589V29.5709H67.1316V21.4662V20.6896C67.1316 20.3367 67.1389 19.9803 67.1538 19.6201C67.1687 19.1999 67.1837 18.7419 67.1986 18.2466H67.1538C67.0344 18.7119 66.9299 19.1398 66.8403 19.5301C66.7657 19.8753 66.6872 20.2089 66.6053 20.5318C66.523 20.8547 66.4599 21.091 66.4151 21.2411L64.1086 29.5709H60.8395L58.5557 21.2634C58.5109 21.1137 58.4439 20.8735 58.3543 20.543C58.2648 20.2132 58.1825 19.8753 58.1079 19.5301C58.0187 19.1398 57.9211 18.7119 57.817 18.2466H57.7722C57.7722 18.7419 57.7795 19.1999 57.7944 19.6201C57.8093 19.9803 57.8204 20.3405 57.8281 20.7007C57.8353 21.061 57.8391 21.3234 57.8391 21.4885V29.5709H54.2792V13.4738Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M72.9753 29.5708H76.9384V13.4737H72.9753V29.5708Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M83.0732 16.8507H78.4163V13.4738H91.7392V16.8507H87.0367V29.5709H83.0732V16.8507Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M103.964 26.7116C104.606 26.7116 105.169 26.5803 105.655 26.3179C106.14 26.055 106.547 25.6948 106.875 25.2368C107.204 24.7793 107.446 24.2351 107.603 23.6047C107.76 22.9744 107.838 22.2917 107.838 21.5562C107.838 20.8208 107.76 20.1377 107.603 19.5073C107.446 18.877 107.204 18.3293 106.875 17.8641C106.547 17.3988 106.14 17.0347 105.655 16.7719C105.169 16.5098 104.606 16.3782 103.964 16.3782C103.322 16.3782 102.759 16.5098 102.274 16.7719C101.788 17.0347 101.382 17.3988 101.054 17.8641C100.725 18.3293 100.479 18.877 100.315 19.5073C100.15 20.1377 100.068 20.8208 100.068 21.5562C100.068 22.2917 100.15 22.9744 100.315 23.6047C100.479 24.2351 100.725 24.7793 101.054 25.2368C101.382 25.6948 101.788 26.055 102.274 26.3179C102.759 26.5803 103.322 26.7116 103.964 26.7116ZM103.942 29.9535C102.732 29.9535 101.639 29.743 100.661 29.3231C99.6836 28.9032 98.8552 28.3179 98.1762 27.5671C97.4968 26.8166 96.9706 25.9276 96.5977 24.8993C96.2243 23.8714 96.0378 22.7569 96.0378 21.5562C96.0378 20.3555 96.2243 19.241 96.5977 18.2131C96.9706 17.1852 97.4968 16.2958 98.1762 15.545C98.8552 14.795 99.6836 14.2096 100.661 13.789C101.639 13.3691 102.732 13.1586 103.942 13.1586C105.151 13.1586 106.244 13.3691 107.222 13.789C108.199 14.2096 109.032 14.795 109.718 15.545C110.405 16.2958 110.935 17.1852 111.309 18.2131C111.681 19.241 111.868 20.3555 111.868 21.5562C111.868 22.7569 111.681 23.8714 111.309 24.8993C110.935 25.9276 110.405 26.8166 109.718 27.5671C109.032 28.3179 108.199 28.9032 107.222 29.3231C106.244 29.743 105.151 29.9535 103.942 29.9535Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M119.19 27.0943C119.891 27.0943 120.44 26.8169 120.836 26.2612C121.231 25.7062 121.429 24.9331 121.429 23.9425C121.429 22.9519 121.242 22.1564 120.869 21.5561C120.496 20.9561 119.914 20.6556 119.123 20.6556C118.72 20.6556 118.369 20.7383 118.07 20.9034C117.772 21.0685 117.522 21.2975 117.32 21.5899C117.119 21.8828 116.969 22.2315 116.872 22.6367C116.775 23.042 116.727 23.4776 116.727 23.9425C116.727 24.888 116.94 25.65 117.365 26.2277C117.791 26.8057 118.399 27.0943 119.19 27.0943ZM113.189 18.044H116.682V19.4398H116.749C117.138 18.9149 117.615 18.4943 118.182 18.1791C118.75 17.8639 119.429 17.7061 120.22 17.7061C120.981 17.7061 121.664 17.8604 122.269 18.1679C122.874 18.4754 123.389 18.9034 123.814 19.451C124.239 19.999 124.564 20.6444 124.788 21.3871C125.012 22.1303 125.124 22.9373 125.124 23.8074C125.124 24.738 125.004 25.5823 124.765 26.3404C124.526 27.0982 124.187 27.7436 123.746 28.2762C123.306 28.8092 122.78 29.2183 122.168 29.5034C121.556 29.7882 120.877 29.931 120.13 29.931C119.384 29.931 118.746 29.7921 118.216 29.5146C117.686 29.2367 117.242 28.8581 116.884 28.3774H116.839V33.3757H113.189V18.044Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M133.968 22.5693C133.893 21.8792 133.662 21.3308 133.274 20.9256C132.886 20.5204 132.393 20.3179 131.796 20.3179C131.094 20.3179 130.557 20.5204 130.184 20.9256C129.811 21.3308 129.564 21.8792 129.445 22.5693H133.968ZM131.952 29.9085C131.012 29.9085 130.162 29.7542 129.4 29.4471C128.639 29.1396 127.997 28.7117 127.474 28.1637C126.952 27.6161 126.549 26.9668 126.266 26.2164C125.982 25.4659 125.84 24.6555 125.84 23.785C125.84 22.9295 125.982 22.1301 126.266 21.3874C126.549 20.6443 126.952 19.9993 127.474 19.4509C127.997 18.9036 128.617 18.4757 129.333 18.1678C130.049 17.8603 130.848 17.7064 131.729 17.7064C132.549 17.7064 133.285 17.8342 133.934 18.0889C134.584 18.3445 135.155 18.697 135.647 19.1472C136.334 19.7776 136.845 20.5769 137.181 21.5448C137.516 22.5131 137.677 23.5822 137.662 24.7528H129.422C129.542 25.5337 129.811 26.1487 130.229 26.5989C130.646 27.0496 131.236 27.2747 131.998 27.2747C132.475 27.2747 132.871 27.1731 133.184 26.9707C133.498 26.7679 133.736 26.4865 133.901 26.1263H137.461C137.341 26.6516 137.117 27.1508 136.789 27.6234C136.461 28.0963 136.042 28.5054 135.535 28.8502C135.057 29.1958 134.524 29.4583 133.934 29.6384C133.344 29.8185 132.684 29.9085 131.952 29.9085Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M138.894 18.044H142.409V19.6199H142.476C142.909 18.9896 143.406 18.5135 143.965 18.1902C144.525 17.8677 145.208 17.7065 146.014 17.7065C146.641 17.7065 147.201 17.8154 147.694 18.0328C148.186 18.2506 148.604 18.5504 148.947 18.9334C149.29 19.3159 149.552 19.7742 149.731 20.3065C149.91 20.8395 150 21.4287 150 22.074V29.5707H146.35V22.8168C146.35 22.2014 146.201 21.7065 145.902 21.3309C145.603 20.9561 145.155 20.7683 144.559 20.7683C143.946 20.7683 143.458 20.9934 143.092 21.4433C142.726 21.8935 142.544 22.4789 142.544 23.1993V29.5707H138.894V18.044Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4341 3.2877C11.4182 3.2877 3.26984 11.4806 3.26984 21.5511C3.26984 31.6216 11.4182 39.8145 21.4341 39.8145C31.4499 39.8145 39.5991 31.6216 39.5991 21.5511C39.5991 11.4806 31.4499 3.2877 21.4341 3.2877ZM21.4341 43.1022C9.6151 43.1022 0 33.4342 0 21.5511C0 9.66757 9.6151 0 21.4341 0C33.2531 0 42.8682 9.66757 42.8682 21.5511C42.8682 33.4342 33.2531 43.1022 21.4341 43.1022Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2058 29.6327H17.6506V13.4694H14.2058V29.6327Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M25.2172 29.6327H28.6619V13.4694H25.2172V29.6327Z" fill="#03152D"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6853 24.4374H23.1301V13.4694H19.6853V24.4374Z" fill="#03152D"/>
                </svg>
            </a>
        </div>
    </div>
    <div class="${properties.kcFormCardClass!}">
        <header class="${properties.kcFormHeaderClass!}">
            <#if realm.internationalizationEnabled  && locale.supported?size gt 1>
                <div class="${properties.kcLocaleMainClass!}" id="kc-locale">
                    <div id="kc-locale-wrapper" class="${properties.kcLocaleWrapperClass!}">
                        <div id="kc-locale-dropdown" class="${properties.kcLocaleDropDownClass!}">
                            <a href="#" id="kc-current-locale-link">${locale.current}</a>
                            <ul class="${properties.kcLocaleListClass!}">
                                <#list locale.supported as l>
                                    <li class="${properties.kcLocaleListItemClass!}">
                                        <a class="${properties.kcLocaleItemClass!}" href="${l.url}">${l.label}</a>
                                    </li>
                                </#list>
                            </ul>
                        </div>
                    </div>
                </div>
            </#if>
        <#if !(auth?has_content && auth.showUsername() && !auth.showResetCredentials())>
            <#if displayRequiredFields>
                <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                        <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                    </div>
                    <div class="col-md-10">
                        <h1 id="kc-page-title"><#nested "header"></h1>
                    </div>
                </div>
            <#else>
                <h1 id="kc-page-title"><#nested "header"></h1>
            </#if>
        <#else>
            <#if displayRequiredFields>
                <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                        <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                    </div>
                    <div class="col-md-10">
                        <#nested "show-username">
                        <div id="kc-username" class="${properties.kcFormGroupClass!}">
                            <#if firstName??>
                                <span id="kc-attempted-username">${msg("loginGreeting")} ${firstName}!</span>
                            </#if>
                        </div>
                    </div>
                </div>
            <#else>
                <#nested "show-username">
                <div id="kc-username" class="${properties.kcFormGroupClass!}">
                    <#if firstName??>
                        <label id="kc-attempted-username">${msg("loginGreeting")} ${firstName}!</label>
                    </#if>
                </div>
            </#if>
        </#if>
      </header>
      <div id="kc-content">
        <div id="kc-content-wrapper">

          <#-- App-initiated actions should not see warning messages about the need to complete the action -->
          <#-- during login.                                                                               -->
          <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
              <div class="alert-${message.type} ${properties.kcAlertClass!} pf-m-<#if message.type = 'error'>danger<#else>${message.type}</#if>">
                  <div class="pf-c-alert__icon">
                      <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                      <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                      <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                      <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                  </div>
                      <span class="${properties.kcAlertTitleClass!}">${kcSanitize(message.summary)?no_esc}</span>
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

          <#nested "socialProviders">
            <#if allProviders??>
                <div id="kc-social-providers" class="${properties.kcFormSocialAccountSectionClass!}">
                    <h4>${msg("identity-provider-redirector")}</h4>

                    <ul class="${properties.kcFormSocialAccountListClass!} <#if allProviders?size gt 3>${properties.kcFormSocialAccountListGridClass!}</#if>">
                        <#list allProviders as p>
                            <li>
                                <a id="social-${p.alias}" class="${properties.kcFormSocialAccountListButtonClass!} <#if allProviders?size gt 3>${properties.kcFormSocialAccountGridItem!}</#if>"
                                        type="button" href="${p.loginUrl}">
                                    <#if p.iconClasses?has_content>
                                        <i class="${properties.kcCommonLogoIdP!} ${p.iconClasses!}" aria-hidden="true"></i>
                                        <span class="${properties.kcFormSocialAccountNameClass!} kc-social-icon-text">${p.displayName!}</span>
                                    <#else>
                                        <span class="${properties.kcFormSocialAccountNameClass!}">${p.displayName!}</span>
                                    </#if>
                                </a>
                            </li>
                        </#list>
                    </ul>
                </div>
            </#if>

          <#if displayInfo>
              <div id="kc-info" class="${properties.kcSignUpClass!}">
                  <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                      <#nested "info">
                  </div>
              </div>
          </#if>
        </div>
      </div>

    </div>
  </div>
</body>
<footer class="footer">
    <div id="footer-links">
        <a href="google.com">Accessibility</a>
        <a href="google.com">Terms of service</a>
        <a href="google.com">Privacy Policy</a>
    </div>
    <div id="copywrite">
        <span>© 2023 Massachusetts Institute of Technology</span>
    </div>
</footer>
</html>
</#macro>
