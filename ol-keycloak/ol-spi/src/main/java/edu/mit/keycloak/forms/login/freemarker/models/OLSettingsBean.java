package edu.mit.keycloak.forms.login.freemarker.models;

import java.util.Optional;

import org.keycloak.models.RealmModel;
import org.apache.http.client.utils.URIBuilder;

import edu.mit.keycloak.util.OLAttributeKeys;

public class OLSettingsBean {

    public static String HOME_URL = "#";

    private final String homeUrl;
    private String privacyPolicyUrl;

    public OLSettingsBean(RealmModel realm) {
        this.homeUrl = Optional.ofNullable(realm.getAttribute(OLAttributeKeys.HOME_URL)).orElse(HOME_URL);


        if (HOME_URL.equals(this.homeUrl)) {
            this.privacyPolicyUrl = "#/privacy";
        } else {
            try {
                this.privacyPolicyUrl = new URIBuilder(this.homeUrl).setPath("/privacy").toString();
            } catch (Exception e) {
                this.privacyPolicyUrl = HOME_URL;
            }
        }
    }

    public String getHomeUrl() {
        return homeUrl;
    }

    public String getPrivacyPolicyUrl() {
        return privacyPolicyUrl;
    }
}
