export function csrfHeader(token: string) {
  return {
    "X-CSRF-Token": token
  };
}

export function fetch(url: string, { ...options }: RequestInit = {}) {
  return window.fetch(url, {
    ...options,
    credentials: "same-origin"
  });
}

export function fetchJSON<T>(
  url: string,
  { headers, ...options }: RequestInit = {}
) {
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      Accept: "application/json; charset=utf-8"
    }
  }).then(async response => {
    if (response.ok) return response.json() as Promise<T>;
    if (/json/.test(String(response.headers.get("Content-Type"))))
      return response.json().then(errorJSON => Promise.reject(errorJSON));
    throw new Error(`Application error code ${response.status} for "${url}"`);
  });
}

export const getJSON = fetchJSON;

export function postJSON<T>(
  url: string,
  body: object,
  { headers, method = "POST", ...options }: RequestInit = {}
) {
  return fetchJSON<T>(url, {
    ...options,
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8"
    },
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
}
