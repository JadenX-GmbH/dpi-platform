Before starting the frontend make sure that you have an environment file .env under the root repository with the below content:

`
REACT_APP_DPI_NGSI_CONTEXT=https://raw.githubusercontent.com/Fouad-maker/dpi-context/main/ngsi-context.jsonld
REACT_APP_CONTEXT_BROKER_BASE_URL=http://localhost:8086/ngsi-ld/v1
REACT_APP_DOCKER_JSON_CONTEXT=https://raw.githubusercontent.com/Fouad-maker/dpi-context/main/json-context.jsonld
REACT_APP_ENS_USED_TLD=dpi
REACT_APP_AUTH0_CLIENT_ID=*YOUR*AUTH0*CLIENT*ID
REACT_APP_AUTH0_DOMAIN=**your.auth0.domain**
`

