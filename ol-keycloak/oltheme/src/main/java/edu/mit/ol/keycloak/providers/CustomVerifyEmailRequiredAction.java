package edu.mit.ol.keycloak.providers;

import org.keycloak.authentication.RequiredActionContext;
import org.keycloak.authentication.RequiredActionProvider;
import org.keycloak.authentication.RequiredActionFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.email.EmailException;
import org.keycloak.email.EmailTemplateProvider;
import org.jboss.logging.Logger;

import jakarta.ws.rs.core.Response;
import java.util.Objects;
import java.util.HashMap;
import java.util.Map;

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
        // Only send code if one doesn't already exist
        if (context.getUser().getFirstAttribute("email_verification_code") == null) {
            sendVerificationCode(context);
        }

        Response challenge = context.form()
                .setAttribute("user", context.getUser())
                .createForm("verify-email.ftl");
        context.challenge(challenge);
    }

    private enum VerificationCodeStatus {
        VALID, INVALID, EXPIRED
    }

    private VerificationCodeStatus checkVerificationCode(RequiredActionContext context, String code) {
        String storedCode = context.getUser().getFirstAttribute("email_verification_code");
        String timestampStr = context.getUser().getFirstAttribute("email_code_timestamp");

        if (storedCode == null || timestampStr == null) {
            return VerificationCodeStatus.INVALID;
        }

        try {
            long timestamp = Long.parseLong(timestampStr);
            long now = System.currentTimeMillis();
            if (now - timestamp > 15 * 60 * 1000) {
                return VerificationCodeStatus.EXPIRED;
            }
        } catch (NumberFormatException e) {
            return VerificationCodeStatus.INVALID;
        }

        return Objects.equals(code, storedCode) ? VerificationCodeStatus.VALID : VerificationCodeStatus.INVALID;
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

        VerificationCodeStatus status = checkVerificationCode(context, code);

        if (status == VerificationCodeStatus.VALID) {
            context.getUser().setEmailVerified(true);
            context.getUser().removeAttribute("email_verification_code");
            context.getUser().removeAttribute("email_code_timestamp");
            context.success();
        } else if (status == VerificationCodeStatus.EXPIRED) {
            context.getUser().removeAttribute("email_verification_code");
            context.getUser().removeAttribute("email_code_timestamp");
            sendVerificationCode(context);
            Response challenge = context.form()
                    .setError("Your verification code has expired. A new code has been sent to your email.")
                    .setAttribute("user", context.getUser())
                    .createForm("verify-email.ftl");
            context.challenge(challenge);
        } else {
            Response challenge = context.form()
                    .setError("Invalid verification code. Please check your email and try again.")
                    .setAttribute("user", context.getUser())
                    .createForm("verify-email.ftl");
            context.challenge(challenge);
        }
    }

    private void sendVerificationCode(RequiredActionContext context) {
        String code = generateNumericCode(6); // 6-digit numeric code
        long timestamp = System.currentTimeMillis();

        context.getUser().setSingleAttribute("email_verification_code", code);
        context.getUser().setSingleAttribute("email_code_timestamp", String.valueOf(timestamp));

        try {
            EmailTemplateProvider emailProvider = context.getSession().getProvider(EmailTemplateProvider.class);
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("code", code);
            emailProvider.setRealm(context.getRealm())
                         .setUser(context.getUser())
                         .send("emailVerificationSubject", "email-verification.ftl", attributes);
        } catch (EmailException e) {
            logger.error("Failed to send verification email", e);
        }
    }

    private String generateNumericCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    @Override
    public void close() {
    }

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

        @Override
        public void init(org.keycloak.Config.Scope config) {
            // No initialization needed
        }

        @Override
        public void postInit(org.keycloak.models.KeycloakSessionFactory factory) {
            // No post-initialization needed
        }

        @Override
        public void close() {
            // No resources to clean up
        }
    }
}
