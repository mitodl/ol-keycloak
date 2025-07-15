<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=false; section>
    <#if section = "header">
        ${msg("emailVerifyTitle")}
    <#elseif section = "form">
        <p class="instruction">
          ${msg("emailVerifyInstruction1", user.email)}
        </p>
        
        <!-- Verification code form -->
        <form id="kc-verify-email-code-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="email_code" class="${properties.kcLabelClass!}">Verification Code</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="email_code" name="email_code" class="${properties.kcInputClass!}" 
                           placeholder="Enter 6-digit code" maxlength="6" autofocus autocomplete="off" 
                           style="text-align: center; font-size: 18px; letter-spacing: 2px;" />
                </div>
            </div>
            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!}" 
                           name="submit" type="submit" value="Verify Email"/>
                </div>
            </div>
        </form>
        
        <!-- Resend code form -->
        <div style="margin-top: 15px; text-align: center;">
            <form action="${url.loginAction}" method="post" style="display: inline;">
                <input type="hidden" name="resend" value="true"/>
                <button type="submit" class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!}">
                    Resend Code
                </button>
            </form>
        </div>
        
    <#elseif section = "info">
        <div id="kc-info" class="${properties.kcSignUpClass!}">
          <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
            <p class="pf-v5-u-my-md">A 6-digit verification code has been sent to your email address.</p>
            <hr />
            <p class="pf-v5-u-my-md">Enter the code from your email to verify your account.</p>
            <p class="pf-v5-u-my-md">
                <b>Code not working?</b>
                ${msg("emailVerifyInstruction4")}
            </p>
            <p class="pf-v5-u-my-md">
                <b>Didn't receive the code?</b>
                Check your spam folder or click "Resend Code" above.
                <a href="#">${msg("emailVerifySupportLinkTitle")}</a>.
            </p>
        </div>
      </div>
    </#if>
</@layout.registrationLayout>