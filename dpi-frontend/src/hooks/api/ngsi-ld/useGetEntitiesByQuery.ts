import { getContextBrokerConnectionDetails } from 'src/config/contextBroker';
import { useApiCallback } from '../useApiCallback';

export interface ContextBrokerParams {
  type?: string;
  query?: string;
  linkHeader: string;
  keyValues?: boolean;
  ngsiLdTenant?: string;
  id?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  queryOptional?: string;
}

export const useGetEntitiesByQuery = (): {
  makeRequest: (requestParams: ContextBrokerParams) => Promise<any>;
  responseStatus: number;
  error: any;
  loading: boolean;
} => {
  const hook = useApiCallback();
  return {
    responseStatus: hook.responseStatus,
    error: hook.error,
    loading: hook.loading,
    makeRequest: (requestParams: ContextBrokerParams) => {
      const connectionDetails = getContextBrokerConnectionDetails();
      return hook.makeRequest({
        url: connectionDetails.url + 'entities',
        params: {
          ...(requestParams.type && { type: requestParams.type }),
          ...(requestParams.query && { q: requestParams.query }),
          ...(requestParams.queryOptional && { q: requestParams.queryOptional }),
          ...(requestParams.id && { id: requestParams.id }),
          ...(requestParams.keyValues && { options: 'keyValues' }),
          ...(requestParams.limit && { limit: requestParams.limit }),
          ...(requestParams.offset && { offset: requestParams.offset }),
          ...(requestParams.orderBy && { orderBy: requestParams.orderBy }),
          count: true
        },
        headers: {
          Link: `<${requestParams.linkHeader}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`,
          ...(requestParams.ngsiLdTenant && {
            'NGSILD-Tenant': requestParams.ngsiLdTenant
          })
        }
      });
    }
  };
};
