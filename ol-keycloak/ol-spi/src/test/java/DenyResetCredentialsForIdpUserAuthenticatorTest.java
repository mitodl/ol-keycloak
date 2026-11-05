import edu.mit.keycloak.authentication.DenyResetCredentialsForIdpUserAuthenticator;
import org.junit.jupiter.api.Test;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.IdentityProviderModel;
import org.keycloak.models.IdentityProviderStorageProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.UserProvider;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.services.messages.Messages;
import org.mockito.ArgumentCaptor;

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
    public void testForksWithGenericEmailSentMessageWhenUserHasFederatedIdentity() {
        AuthenticationFlowContext context = mock(AuthenticationFlowContext.class);
        KeycloakSession session = mock(KeycloakSession.class);
        UserProvider userProvider = mock(UserProvider.class);
        IdentityProviderStorageProvider idpStorageProvider = mock(IdentityProviderStorageProvider.class);
        IdentityProviderModel idp = mock(IdentityProviderModel.class);
        RealmModel realm = mock(RealmModel.class);
        UserModel user = mock(UserModel.class);
        FederatedIdentityModel federatedIdentity = mock(FederatedIdentityModel.class);

        when(context.getUser()).thenReturn(user);
        when(context.getSession()).thenReturn(session);
        when(context.getRealm()).thenReturn(realm);
        when(session.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(realm, user))
                .thenReturn(Stream.of(federatedIdentity));
        when(federatedIdentity.getIdentityProvider()).thenReturn("MASAI");
        when(session.identityProviders()).thenReturn(idpStorageProvider);
        when(idpStorageProvider.getByAlias("MASAI")).thenReturn(idp);
        when(idp.isEnabled()).thenReturn(true);

        authenticator.authenticate(context);

        // Same generic response as ResetCredentialEmail's "don't reveal account
        // state" branch: no success(), no failureChallenge() (which would count
        // as a failed login under brute-force protection), just a forked
        // EMAIL_SENT page with no email actually sent.
        verify(context, never()).success();
        verify(context, never()).failureChallenge(any(), any());
        ArgumentCaptor<FormMessage> messageCaptor = ArgumentCaptor.forClass(FormMessage.class);
        verify(context).forkWithSuccessMessage(messageCaptor.capture());
        assertEquals(Messages.EMAIL_SENT, messageCaptor.getValue().getMessage());
    }

    @Test
    public void testSucceedsWhenFederatedIdentityProviderNoLongerExists() {
        AuthenticationFlowContext context = mock(AuthenticationFlowContext.class);
        KeycloakSession session = mock(KeycloakSession.class);
        UserProvider userProvider = mock(UserProvider.class);
        IdentityProviderStorageProvider idpStorageProvider = mock(IdentityProviderStorageProvider.class);
        RealmModel realm = mock(RealmModel.class);
        UserModel user = mock(UserModel.class);
        FederatedIdentityModel federatedIdentity = mock(FederatedIdentityModel.class);

        when(context.getUser()).thenReturn(user);
        when(context.getSession()).thenReturn(session);
        when(context.getRealm()).thenReturn(realm);
        when(session.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(realm, user))
                .thenReturn(Stream.of(federatedIdentity));
        when(federatedIdentity.getIdentityProvider()).thenReturn("DECOMMISSIONED-IDP");
        when(session.identityProviders()).thenReturn(idpStorageProvider);
        when(idpStorageProvider.getByAlias("DECOMMISSIONED-IDP")).thenReturn(null);

        authenticator.authenticate(context);

        verify(context).success();
        verify(context, never()).failureChallenge(any(), any());
    }

    @Test
    public void testSucceedsWhenFederatedIdentityProviderIsDisabled() {
        AuthenticationFlowContext context = mock(AuthenticationFlowContext.class);
        KeycloakSession session = mock(KeycloakSession.class);
        UserProvider userProvider = mock(UserProvider.class);
        IdentityProviderStorageProvider idpStorageProvider = mock(IdentityProviderStorageProvider.class);
        IdentityProviderModel idp = mock(IdentityProviderModel.class);
        RealmModel realm = mock(RealmModel.class);
        UserModel user = mock(UserModel.class);
        FederatedIdentityModel federatedIdentity = mock(FederatedIdentityModel.class);

        when(context.getUser()).thenReturn(user);
        when(context.getSession()).thenReturn(session);
        when(context.getRealm()).thenReturn(realm);
        when(session.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(realm, user))
                .thenReturn(Stream.of(federatedIdentity));
        when(federatedIdentity.getIdentityProvider()).thenReturn("MASAI");
        when(session.identityProviders()).thenReturn(idpStorageProvider);
        when(idpStorageProvider.getByAlias("MASAI")).thenReturn(idp);
        when(idp.isEnabled()).thenReturn(false);

        authenticator.authenticate(context);

        verify(context).success();
        verify(context, never()).failureChallenge(any(), any());
    }
}
