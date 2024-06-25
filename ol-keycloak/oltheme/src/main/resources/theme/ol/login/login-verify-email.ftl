<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=false; section>
    <#if section = "header">
        ${msg("emailVerifyTitle")}
    <#elseif section = "form">
        <p class="instruction">
          ${msg("emailVerifyInstruction1")}
        </p>
    <#elseif section = "info">
        <p class="pf-v5-u-my-md">${msg("emailVerifyInstruction2")}</p>
        <hr />
        <p class="pf-v5-u-my-md">${msg("emailVerifyInstruction3")}</p>
        <p class="pf-v5-u-my-md">
            <b>${msg("emailVerifyInstruction4Bold")}</b>
            ${msg("emailVerifyInstruction4")}
            <a href="#">${msg("emailVerifySupportLinkTitle")}</a>.
        </p>
    </#if>
</@layout.registrationLayout>
