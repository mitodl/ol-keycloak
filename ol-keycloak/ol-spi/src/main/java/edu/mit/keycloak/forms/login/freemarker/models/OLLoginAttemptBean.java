package edu.mit.keycloak.forms.login.freemarker.models;

import org.keycloak.models.*;
import org.keycloak.models.credential.PasswordCredentialModel;

import java.util.stream.Stream;


public class OLLoginAttemptBean {

    private String userFullname;
    private boolean needsPassword;
    private boolean hasSocialProviderAuth;

    public OLLoginAttemptBean(UserModel user, KeycloakSession session, RealmModel realm) {
        this.userFullname = "";
        this.needsPassword = true;
        this.hasSocialProviderAuth = false;
        if (user != null) {
            if (user.getFirstName() != null && user.getLastName() != null) {
                this.userFullname = user.getFirstName().concat(" ").concat(user.getLastName());
            }

            // Check for password credential
            user.credentialManager().getStoredCredentialsStream().forEach(credential -> {
                if (PasswordCredentialModel.TYPE.equals(credential.getType())) {
                    this.needsPassword = false;
                }
            });

            // Check for linked identity providers
            Stream<FederatedIdentityModel> federatedIdentities =
                    session.users().getFederatedIdentitiesStream(realm, user);
            this.hasSocialProviderAuth = federatedIdentities.findAny().isPresent();
        }
    }

    public String getUserFullname() {
        return userFullname;
    }

    public boolean getNeedsPassword() {
        return needsPassword;
    }

    public boolean getHasSocialProviderAuth() {
        return hasSocialProviderAuth;
    }
}
