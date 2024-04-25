package com.dpi.dpiauth0proxy.custompredicate;

import com.dpi.dpiauth0proxy.security.SecurityProperties;
import com.dpi.dpiauth0proxy.service.OrganizationService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.handler.predicate.AbstractRoutePredicateFactory;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ServerWebExchange;

import java.util.Base64;
import java.util.Objects;
import java.util.function.Predicate;

@Slf4j
public class OrganizationPredicateRoutePredicateFactory extends AbstractRoutePredicateFactory<OrganizationPredicateRoutePredicateFactory.Config> {

    @Autowired
    private SecurityProperties securityProperties;
    private final OrganizationService organizationService;


    public OrganizationPredicateRoutePredicateFactory(OrganizationService organizationService) {
        super(Config.class);
        this.organizationService = organizationService;
    }

    @Override
    public Predicate<ServerWebExchange> apply(Config config) {
        return (ServerWebExchange t) -> {
            String token = Objects.requireNonNull(t.getRequest()
                    .getHeaders().get("Authorization")).toString();

            boolean isExpectedOrganizationId;
            if (token == null || token.isEmpty()) {
                throw new RuntimeException("empty Token");

            } else {
                String[] chunks = token.split("\\.");
                Base64.Decoder decoder = Base64.getUrlDecoder();
                String payload = new String(decoder.decode(chunks[1]));
                System.out.println(payload);

                try {
                    JSONObject payloadJson = new JSONObject(payload);
                    String organizationId = payloadJson.get("https://" +
                            securityProperties.getOrganizationId() +"/org_id" ).toString();
                    isExpectedOrganizationId = organizationService.isOauthOrganizationId(organizationId);
                } catch (JSONException e) {
                    isExpectedOrganizationId = organizationService.isOauthOrganizationId(".");
                    e.printStackTrace();
                }

            }
            return isExpectedOrganizationId;
        };
    }

    @Validated
    public static class Config {
        boolean isCastOrganizationId;

        public Config(boolean isCastOrganizationId) {
            this.isCastOrganizationId = isCastOrganizationId;
        }

    }
}
