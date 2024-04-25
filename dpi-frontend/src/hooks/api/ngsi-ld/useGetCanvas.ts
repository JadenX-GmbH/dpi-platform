import { getContextBrokerConnectionDetails } from 'src/config/contextBroker';
import { useApiArrayEffect } from '../useApiArrayEffect';

export const useGetCanvas = <EntityType,>(type: string, projectId: string, linkHeader: string, limit:number): { data: EntityType[]; error: any; loading: boolean; refresh: () => void } => {
  const connectionDetails = getContextBrokerConnectionDetails();
  return useApiArrayEffect({
    url: `${connectionDetails.url}/entities/?type=${type}&options=keyValues`,
    
    params: {
      type: type,
      options: "keyValues",
      q:`belongsTo=="${projectId}"`,
      limit: limit
    },
    headers: {
      Link: `<${linkHeader}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`
    }
  });
};