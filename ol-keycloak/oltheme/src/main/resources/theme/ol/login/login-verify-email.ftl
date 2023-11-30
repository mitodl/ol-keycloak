<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "header">
        ${msg("emailVerifyTitle")}
    <#elseif section = "form">
        <p class="instruction">${msg("emailVerifyInstruction1",user.email)}</p> 
    <#elseif section = "info">
        <p class="instruction">
            ${msg("emailVerifyInstruction2")}
            <br/>
            <div id="kc-form-buttons" class="form-group">
                <a class="pf-c-button pf-m-primary pf-m-block btn-lg" href="${url.loginAction}">${msg("emailVerifyInstruction3")}</a>
            </div>
        </p>
        <div id="ol-email-verify-instructions">
            <div>
                <span id="email-verify-instruction-red">${msg("emailVerifyInstructionOL1")}</span>
            </div>
            <div>
                <b>${msg("emailVerifyInstructionOL2Bold")}</b> ${msg("emailVerifyInstructionOL2")}
            </div>
            <div>
                <b>${msg("emailVerifyInstructionOL3Bold")}</b> ${msg("emailVerifyInstructionOL3")}
            </div>
            <div>
                <b>${msg("emailVerifyInstructionOL4Bold")}</b> ${msg("emailVerifyInstructionOL4")}
            </div>
            <hr>
            <div>
                <b>${msg("emailVerifyInstructionOL5Bold")}</b> ${msg("emailVerifyInstructionOL5")}
                <br>
                <a href="google.com">${msg("emailVerifySupportLinkTitleOL")}</a>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>
