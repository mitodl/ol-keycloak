package edu.mit.keycloak.forms.login.freemarker.models;

import org.keycloak.models.*;
import org.keycloak.models.credential.PasswordCredentialModel;


public class OLLoginAttemptBean {

    private String userFullname;
    private boolean needsPassword;
    private boolean hasSocialProviderAuth;

    public OLLoginAttemptBean(UserModel user) {
        this.userFullname = "";
        this.needsPassword = true;
        this.hasSocialProviderAuth = false;
        if (user != null) {
            if (user.getFirstName() != null && user.getLastName() != null) {
                this.userFullname = user.getFirstName().concat(" ").concat(user.getLastName());
            }

            user.credentialManager().getStoredCredentialsStream().forEach(credential -> {
                if (credential.getType().equals(PasswordCredentialModel.TYPE)) {
                    this.needsPassword = false;
                } else {
                    this.hasSocialProviderAuth = true;
                }
            });
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
