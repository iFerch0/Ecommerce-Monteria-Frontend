const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

interface FetchAPIOptions {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  tags?: string[];
  revalidate?: number;
}

export async function fetchAPI<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
  method = 'GET',
  body,
  tags,
  revalidate,
}: FetchAPIOptions): Promise<T> {
  const url = new URL(`/api${endpoint}`, API_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (key === 'populate' && value.includes(',')) {
        value.split(',').forEach((v, i) => {
          url.searchParams.set(`populate[${i}]`, v.trim());
        });
      } else {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (API_TOKEN) {
    headers.Authorization = `Bearer ${API_TOKEN}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    next: {
      ...(tags && { tags }),
      ...(revalidate !== undefined && { revalidate }),
    },
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (wrappedByKey) {
    const wrappedData = data[wrappedByKey];
    return wrappedByList ? wrappedData : wrappedData;
  }

  return data as T;
}
