package edu.mit.keycloak.authentication;

import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.authentication.ConfigurableAuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.Config; // Correct import for Config.Scope

import java.util.Collections;
import java.util.List;

public class HasCredentialAuthenticatorFactory implements AuthenticatorFactory, ConfigurableAuthenticatorFactory {

    public static final String PROVIDER_ID = "has-credential-authenticator";

    private static final Authenticator SINGLETON = new HasCredentialAuthenticator();

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "Has Credential Check";
    }

    @Override
    public String getHelpText() {
        return "Checks if the user account has any form of credential (password, federated identity, or linked user federation). Fails if no credential is found.";
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
        return Collections.emptyList(); // No configurable properties for this authenticator
    }

    @Override
    public boolean isConfigurable() {
        return false; // No configuration needed
    }

    @Override
    public String getReferenceCategory() {
        return "condition"; // Or "flow" depending on how you want it categorized
    }

    @Override
    public void init(Config.Scope config) {
        // Not needed for this simple authenticator
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // Not needed for this simple authenticator
    }

    @Override
    public void close() {
        // No resources to close
    }

    @Override
    public boolean isUserSetupAllowed() {
        // This authenticator is for checking existing credentials, not for initial user setup.
        return false;
    }
}
