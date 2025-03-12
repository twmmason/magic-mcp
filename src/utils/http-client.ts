import { config } from "./config.js";

const TWENTY_FIRST_API_KEY =
  config.apiKey || process.env.TWENTY_FIRST_API_KEY || process.env.API_KEY;

const BASE_URL = "https://magic.21st.dev";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpClient {
  get<T>(endpoint: string, options?: RequestInit): Promise<{ data: T }>;
  post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ data: T }>;
  put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ data: T }>;
  delete<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ data: T }>;
  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ data: T }>;
}

const createMethod = (method: HttpMethod) => {
  return async <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(TWENTY_FIRST_API_KEY ? { "x-api-key": TWENTY_FIRST_API_KEY } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: (await response.json()) as T };
  };
};

export const twentyFirstClient: HttpClient = {
  get: createMethod("GET"),
  post: createMethod("POST"),
  put: createMethod("PUT"),
  delete: createMethod("DELETE"),
  patch: createMethod("PATCH"),
};
