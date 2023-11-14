package authentication.authenticators.browser;

import jakarta.ws.rs.core.UriBuilder;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.forms.login.freemarker.LoginFormsUtil;
import org.keycloak.forms.login.freemarker.model.IdentityProviderBean;
import org.keycloak.models.*;
import org.keycloak.services.resources.LoginActionsService;

import java.net.URI;
import java.net.URISyntaxException;
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
            String requestURI = session.getContext().getUri().getBaseUri().getPath();
            UriBuilder uriBuilder = UriBuilder.fromUri(requestURI);
            ClientModel client = session.getContext().getClient();
            if (client != null) {
                uriBuilder.queryParam(Constants.CLIENT_ID, client.getClientId());
            }
            if (context.getAuthenticationSession() != null) {
                uriBuilder.queryParam(Constants.TAB_ID, context.getAuthenticationSession().getTabId());
                String accessCode = context.generateAccessCode();
                uriBuilder.queryParam(LoginActionsService.SESSION_CODE, accessCode);
            }
            URI baseUriWithCodeAndClientId = uriBuilder.build();
            try {
                new URI(baseUriWithCodeAndClientId.getPath());
            } catch (URISyntaxException e) {
                throw new RuntimeException(e);
            }
            form.setAttribute("unlinkedProviders", new IdentityProviderBean(realm, session, realmIdentityProvidersList, baseUriWithCodeAndClientId));
        }
        super.authenticate(context);
    }
}
