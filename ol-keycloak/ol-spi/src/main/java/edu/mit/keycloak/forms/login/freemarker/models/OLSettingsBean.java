package edu.mit.keycloak.forms.login.freemarker.models;

import java.util.Optional;

import org.keycloak.models.RealmModel;
import org.apache.http.client.utils.URIBuilder;

import edu.mit.keycloak.util.OLAttributeKeys;

public class OLSettingsBean {

    public static String HOME_URL = "#";

    private final String homeUrl;

    public OLSettingsBean(RealmModel realm) {
        this.homeUrl = Optional.ofNullable(realm.getAttribute(OLAttributeKeys.HOME_URL)).orElse(HOME_URL);
    }

    public String getHomeUrl() {
        return homeUrl;
    }

    public String getTermsOfServiceUrl() {
        return "https://learn.mit.edu/privacy";
    }

    public String getPrivacyPolicyUrl() {
        return "https://learn.mit.edu/terms";
    }
}
