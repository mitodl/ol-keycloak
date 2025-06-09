import edu.mit.keycloak.forms.login.freemarker.models.OLSettingsBean;
import edu.mit.keycloak.util.OLAttributeKeys;
import org.junit.jupiter.api.Test;
import org.keycloak.models.RealmModel;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OLSettingsBeanTest {

    @Test
    public void testHomeUrlFromRealmAttribute() {
        RealmModel mockRealm = mock(RealmModel.class);
        when(mockRealm.getAttribute(OLAttributeKeys.HOME_URL)).thenReturn("https://example.com");

        OLSettingsBean bean = new OLSettingsBean(mockRealm);

        assertEquals("https://example.com", bean.getHomeUrl());
    }

    @Test
    public void testHomeUrlFallsBackToDefaultWhenAttributeMissing() {
        RealmModel mockRealm = mock(RealmModel.class);
        when(mockRealm.getAttribute(OLAttributeKeys.HOME_URL)).thenReturn(null);

        OLSettingsBean bean = new OLSettingsBean(mockRealm);

        assertEquals(OLSettingsBean.HOME_URL, bean.getHomeUrl());
    }

    @Test
    public void testPrivacyPolicyUrlFallbackOnException() {
        RealmModel mockRealm = mock(RealmModel.class);
        when(mockRealm.getAttribute(OLAttributeKeys.HOME_URL)).thenReturn("http://[invalid-url");

        OLSettingsBean bean = new OLSettingsBean(mockRealm);

        assertEquals("http://[invalid-url", bean.getHomeUrl());
    }
}
