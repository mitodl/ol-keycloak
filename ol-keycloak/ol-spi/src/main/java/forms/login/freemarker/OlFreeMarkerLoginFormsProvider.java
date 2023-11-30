/*
 * Copyright 2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package forms.login.freemarker;

import jakarta.ws.rs.core.*;
import org.keycloak.forms.login.LoginFormsPages;
import org.keycloak.models.*;
import org.keycloak.theme.Theme;
import java.util.*;

import static org.keycloak.forms.login.LoginFormsPages.LOGIN;
import static org.keycloak.forms.login.LoginFormsPages.LOGIN_PASSWORD;

public class OlFreeMarkerLoginFormsProvider extends org.keycloak.forms.login.freemarker.FreeMarkerLoginFormsProvider {

    public OlFreeMarkerLoginFormsProvider(KeycloakSession session) {
        super(session);
    }

    protected void createCommonAttributes(Theme theme, Locale locale, Properties messagesBundle, UriBuilder baseUriBuilder, LoginFormsPages page) {
        super.createCommonAttributes(theme, locale, messagesBundle,baseUriBuilder,page);
        if (page == LOGIN) {
            String firstName = "";
            if (context.getUser() != null) {
                firstName = context.getUser().getFirstName();
            }
            this.attributes.put("firstName", firstName);
        }
    }
}
