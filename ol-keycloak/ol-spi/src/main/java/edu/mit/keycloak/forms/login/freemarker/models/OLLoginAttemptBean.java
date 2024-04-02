package edu.mit.keycloak.forms.login.freemarker.models;

import org.keycloak.models.*;
import org.keycloak.credential.CredentialModel;

import java.util.stream.Stream;


public class OLLoginAttemptBean {

    private UserModel user;

    public OLLoginAttemptBean(UserModel user) {
        this.user = user;
    }

    public String getUserFullname() {
        if (user != null &&
            user.getFirstName() != null &&
            user.getLastName() != null
        ) {
            user.getFirstName().concat(" ").concat(user.getLastName());
        }
        return "";
    }

    public boolean hasCredentials() {
        Stream<CredentialModel> credentials = user.credentialManager().getStoredCredentialsStream();
        return credentials.count() > 0;
    }
}
