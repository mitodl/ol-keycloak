package edu.mit.keycloak.authentication;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.IdentityProviderModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.services.messages.Messages;

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

        // getFederatedIdentitiesStream can return rows for an identity provider
        // that has since been removed from the realm (Keycloak does not clean
        // these up when an IdP is deleted). Only block on a link whose provider
        // still exists and is enabled, so a stale row can't permanently lock a
        // user out of password recovery.
        FederatedIdentityModel federatedIdentity = context.getSession().users()
                .getFederatedIdentitiesStream(context.getRealm(), user)
                .filter(identity -> {
                    IdentityProviderModel idp = context.getSession().identityProviders()
                            .getByAlias(identity.getIdentityProvider());
                    return idp != null && idp.isEnabled();
                })
                .findFirst()
                .orElse(null);

        if (federatedIdentity == null) {
            context.success();
            return;
        }

        // Respond exactly like ResetCredentialEmail's "don't reveal account state"
        // branch: a generic EMAIL_SENT page via forkWithSuccessMessage, with no
        // email actually sent. An IdP-linked-specific response here would both let
        // an unauthenticated caller probe whether an email is IdP-linked, and
        // (via failureChallenge) count as a failed login against the real account
        // under the realm's brute-force protection.
        context.forkWithSuccessMessage(new FormMessage(Messages.EMAIL_SENT));
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
