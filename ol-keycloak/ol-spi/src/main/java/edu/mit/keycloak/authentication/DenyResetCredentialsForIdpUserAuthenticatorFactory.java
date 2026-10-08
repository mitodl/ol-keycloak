package edu.mit.keycloak.authentication;

import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.authentication.ConfigurableAuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.Config;

import java.util.Collections;
import java.util.List;

public class DenyResetCredentialsForIdpUserAuthenticatorFactory
        implements AuthenticatorFactory, ConfigurableAuthenticatorFactory {

    public static final String PROVIDER_ID = "deny-reset-credentials-for-idp-user";

    private static final Authenticator SINGLETON = new DenyResetCredentialsForIdpUserAuthenticator();

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "Deny Reset Credentials For IdP-Linked User";
    }

    @Override
    public String getHelpText() {
        return "Blocks the reset-credentials flow for a user with a live identity "
                + "provider link, so an IdP-linked account can never set or reset a "
                + "local password through the forgot-password form.";
    }

    @Override
    public Authenticator create(KeycloakSession session) {
        return SINGLETON;
    }

    @Override
    public AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
        return new AuthenticationExecutionModel.Requirement[] {
                AuthenticationExecutionModel.Requirement.REQUIRED,
                AuthenticationExecutionModel.Requirement.ALTERNATIVE,
                AuthenticationExecutionModel.Requirement.DISABLED
        };
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return Collections.emptyList();
    }

    @Override
    public boolean isConfigurable() {
        return false;
    }

    @Override
    public String getReferenceCategory() {
        return "condition";
    }

    @Override
    public void init(Config.Scope config) {
        // Not needed for this simple authenticator.
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // Not needed for this simple authenticator.
    }

    @Override
    public void close() {
        // No resources to close.
    }

    @Override
    public boolean isUserSetupAllowed() {
        return false;
    }
}
