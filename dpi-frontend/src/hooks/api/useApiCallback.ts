import { useCallback, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export const useApiCallback = () => {
  const [state, setState] = useState<{
    responseStatus: number;
    error: any;
    loading: boolean;
  }>({
    responseStatus: 0,
    error: null,
    loading: false,
  });
  const { getAccessTokenSilently } = useAuth0();

  const makeRequest = useCallback(
    async (config: AxiosRequestConfig) => {
      setState((prevValue) => ({ ...prevValue, error: null, loading: true }));

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://app.dpi.com/'
            // scope: 'read:posts',
          }
        });
        const response = await axios({
          ...config,
          url: config.url,
          headers: {
            ...config.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${token}`
          }
        });
        setState((prevValue) => ({
          ...prevValue,
          error: null,
          loading: false,
          responseStatus: response.status
        }));
        return {
          data: response.data,
          resultsCount: Number(response.headers['ngsild-results-count'])
        };
      } catch (error) {
        console.error(error);
        setState((prevValue) => ({
          ...prevValue,
          error,
          loading: false,
          responseStatus: error.response.status ?? 0
        }));
        return Promise.reject(error);
      }
    },
    [getAccessTokenSilently]
  );

  return {
    ...state,
    makeRequest
  };
};
