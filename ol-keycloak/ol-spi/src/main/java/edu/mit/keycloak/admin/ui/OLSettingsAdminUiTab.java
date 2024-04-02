package edu.mit.keycloak.admin.ui;

import org.keycloak.Config;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.RealmModel;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;
import org.keycloak.services.ui.extend.UiTabProvider;
import org.keycloak.services.ui.extend.UiTabProviderFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.mit.keycloak.util.OLAttributeKeys;
/**
 * Admin UI Tab for providing additional realm-level settings for MIT Open.
 *
 * These are things that don't fit well under different scopes like clients.
 *
 */
public class OLSettingsAdminUiTab implements UiTabProvider, UiTabProviderFactory<ComponentModel> {
    public static String ID = "Open Learning";

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getHelpText() {
        return "Configuration specific to Open Learning";
    }

    @Override
    public void init(Config.Scope config) {
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
    }

    @Override
    public void close() {
    }

    @Override
    public void onCreate(KeycloakSession session, RealmModel realm, ComponentModel model) {
        realm.setAttribute(OLAttributeKeys.HOME_URL, model.get(OLAttributeKeys.HOME_URL));
    }

    @Override
    public void onUpdate(KeycloakSession session, RealmModel realm, ComponentModel oldModel, ComponentModel newModel) {
        newModel.put(OLAttributeKeys.HOME_URL, oldModel.get(OLAttributeKeys.HOME_URL));
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        final ProviderConfigurationBuilder builder = ProviderConfigurationBuilder.create();
        builder.property()
                .name(OLAttributeKeys.HOME_URL)
                .label("Canoncial Home URL")
                .helpText("URL for the homepage of the canonical site for links (e.g. logo)")
                .type(ProviderConfigProperty.STRING_TYPE)
                .add();
        return builder.build();
    }

    @Override
    public String getPath() {
        return "/:realm/realm-settings/:tab?";
    }

    @Override
    public Map<String, String> getParams() {
        Map<String, String> params = new HashMap<>();
        params.put("tab", "open");
        return params;
    }
}
