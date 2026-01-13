import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HttpClientOptions {
  retries?: number;
  retryDelayMs?: number;
  name?: string;
}

export const createHttpClient = (
  defaultConfig: AxiosRequestConfig,
  { retries = 2, retryDelayMs = 300, name }: HttpClientOptions = {},
): AxiosInstance => {
  const instance = axios.create({
    timeout: 5000,
    maxRedirects: 3,
    maxBodyLength: 10 * 1024 * 1024,
    maxContentLength: 10 * 1024 * 1024,
    ...defaultConfig,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config as (AxiosRequestConfig & { __retryCount?: number }) | undefined;
      if (!config) {
        throw error;
      }

      config.__retryCount = config.__retryCount ?? 0;
      const shouldRetry =
        config.__retryCount < retries && (!error.response || error.response.status >= 500);

      if (shouldRetry) {
        config.__retryCount += 1;
        const delay = retryDelayMs * Math.pow(2, config.__retryCount - 1);
        await sleep(delay);
        return instance(config);
      }

      if (name) {
        error.message = `[${name}] ${error.message}`;
      }

      throw error;
    },
  );

  return instance;
};
