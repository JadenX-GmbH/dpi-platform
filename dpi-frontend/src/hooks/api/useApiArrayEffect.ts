import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export const useApiArrayEffect = (config: AxiosRequestConfig) => {
  const [state, setState] = useState<{ error: any; loading: boolean; data: any[] }>({
    error: null,
    loading: true,
    data: [],
  });
  const [refreshIndex, setRefreshIndex] = useState(0);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const valid = true;

      if (valid) {
        setState(s => ({
          ...s,
          data: [],
          error: null,
          loading: true,
        }));
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: 'https://app.dpi.com/'
              // scope: 'read:posts',
            },
          });
          const res = await axios({
            ...config,
            url: config.url,
            headers: {
              ...config.headers,
              // Add the Authorization header to the existing headers
              Authorization: `Bearer ${token}`,
            },
          });

          setState(s => ({
            ...s,
            data: Array.isArray(res.data) ? [...res.data] : [res.data],
            error: null,
            loading: false,
          }));
        } catch (error: any) {

          console.error(error);
          if (error.response)
            setState(s => ({
              ...s,
              data: [],
              error: error.response?.data,
              loading: false,
            }));
          else
            setState(s => ({
              ...s,
              error: {
                message: 'Network Error , Unable to get response',
              },
              loading: false,
            }));
        }
      }
    })();
  }, [refreshIndex, getAccessTokenSilently]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};
