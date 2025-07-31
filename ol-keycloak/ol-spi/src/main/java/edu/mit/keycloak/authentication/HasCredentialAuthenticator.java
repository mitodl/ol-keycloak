package edu.mit.keycloak.authentication;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.PasswordCredentialModel;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;

public class HasCredentialAuthenticator implements Authenticator {

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        UserModel user = context.getUser();
        if (user == null) {
            // If there is no user, it means there is no account created yet.
            // The user should be prompted to create an account by registering.
            // context.fork();
            // context.challenge(
            //         context.form()
            //                 .setError("invalidUsernameOrEmailMessage")
            //                 .createRegistration());
            context.setForwardedInfoMessage("We do not have an account for that email on record. Please try another email or sign up for free.");
            sendToRegistration(context);
            context.resetFlow();
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
            // Redirect through the reset password flow
            user.addRequiredAction(UserModel.RequiredAction.UPDATE_PASSWORD);
            // context.challenge(context.form()
            //         .setMessage(MessageType.INFO,
            //                 "For security reasons you will need to create a new password for your account.")
            //         .createPasswordReset());
            context.setForwardedInfoMessage("For security reasons you will need to create a new password for your account.");
            sendToPasswordReset(context);
            context.resetFlow();
            return;
        }
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        // This authenticator doesn't require user interaction, so this method can be
        // empty.
        authenticate(context); // Re-evaluate if action is triggered
    }

    /**
     * Builds the URL for the 'reset credentials' flow and issues a redirect.
     */
    private void sendToPasswordReset(AuthenticationFlowContext context) {
        UriBuilder uriBuilder = UriBuilder
                .fromUri(context.getUriInfo().getBaseUri())
                .path("/realms/" + context.getRealm().getName() + "/login-actions/reset-credentials");

        // Pass along necessary client and tab IDs
        uriBuilder.queryParam("client_id", context.getAuthenticationSession().getClient().getClientId());
        uriBuilder.queryParam("tab_id", context.getAuthenticationSession().getTabId());

        Response redirect = Response.seeOther(uriBuilder.build()).build();
        // Use forceChallenge to immediately stop this flow and send the redirect
        context.forceChallenge(redirect);
    }

    /**
     * Builds the URL for the registration flow and issues a redirect.
     */
    private void sendToRegistration(AuthenticationFlowContext context) {
        UriBuilder uriBuilder = UriBuilder
                .fromUri(context.getUriInfo().getBaseUri())
            .path("/realms/" + context.getRealm().getName() + "/login-actions/registration");

        // Pass along necessary client and tab IDs
        uriBuilder.queryParam("client_id", context.getAuthenticationSession().getClient().getClientId());
        uriBuilder.queryParam("tab_id", context.getAuthenticationSession().getTabId());
        // You may need other parameters like response_type depending on your client
        // config
        uriBuilder.queryParam("response_type", "code");
        uriBuilder.queryParam("scope", context.getAuthenticationSession().getClientScopes().toString());

        Response redirect = Response.seeOther(uriBuilder.build()).build();

        // Use forceChallenge to immediately stop this flow and send the redirect
        context.forceChallenge(redirect);
    }

    @Override
    public boolean requiresUser() {
        return false; // This authenticator needs a user context to operate
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

    @Override
    public void close() {
        // No resources to close
    }
}
