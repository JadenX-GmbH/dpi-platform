
import { getContextBrokerConnectionDetails } from 'src/config/contextBroker';
import { useApiCallback } from '../useApiCallback';

export const usePatchEntityById = <EntityType,>(linkHeader: string): {
    makeRequest: (entityId: string, data: EntityType) => Promise<any>;
    responseStatus: number;
    error: any;
    loading: boolean;
} => {
    const hook = useApiCallback();
    const connectionDetails = getContextBrokerConnectionDetails()
    return {
        responseStatus: hook.responseStatus,
        error: hook.error,
        loading: hook.loading,
        makeRequest: (entityId: string, data: EntityType) => hook.makeRequest({
            url: connectionDetails.url + '/entities/' + entityId + '/attrs',
            headers: {
                'Content-Type': 'application/json', // Added Content-Type header
                Link: `<${linkHeader}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`
            },
            method: "PATCH",
            data: data
        })
    };
};