# dpi-platform
Dpi open source platform for matching and collaboration on cross borders projects

# dpi-environment #

This repository contains a Spring Cloud Gateway project integrated with Auth0 for authorization. It utilizes Java 17 and relies on the Spring Cloud Gateway dependency.

## Technologies Used ##
*  Java 17
*  Maven
*  Auth0 for user authentication and authorization
*  Ensure you have an Auth0 account set up to handle user authentication and authorization within the application.



## What is this repository for? ##
This repository serves as the foundation for an authorization proxy service using Spring Cloud Gateway and Auth0.
The main purpose is to intercept incoming requests, parse them, and forward them to a context broker after 
verifying the user's authorization.

We have skipped filtering based on organizationId if needed you can customize the if-else code in 
[dpi-auth0-proxy/src/main/java/com/dpi/dpiauth0proxy/service/OrganizationService.java]()