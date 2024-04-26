package edu.mit.keycloak.forms.login.freemarker.models;

import java.util.Optional;

import org.keycloak.models.RealmModel;

import edu.mit.keycloak.util.OLAttributeKeys;


public class OLSettingsBean {

    private String homeUrl;

    public OLSettingsBean(RealmModel realm) {
        this.homeUrl = Optional.ofNullable(realm.getAttribute(OLAttributeKeys.HOME_URL)).orElse("#");
    }

    public String getHomeUrl() {
      return homeUrl;
    }
}
