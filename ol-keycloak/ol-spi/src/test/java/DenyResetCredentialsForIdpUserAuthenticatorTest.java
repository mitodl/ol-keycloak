import edu.mit.keycloak.authentication.DenyResetCredentialsForIdpUserAuthenticator;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.UserProvider;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DenyResetCredentialsForIdpUserAuthenticatorTest {

    private final DenyResetCredentialsForIdpUserAuthenticator authenticator =
            new DenyResetCredentialsForIdpUserAuthenticator();

    @Test
    public void testSucceedsWhenNoUserResolved() {
        AuthenticationFlowContext context = mock(AuthenticationFlowContext.class);
        when(context.getUser()).thenReturn(null);

        authenticator.authenticate(context);

        verify(context).success();
        verify(context, never()).failureChallenge(any(), any());
    }

    @Test
    public void testSucceedsWhenUserHasNoFederatedIdentity() {
        AuthenticationFlowContext context = mock(AuthenticationFlowContext.class);
        KeycloakSession session = mock(KeycloakSession.class);
        UserProvider userProvider = mock(UserProvider.class);
        RealmModel realm = mock(RealmModel.class);
        UserModel user = mock(UserModel.class);

        when(context.getUser()).thenReturn(user);
        when(context.getSession()).thenReturn(session);
        when(context.getRealm()).thenReturn(realm);
        when(session.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(realm, user)).thenReturn(Stream.empty());

        authenticator.authenticate(context);

        verify(context).success();
        verify(context, never()).failureChallenge(any(), any());
    }

    @Test
    public void testBlocksWhenUserHasFederatedIdentity() {
        AuthenticationFlowContext context = mock(AuthenticationFlowContext.class);
        KeycloakSession session = mock(KeycloakSession.class);
        UserProvider userProvider = mock(UserProvider.class);
        RealmModel realm = mock(RealmModel.class);
        UserModel user = mock(UserModel.class);
        FederatedIdentityModel federatedIdentity = mock(FederatedIdentityModel.class);
        LoginFormsProvider formsProvider = mock(LoginFormsProvider.class);
        Response errorResponse = mock(Response.class);

        when(context.getUser()).thenReturn(user);
        when(context.getSession()).thenReturn(session);
        when(context.getRealm()).thenReturn(realm);
        when(session.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(realm, user))
                .thenReturn(Stream.of(federatedIdentity));
        when(federatedIdentity.getIdentityProvider()).thenReturn("MASAI");
        when(context.form()).thenReturn(formsProvider);
        when(formsProvider.setError(anyString())).thenReturn(formsProvider);
        when(formsProvider.createErrorPage(Response.Status.BAD_REQUEST)).thenReturn(errorResponse);

        authenticator.authenticate(context);

        verify(context, never()).success();
        verify(context).failureChallenge(AuthenticationFlowError.ACCESS_DENIED, errorResponse);
        verify(formsProvider).setError(contains("MASAI"));
    }
}
