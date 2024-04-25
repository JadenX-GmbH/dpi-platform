package com.dpi.dpiauth0proxy.config;

import com.dpi.dpiauth0proxy.custompredicate.OrganizationPredicateRoutePredicateFactory;
import com.dpi.dpiauth0proxy.service.OrganizationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomPredicateConfig {

    @Bean
    public OrganizationPredicateRoutePredicateFactory castPredicate(OrganizationService organizationService) {
        return new OrganizationPredicateRoutePredicateFactory(organizationService);
    }
}
