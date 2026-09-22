const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface StockQuote {
  symbol: string
  currentPrice: number
  change: number
  percentChange: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: string
}

export interface FeaturedStock {
  symbol: string
  name: string
  quote: StockQuote
}

export interface HistoricalPrice {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface HistoricalPriceResponse {
  symbol: string
  resolution: string
  prices: HistoricalPrice[]
}

export interface StockProfile {
  symbol: string
  name: string
  country: string
  currency: string
  exchange: string
  industry: string
  logo: string
  webUrl: string
  marketCapitalization: number
  ipo: string
  phone: string
  ticker: string
}

export interface StockSearchResult {
  symbol: string
  description: string
  displaySymbol: string
  type: string
}

export interface StockSearchResponse {
  query: string
  results: StockSearchResult[]
}

function getToken(): string | null {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  if (!token) {
    throw new Error('No authentication token found')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.headers) {
    const existingHeaders = new Headers(options.headers)

    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }

  headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorBody = await response.json()

      if (errorBody?.message) {
        message = errorBody.message
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message)
  }

  return response.json()
}

export async function getFeaturedStocks(): Promise<FeaturedStock[]> {
  return request<FeaturedStock[]>('/api/market/stocks')
}

export async function getQuote(symbol: string): Promise<StockQuote> {
  return request<StockQuote>(`/api/market/quote/${encodeURIComponent(symbol.toUpperCase())}`)
}

export async function getProfile(symbol: string): Promise<StockProfile> {
  return request<StockProfile>(`/api/market/profile/${encodeURIComponent(symbol.toUpperCase())}`)
}

export async function getHistory(
  symbol: string,
  resolution = 'D',
  from: number,
  to: number,
): Promise<HistoricalPriceResponse> {
  return request<HistoricalPriceResponse>(
    `/api/market/history/${encodeURIComponent(symbol.toUpperCase())}?resolution=${encodeURIComponent(
      resolution,
    )}&from=${from}&to=${to}`,
  )
}

export async function searchStocks(query: string): Promise<StockSearchResponse> {
  return request<StockSearchResponse>(`/api/market/search?query=${encodeURIComponent(query)}`)
}
