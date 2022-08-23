import axios, { AxiosRequestConfig } from "axios";

export interface NtfyContent {
  title?: string;
  message: string;
}

export interface NtfyAuthentication {
  enabled: boolean;
  username: string;
  password: string;
}

export async function send(url: string, content: NtfyContent, authentication: NtfyAuthentication) {
  const requestConfig: AxiosRequestConfig = {
    method: "POST",
    url,
    data: content.message,
    headers: {
      Title: content.title || "Photos",
    },
  };
  if (authentication.enabled) {
    requestConfig.auth = {
      username: authentication.username,
      password: authentication.password,
    };
  }
  return await axios(requestConfig);
}
