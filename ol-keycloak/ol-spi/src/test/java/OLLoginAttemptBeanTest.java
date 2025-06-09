import edu.mit.keycloak.forms.login.freemarker.models.OLLoginAttemptBean;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.credential.CredentialModel;
import org.keycloak.models.*;
import org.keycloak.models.credential.PasswordCredentialModel;
import org.keycloak.models.SubjectCredentialManager;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OLLoginAttemptBeanTest {

    private KeycloakSession mockSession;
    private RealmModel mockRealm;
    private UserModel mockUser;

    @BeforeEach
    public void setup() {
        mockSession = mock(KeycloakSession.class);
        mockRealm = mock(RealmModel.class);
        mockUser = mock(UserModel.class);

        when(mockUser.getFirstName()).thenReturn("Rob");
        when(mockUser.getLastName()).thenReturn("Thomas");
    }

    @Test
    public void testUserWithPasswordAndNoFederatedIdentity() {
        // Create a password credential
        CredentialModel passwordCredential = new CredentialModel();
        passwordCredential.setType(PasswordCredentialModel.TYPE);

        // Properly mock SubjectCredentialManager
        SubjectCredentialManager mockCredentialManager = mock(SubjectCredentialManager.class);
        when(mockCredentialManager.getStoredCredentialsStream()).thenReturn(Stream.of(passwordCredential));
        when(mockUser.credentialManager()).thenReturn(mockCredentialManager);

        UserProvider userProvider = mock(UserProvider.class);
        when(mockSession.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(mockRealm, mockUser))
                .thenReturn(Stream.empty());

        OLLoginAttemptBean bean = new OLLoginAttemptBean(mockUser, mockSession, mockRealm);

        assertEquals("Rob Thomas", bean.getUserFullname());
        assertFalse(bean.getNeedsPassword()); // user has password
        assertFalse(bean.getHasSocialProviderAuth()); // no federated identity
    }

    @Test
    public void testUserWithFederatedIdentityOnly() {
        // Mock SubjectCredentialManager with no credentials
        SubjectCredentialManager mockCredentialManager = mock(SubjectCredentialManager.class);
        when(mockCredentialManager.getStoredCredentialsStream()).thenReturn(Stream.empty());
        when(mockUser.credentialManager()).thenReturn(mockCredentialManager);

        // Federated identity exists
        FederatedIdentityModel idp = new FederatedIdentityModel("atlas", "abc123", "Rob");

        UserProvider userProvider = mock(UserProvider.class);
        when(mockSession.users()).thenReturn(userProvider);
        when(userProvider.getFederatedIdentitiesStream(mockRealm, mockUser))
                .thenReturn(Stream.of(idp));

        OLLoginAttemptBean bean = new OLLoginAttemptBean(mockUser, mockSession, mockRealm);

        assertEquals("Rob Thomas", bean.getUserFullname());
        assertTrue(bean.getNeedsPassword()); // no password credentials
        assertTrue(bean.getHasSocialProviderAuth()); // federated identity present
    }
}
