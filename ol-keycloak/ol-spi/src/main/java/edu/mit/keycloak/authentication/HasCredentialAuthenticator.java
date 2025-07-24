package edu.mit.keycloak.authentication;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.Authenticator;
import org.keycloak.forms.login.MessageType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.PasswordCredentialModel;

public class HasCredentialAuthenticator implements Authenticator {

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        UserModel user = context.getUser();
        if (user == null) {
            // This authenticator typically runs after a username/email has been provided
            // If user is null, it.means no user context yet, which might be an error or
            // an unexpected flow state for this specific authenticator's purpose.
            // For this specific use case, we assume a user is already identified.
            context.failure(AuthenticationFlowError.UNKNOWN_USER);
            return;
        }

        // This checks if a user has a password credential, a federated identity (e.g.,
        // linked social login, SAML, or OAuth provider),
        // or is linked to an external user federation provider (like LDAP).
        boolean hasPassword = user.credentialManager().getStoredCredentialsStream()
                                  .anyMatch(c -> c.getType().equals(PasswordCredentialModel.TYPE));
        // Use getFederatedIdentities() and check if the list is empty
        boolean hasFederatedIdentity = !user.credentialManager().getFederatedCredentialsStream().findAny()
                .isEmpty();
        boolean isFederatedUser = user.isFederated();

        if (hasPassword || hasFederatedIdentity || isFederatedUser) {
            context.success(); // User has at least one form of credential
            return;
        } else {
            // No password, no linked social/SAML/OIDC, and not an LDAP-backed user
            // This user has no known way to authenticate directly.
            // context.failure(AuthenticationFlowError.INVALID_CREDENTIALS);
            // You might want to add a challenge here to display a message to the user,
            // e.g.,
            user.addRequiredAction(UserModel.RequiredAction.UPDATE_PASSWORD);
            context.forceChallenge(context.form()
                    .setMessage(MessageType.INFO,
                            "For security reasons you will need to create a new password for your account.")
                    .createForm("login-reset-password.ftl"));
            // This would require a custom FreeMarker template and message key.
        }
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        // This authenticator doesn't require user interaction, so this method can be
        // empty.
        authenticate(context); // Re-evaluate if action is triggered
    }

    @Override
    public boolean requiresUser() {
        return true; // This authenticator needs a user context to operate
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        // This authenticator is always applicable if a user exists
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
        // This authenticator doesn't set required actions
    }

    @Override // Added or ensured @Override
    public void close() {
        // No resources to close
    }
}
