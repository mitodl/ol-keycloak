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
import org.keycloak.tracing.TracingProvider;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

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
    private ThemeManager mockThemeManager;
    private Theme mockTheme;
    private TracingProvider mockTracingProvider;
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
        mockThemeManager = mock(ThemeManager.class);
        mockTheme = mock(Theme.class);
        mockTracingProvider = mock(TracingProvider.class);

        Span mockSpan = mock(Span.class);
        SpanContext mockSpanContext = mock(SpanContext.class);
        when(mockSpan.getSpanContext()).thenReturn(mockSpanContext);
        when(mockSpanContext.isValid()).thenReturn(false);

        when(mockSession.getContext()).thenReturn(mockContext);
        when(mockSession.theme()).thenReturn(mockThemeManager);
        when(mockSession.getProvider(TracingProvider.class)).thenReturn(mockTracingProvider);
        when(mockTracingProvider.getCurrentSpan()).thenReturn(mockSpan);
        when(mockThemeManager.getTheme(any(Theme.Type.class))).thenReturn(mockTheme);
        when(mockTheme.getEnhancedMessages(any(), any())).thenReturn(new Properties());
        when(mockTheme.getProperties()).thenReturn(new Properties());
        when(mockContext.resolveLocale(any())).thenReturn(Locale.ENGLISH);
        when(mockContext.getRealm()).thenReturn(mockRealm);
        when(mockContext.getUser()).thenReturn(null);

        PasswordPolicy mockPolicy = mock(PasswordPolicy.class);
        when(mockPolicy.getPolicyConfig(anyString())).thenReturn(null);
        when(mockRealm.getPasswordPolicy()).thenReturn(mockPolicy);
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
