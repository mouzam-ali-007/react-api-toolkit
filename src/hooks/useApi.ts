
import { useCallback, useState } from "react";
import { AxiosInstance } from "axios";

export function useApi<T>(client: AxiosInstance) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(
        async <R = T>(
            method: string,
            url: string,
            payload?: unknown
        ): Promise<R> => {
            setLoading(true);
            setError(null);

            try {
                const response = await client.request<R>({
                    method,
                    url,
                    data: payload,
                });

                setData(response.data as any);
                return response.data;
            } catch (err: any) {
                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong";

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
        request,
    };
}
