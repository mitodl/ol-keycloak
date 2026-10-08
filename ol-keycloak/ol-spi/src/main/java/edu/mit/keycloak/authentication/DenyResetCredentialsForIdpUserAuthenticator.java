package edu.mit.keycloak.authentication;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import jakarta.ws.rs.core.Response;

/**
 * Runs in the realm's Reset Credentials flow, after the user has been resolved.
 * Blocks the flow for a user with a live identity provider link, so an
 * IdP-linked account can never set or reset a local password through the
 * forgot-password form.
 */
public class DenyResetCredentialsForIdpUserAuthenticator implements Authenticator {

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        UserModel user = context.getUser();
        if (user == null) {
            // Choose User could not resolve an account (or hides whether one exists,
            // to avoid enumeration). Nothing to check here either way.
            context.success();
            return;
        }

        FederatedIdentityModel federatedIdentity = context.getSession().users()
                .getFederatedIdentitiesStream(context.getRealm(), user)
                .findFirst()
                .orElse(null);

        if (federatedIdentity == null) {
            context.success();
            return;
        }

        Response challenge = context.form()
                .setError(
                        "This account signs in through " + federatedIdentity.getIdentityProvider()
                        + ". Please use that sign-in method instead of resetting a password here.")
                .createErrorPage(Response.Status.BAD_REQUEST);
        context.failureChallenge(AuthenticationFlowError.ACCESS_DENIED, challenge);
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        authenticate(context);
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
        // No-op: this authenticator only gates the flow, it does not attach actions.
    }

    @Override
    public void close() {
        // No resources to close.
    }
}
