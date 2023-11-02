package authentication.authenticators.browser;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class UsernamePasswordFormFactory extends org.keycloak.authentication.authenticators.browser.UsernamePasswordFormFactory {

    public static final String PROVIDER_ID = "ol-auth-username-password-form";
    public static final UsernamePasswordForm SINGLETON = new UsernamePasswordForm();

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    public Authenticator create(KeycloakSession session) {
        return SINGLETON;
    }

    @Override
    public String getDisplayType() {
        return "Open Learning Username Password Form";
    }

    @Override
    public String getHelpText() {
        return "Add all realm IDp's to username & password form";
    }
}
