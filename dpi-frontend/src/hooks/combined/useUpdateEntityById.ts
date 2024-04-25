import { useSnackbar } from "notistack";
import { usePatchEntityById } from "../api/ngsi-ld/usePatchEntityById";

export const useUpdateEntityById = () => {
    const createEntityContextBroker = usePatchEntityById(process.env.REACT_APP_DPI_NGSI_CONTEXT ?? "http://context/ngsi-context.jsonld")
    const { enqueueSnackbar } = useSnackbar();

    const makeRequests = async (entityId: string, entity: any) => {
        try {
            await createEntityContextBroker.makeRequest(entityId, entity)
        } catch (e) {
            enqueueSnackbar(e.message ?? "Failed to update entity in Context Broker", {
                variant: "error"
            })
            return Promise.reject(e.message ?? "Failed to update entity in Context Broker")
        }
        return Promise.resolve()
    }

    return { makeRequests }
}