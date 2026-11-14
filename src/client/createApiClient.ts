
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
} from "axios";

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    getToken?: () => string | null;
    headers?: Record<string, string>;
}

export function createApiClient(
    config: ApiClientConfig
): AxiosInstance {
    const client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout ?? 15000,
        headers: config.headers,
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
