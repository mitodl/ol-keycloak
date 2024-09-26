<#import "template.ftl" as layout>
<#import "register-commons.ftl" as registerCommons>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('fullName','email','username','password','password-confirm','termsAccepted'); section>
    <#if section = "header">
        ${msg("registerTitle")}
    <#elseif section = "form">
        <p class="instruction pf-v5-u-pb-md">${msg("registerInstruction")}</p>
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="fullName" class="${properties.kcLabelClass!}">${msg("fullName")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="fullName" class="${properties.kcInputClass!}" name="fullName"
                           value="${(register.formData.fullName!'')}"
                           aria-invalid="<#if messagesPerField.existsError('fullName')>true</#if>"
                    />

                    <#if messagesPerField.existsError('fullName')>
                        <span id="input-error-firstname" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('fullName'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="email" class="${properties.kcLabelClass!}">${msg("email")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="email" class="${properties.kcInputClass!}" name="email"
                           value="${(register.formData.email!'')}" autocomplete="email"
                           aria-invalid="<#if messagesPerField.existsError('email')>true</#if>"
                    />

                    <#if messagesPerField.existsError('email')>
                        <span id="input-error-email" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('email'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <#if !realm.registrationEmailAsUsername>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="username" class="${properties.kcLabelClass!}">${msg("username")}</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <input type="text" id="username" class="${properties.kcInputClass!}" name="username"
                               value="${(register.formData.username!'')}" autocomplete="username"
                               aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
                        />

                        <#if messagesPerField.existsError('username')>
                            <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                ${kcSanitize(messagesPerField.get('username'))?no_esc}
                            </span>
                        </#if>
                    </div>
                </div>
            </#if>

            <#if passwordRequired??>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <div class="${properties.kcInputGroup!} password-toggle-field">
                            <input type="password" id="password" class="${properties.kcInputClass!}" name="password"
                                   autocomplete="new-password"
                                   aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                            />
                            <div class="toggle-password-button">
                                <button class="${properties.kcFormPasswordVisibilityButtonClass!}" type="button" aria-label="${msg('showPassword')}"
                                    aria-controls="password"  data-password-toggle
                                    data-icon-show="${properties.kcFormPasswordVisibilityIconShow!}" data-icon-hide="${properties.kcFormPasswordVisibilityIconHide!}"
                                    data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}">
                                    <i class="${properties.kcFormPasswordVisibilityIconShow!}" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>


                        <#if messagesPerField.existsError('password')>
                            <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                ${kcSanitize(messagesPerField.get('password'))?no_esc}
                            </span>
                        </#if>
                    </div>
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="password-confirm"
                               class="${properties.kcLabelClass!}">${msg("passwordConfirm")}</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <div class="${properties.kcInputGroup!} password-toggle-field">
                            <input type="password" id="password-confirm" class="${properties.kcInputClass!}"
                                   name="password-confirm"
                                   aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                            />
                            <div class="toggle-password-button">
                                <button class="${properties.kcFormPasswordVisibilityButtonClass!}" type="button" aria-label="${msg('showPassword')}"
                                    aria-controls="password-confirm"  data-password-toggle
                                    data-icon-show="${properties.kcFormPasswordVisibilityIconShow!}" data-icon-hide="${properties.kcFormPasswordVisibilityIconHide!}"
                                    data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}">
                                    <i class="${properties.kcFormPasswordVisibilityIconShow!}" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        <#if messagesPerField.existsError('password-confirm')>
                            <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                            </span>
                        </#if>
                    </div>
                </div>
            </#if>

            <@registerCommons.termsAcceptance/>

            <#if recaptchaRequired??>
                <div class="form-group">
                    <div class="${properties.kcInputWrapperClass!}">
                        <div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}" data-theme="light"></div>
                    </div>
                </div>
            </#if>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegisterSubmit")}"/>
                </div>
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <span>${msg('alreadyHaveAnAccountRegister')} <a href="${url.loginUrl}">${kcSanitize(msg("logInRegister"))?no_esc}</a></span>
                    </div>
                </div>
            </div>
        </form>
        <script type="module" src="${url.resourcesPath}/js/passwordVisibility.js"></script>
        <script type="text/javascript">
        function resizeRecaptcha() {
            var recaptcha = document.querySelector(".g-recaptcha");
            var parent = recaptcha.parentElement;
            var newScaleFactor = parent.offsetWidth / 302;
            recaptcha.style.transform = 'scale(' + newScaleFactor + ')';
            recaptcha.style.transformOrigin = '0 0';
            // transforms don't contribute to flow so we need to manually resize the parent to match
            parent.style.height = (newScaleFactor * 76) + "px";
        }

        window.addEventListener("resize", resizeRecaptcha);
        window.addEventListener("load", resizeRecaptcha);
        </script>
    </#if>
    <#if section = "socialProviders" >
      <div class="separator pf-v5-u-py-md">
        <span class="pf-v5-u-px-md">or</span>
      </div>
      <#include "social-providers.ftl">
    </#if>
    <#if section = "footer">
        <div class="${properties.kcFormGroupClass!}">
            <div id="kc-form-legal-options" class="${properties.kcFormOptionsClass!}">
                <div class="${properties.kcFormOptionsWrapperClass!}">
      <span class="pf-v5-u-font-size-xs">${msg('registerLegalAgreementText')} <a href="${olSettings.privacyPolicyUrl!"#"}" class="pf-v5-u-font-size-xs">${kcSanitize(msg("registerPrivacyPolicy"))?no_esc}</a>.</span>
                </div>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>
