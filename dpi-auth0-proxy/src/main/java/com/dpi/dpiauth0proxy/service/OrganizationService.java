package com.dpi.dpiauth0proxy.service;

import org.springframework.stereotype.Component;

@Component
public class OrganizationService {

    public boolean isOauthOrganizationId(String organizationId) {
        if (organizationId.contains("dpi.")) {
            return true;
        } else {
            //skip org logic
            return true;
           // throw new RuntimeException("organizationId not found or organization not a sub-org ");
        }
    }

}
