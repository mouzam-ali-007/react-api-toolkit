import axios from 'axios';
import { useState, useCallback } from 'react';

// src/client/createApiClient.ts
function createApiClient(config) {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 15e3,
    headers: config.headers
  });
  client.interceptors.request.use((request) => {
    const token = config.getToken?.();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });
  return client;
}
function useApi(client) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = useCallback(
    async (method, url, payload) => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.request({
          method,
          url,
          data: payload
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Something went wrong";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );
  return {
    data,
    loading,
    error,
    request
  };
}

export { createApiClient, useApi };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map