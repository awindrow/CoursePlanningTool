// utils/apiFactory.ts
import { AxiosRequestConfig, AxiosResponse } from "axios";
import api from "../services/axios";
import { handleApiError } from "./errorHandler";

export type ApiResult<T> = { ok: true; data: T } | { ok: false };

export const createApiCaller = <T>(config: AxiosRequestConfig) => {
    return async (): Promise<ApiResult<T>> => {
        try {
            const response: AxiosResponse<T> = await api.request(config);
            return { ok: true, data: response.data };
        } catch (error) {
            handleApiError(error);
            return { ok: false };
        }
    };
};
