'use strict';

var axios = require('axios');
var react = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var axios__default = /*#__PURE__*/_interopDefault(axios);

// src/client/createApiClient.ts
function createApiClient(config) {
  const client = axios__default.default.create({
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
  const [data, setData] = react.useState(null);
  const [loading, setLoading] = react.useState(false);
  const [error, setError] = react.useState(null);
  const request = react.useCallback(
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

exports.createApiClient = createApiClient;
exports.useApi = useApi;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map