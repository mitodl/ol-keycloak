import edu.mit.keycloak.forms.login.freemarker.OlFreeMarkerLoginFormsProvider;
import edu.mit.keycloak.forms.login.freemarker.models.OLLoginAttemptBean;
import edu.mit.keycloak.forms.login.freemarker.models.OLSettingsBean;
import jakarta.ws.rs.core.UriBuilder;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.common.Profile;
import org.keycloak.forms.login.LoginFormsPages;
import org.keycloak.forms.login.freemarker.FreeMarkerLoginFormsProvider;
import org.keycloak.models.*;
import org.keycloak.theme.Theme;

import java.lang.reflect.Field;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OlFreeMarkerLoginFormsProviderTest {

    private TestableOlFreeMarkerLoginFormsProvider provider;
    private KeycloakSession mockSession;
    private RealmModel mockRealm;
    private KeycloakContext mockContext;
    private Theme mockTheme;
    private Locale mockLocale;
    private Properties mockProperties;
    private UriBuilder mockUriBuilder;
    private AuthenticationFlowContext mockAuthFlowContext;

    public static class TestableOlFreeMarkerLoginFormsProvider extends OlFreeMarkerLoginFormsProvider {
        public TestableOlFreeMarkerLoginFormsProvider(KeycloakSession session) {
            super(session);
        }

        @Override
        public void createCommonAttributes(Theme theme, Locale locale, Properties messagesBundle,
                                           UriBuilder baseUriBuilder, LoginFormsPages page) {
            super.createCommonAttributes(theme, locale, messagesBundle, baseUriBuilder, page);
        }

        public Map<String, Object> getAttributesMap() {
            return this.attributes;
        }
    }

    @BeforeAll
    public static void initProfile() {
        // Disable all features (or enable selectively)
        System.setProperty("keycloak.profile", "preview"); // Or "disabled" if no features are needed
        System.setProperty("keycloak.profile.feature.<feature-name>", "disabled");

        Profile.configure();
    }

    @BeforeEach
    public void setup() throws Exception {
        mockSession = mock(KeycloakSession.class);
        mockContext = mock(KeycloakContext.class);
        mockRealm = mock(RealmModel.class);
        mockAuthFlowContext = mock(AuthenticationFlowContext.class);

        when(mockSession.getContext()).thenReturn(mockContext);
        when(mockContext.getRealm()).thenReturn(mockRealm);
        when(mockContext.getUser()).thenReturn(null);

        PasswordPolicy mockPolicy = mock(PasswordPolicy.class);
        when(mockPolicy.getPolicyConfig(anyString())).thenReturn(null);
        when(mockRealm.getPasswordPolicy()).thenReturn(mockPolicy);

        mockTheme = mock(Theme.class);
        mockLocale = Locale.ENGLISH;
        mockProperties = new Properties();
        mockUriBuilder = mock(UriBuilder.class);

        provider = new TestableOlFreeMarkerLoginFormsProvider(mockSession);

        // Inject the AuthenticationFlowContext mock into the 'context' field
        Field contextField = FreeMarkerLoginFormsProvider.class.getDeclaredField("context");
        contextField.setAccessible(true);
        contextField.set(provider, mockAuthFlowContext);
    }

    @Test
    public void testCreateCommonAttributesAddsOlSettings() {
        when(mockContext.getUser()).thenReturn(null);
        LoginFormsPages page = LoginFormsPages.REGISTER;

        provider.createCommonAttributes(mockTheme, mockLocale, mockProperties, mockUriBuilder, page);

        Object olSettings = provider.getAttributesMap().get("olSettings");
        assertNotNull(olSettings);
        assertTrue(olSettings instanceof OLSettingsBean);

        assertFalse(provider.getAttributesMap().containsKey("loginAttempt"));
    }

    @Test
    public void testCreateCommonAttributesWithLoginPageUserNull() {
        when(mockContext.getUser()).thenReturn(null);

        provider.createCommonAttributes(mockTheme, mockLocale, mockProperties, mockUriBuilder, LoginFormsPages.LOGIN);

        Object olSettings = provider.getAttributesMap().get("olSettings");
        assertNotNull(olSettings);
        assertTrue(olSettings instanceof OLSettingsBean);

        assertTrue(provider.getAttributesMap().containsKey("loginAttempt"));
    }

    @Test
    public void testCreateCommonAttributesWithLoginPageUserPresent() {
        UserModel mockUser = mock(UserModel.class);
        when(mockContext.getUser()).thenReturn(mockUser);

        provider.createCommonAttributes(mockTheme, mockLocale, mockProperties, mockUriBuilder, LoginFormsPages.LOGIN);

        Object olSettings = provider.getAttributesMap().get("olSettings");
        assertNotNull(olSettings);
        assertTrue(olSettings instanceof OLSettingsBean);

        Object loginAttempt = provider.getAttributesMap().get("loginAttempt");
        assertNotNull(loginAttempt);
        assertTrue(loginAttempt instanceof OLLoginAttemptBean);
    }
}
