export const getContextBrokerConnectionDetails = () => {
    return connectionDetails
}

const connectionDetails = { url: process.env.REACT_APP_CONTEXT_BROKER_BASE_URL ?? 'http://localhost/orion/ngsi-ld/v1' }