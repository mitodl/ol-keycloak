package authentication.authenticators.browser;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.forms.login.freemarker.LoginFormsUtil;
import org.keycloak.forms.login.freemarker.model.IdentityProviderBean;
import org.keycloak.models.IdentityProviderModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

public class UsernamePasswordForm extends org.keycloak.authentication.authenticators.browser.UsernamePasswordForm {

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        if (context.getUser() != null) {
            final RealmModel realm = context.getRealm();
            KeycloakSession session = context.getSession();
            List<IdentityProviderModel> identityProvidersLinkedWithUser = LoginFormsUtil
                    .filterIdentityProvidersForTheme(realm.getIdentityProvidersStream(), session, context);
            List<IdentityProviderModel> realmIdentityProvidersList = realm.getIdentityProvidersStream().collect(Collectors.toList());
            LoginFormsProvider form = context.form();
            realmIdentityProvidersList.removeAll(identityProvidersLinkedWithUser);

            form.setAttribute("unlinkedProviders", new IdentityProviderBean(realm, session, realmIdentityProvidersList, URI.create("")));
        }
        super.authenticate(context);
    }
}
