package edu.mit.ol.keycloak.providers;

import org.keycloak.authentication.RequiredActionContext;
import org.keycloak.authentication.RequiredActionProvider;
import org.keycloak.authentication.RequiredActionFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.email.EmailException;
import org.keycloak.email.EmailTemplateProvider;
import org.keycloak.common.util.RandomString;
import org.jboss.logging.Logger;

import jakarta.ws.rs.core.Response;
import java.util.Objects;

public class CustomVerifyEmailRequiredAction implements RequiredActionProvider {

    private static final Logger logger = Logger.getLogger(CustomVerifyEmailRequiredAction.class);
    public static final String PROVIDER_ID = "CUSTOM_VERIFY_EMAIL";

    @Override
    public void evaluateTriggers(RequiredActionContext context) {
        if (!context.getUser().isEmailVerified()) {
            context.getUser().addRequiredAction(PROVIDER_ID);
        }
    }

    @Override
    public void requiredActionChallenge(RequiredActionContext context) {
        // Check if we need to resend code
        String resend = context.getHttpRequest().getDecodedFormParameters().getFirst("resend");
        if ("true".equals(resend)) {
            sendVerificationCode(context);
        } else if (context.getUser().getFirstAttribute("email_verification_code") == null) {
            // First time - send code
            sendVerificationCode(context);
        }

        Response challenge = context.form()
                .setAttribute("user", context.getUser())
                .createForm("verify-email.ftl");
        context.challenge(challenge);
    }

    @Override
    public void processAction(RequiredActionContext context) {
        String code = context.getHttpRequest().getDecodedFormParameters().getFirst("email_code");
        String resend = context.getHttpRequest().getDecodedFormParameters().getFirst("resend");

        if ("true".equals(resend)) {
            sendVerificationCode(context);
            requiredActionChallenge(context);
            return;
        }

        if (code != null && isValidVerificationCode(context, code)) {
            context.getUser().setEmailVerified(true);
            context.getUser().removeAttribute("email_verification_code");
            context.getUser().removeAttribute("email_code_timestamp");
            context.success();
        } else {
            Response challenge = context.form()
                    .setError("Invalid verification code. Please check your email and try again.")
                    .setAttribute("user", context.getUser())
                    .createForm("verify-email.ftl");
            context.challenge(challenge);
        }
    }

    private void sendVerificationCode(RequiredActionContext context) {
        String code = RandomString.randomCode(6);
        long timestamp = System.currentTimeMillis();

        context.getUser().setSingleAttribute("email_verification_code", code);
        context.getUser().setSingleAttribute("email_code_timestamp", String.valueOf(timestamp));

        try {
            EmailTemplateProvider emailProvider = context.getSession().getProvider(EmailTemplateProvider.class);
            emailProvider.setRealm(context.getRealm())
                         .setUser(context.getUser())
                         .setAttribute("code", code)
                         .send("emailVerificationSubject", "email-verification.ftl");
        } catch (EmailException e) {
            logger.error("Failed to send verification email", e);
        }
    }

    private boolean isValidVerificationCode(RequiredActionContext context, String code) {
        String storedCode = context.getUser().getFirstAttribute("email_verification_code");
        String timestampStr = context.getUser().getFirstAttribute("email_code_timestamp");

        if (storedCode == null || timestampStr == null) {
            return false;
        }

        // Check if code is expired (15 minutes)
        try {
            long timestamp = Long.parseLong(timestampStr);
            long now = System.currentTimeMillis();
            if (now - timestamp > 15 * 60 * 1000) {
                context.getUser().removeAttribute("email_verification_code");
                context.getUser().removeAttribute("email_code_timestamp");
                return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }

        return Objects.equals(code, storedCode);
    }

    @Override
    public void close() {}

    public static class Factory implements RequiredActionFactory {

        @Override
        public RequiredActionProvider create(KeycloakSession session) {
            return new CustomVerifyEmailRequiredAction();
        }

        @Override
        public String getDisplayText() {
            return "Custom Email Verification with Code";
        }

        @Override
        public String getId() {
            return PROVIDER_ID;
        }
    }
}
