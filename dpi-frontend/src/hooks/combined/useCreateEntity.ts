import { enqueueSnackbar } from 'notistack';
import { usePostEntity } from 'src/hooks/api/ngsi-ld/usePostEntity';

export const useCreateEntity = () => {
    const createEntityContextBroker = usePostEntity(process.env.REACT_APP_DPI_NGSI_CONTEXT ?? "http://context/ngsi-context.jsonld")

    const makeRequests = async (entity: any) => {
        try {
            await createEntityContextBroker.makeRequest(entity)
        } catch (e) {
            enqueueSnackbar(e.message ?? "Failed to create entity in Context Broker", {
                variant: "error"
            })
            return Promise.reject(e.message ?? "Failed to create entity in Context Broker")
        }
        return Promise.resolve()
    }

    return { makeRequests }
}