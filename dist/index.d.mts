import { AxiosInstance } from 'axios';

interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    getToken?: () => string | null;
    headers?: Record<string, string>;
}
declare function createApiClient(config: ApiClientConfig): AxiosInstance;

declare function useApi<T>(client: AxiosInstance): {
    data: any;
    loading: any;
    error: any;
    request: any;
};

export { createApiClient, useApi };
export type { ApiClientConfig };
