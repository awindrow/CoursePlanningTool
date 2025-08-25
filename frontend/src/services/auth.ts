// services/auth.ts
import { createApiCaller, ApiResult } from "../utils/apiFactory";

export type LoginData = { user: string; token?: string };

export const loginUser = (user: string, password: string): Promise<ApiResult<LoginData>> =>
    createApiCaller<LoginData>({
        method: "GET",
        url: "test_login/",
        params: { user, password }
    })();

export const logoutUser = (): Promise<ApiResult<void>> =>
    createApiCaller<void>({
        method: "GET",            // match your backend's logout method if it's GET
        url: "test_logout/",
    })();