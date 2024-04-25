# dpi-platform
Dpi open source platform for matching and collaboration on cross borders projects

# dpi-environment #

In this readme we document a docker compose file to deploy all dpi platform services on a single machine

## What is this repository for? ##
* Create a local dev environment
* v0.0.1

## How do I get set up? ##

### Prerequisites

* docker installed (e.g. Docker Desktop 4.12.0 (85629) with docker engine 20.10.17)
* docker compose installed (e.g. Docker Compose version v2.10.2)
* node version installed (v12.22.9 or later)
* Auth0 account with preconfigured tenant (see https://auth0.com/docs/get-started)

All of the following repositories must be cloned into the same folder as this repository (e.g. `../dpi-frontend`)

* dpi-auth0-proxy
* dpi-data-models https://github.com/Fouad-maker/dpi-platform/blob/main/dpi-data-models/README.md
* dpi-frontend


### local deployment



1. clone this repo
1. Open it in vscode (or your favorite IDE)
2. Create a .env.dev.local file under dpi-platform repository with the following content:
```
MONGO_DB_PORT=27017
MONGO_DB_VERSION=4.4

ORION_LD_PORT=1026
ORION_LD_VERSION=1.1.2

SVCAUTH0PROXY_ORGANIZATION_ID=.dpi
SVCAUTH0PROXY_ORIONCONTEXTBROKER_SERVER_URL=http://orion:1026
SVCAUTH0PROXY_SERVER_PORT_EXTERNAL=8086
SVCAUTH0PROXY_SERVER_PORT_INTERNAL=8086
SVCAUTH0PROXY_AUTH0_ORG_ID_VARIABLE_NAME=THE_AUTH0_ORGANIZATION_METADATA_VALUE _OF(org_id)
SVCAUTH0PROXY_AUTH0_AUDIENCE=YOUR.AUTH0.AUDIENCE.URL
SVCAUTH0PROXY_AUTH0_DOMAIN=YOUR.AUTH0.DOMAIN
```

3. `docker compose --env-file .env.dev.local build`
1. `docker compose --env-file .env.dev.local up -d`
2. Open dpi-frontent folder and run
2`npm install` to download all dependencies
3. Start the user interface by running
3. `npm start`

The environment is ready you will see in you terminal that the UI is available through :
Local:            http://localhost:3000
On Your Network:  http://192.168.178.51:3000


* `sudo docker compose --env-file .env.dev down` to stop all containers



## Contribution guidelines ##

We should avoid configuration drifts

* always deploy the master branch without local changes
* keep the environment repository up to date

## Who do I talk to? ##

* Foued Hadded (foued.hadded@jadenx.com)
