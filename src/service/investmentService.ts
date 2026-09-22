const API_BASE_URL = 'http://13.48.104.209:8084'

export interface InvestmentAccount {
  id: number
  ownerEmail: string
  bankAccountNumber: string
  cashBalance: number
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export interface Holding {
  id: number
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  marketValue: number
  profitLoss: number
  profitLossPercent: number
}

export interface Portfolio {
  investmentAccountId: number
  cashBalance: number
  holdingsValue: number
  totalValue: number
  totalInvested: number
  unrealizedProfitLoss: number
  unrealizedProfitLossPercent: number
  holdings: Holding[]
}

export interface InvestmentOrder {
  id: number
  investmentAccountId: number
  type: 'BUY' | 'SELL'
  symbol: string
  quantity: number
  executionPrice: number
  totalAmount: number
  status: 'EXECUTED' | 'REJECTED'
  rejectionReason: string | null
  executedAt: string | null
}

export interface CreateInvestmentAccountRequest {
  bankAccountNumber: string
}

export interface FundingRequest {
  amount: number
}

export interface TradeRequest {
  symbol: string
  quantity: number
}

function getToken(): string | null {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
}
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const error = await response.json()

      if (error?.message) {
        message = error.message
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export async function createInvestmentAccount(
  requestData: CreateInvestmentAccountRequest,
): Promise<InvestmentAccount> {
  return request<InvestmentAccount>('/api/investments/accounts', {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export async function getInvestmentAccounts(): Promise<InvestmentAccount[]> {
  return request<InvestmentAccount[]>('/api/investments/accounts')
}

export async function getInvestmentAccount(accountId: number): Promise<InvestmentAccount> {
  return request<InvestmentAccount>(`/api/investments/accounts/${accountId}`)
}

export async function fundInvestmentAccount(
  accountId: number,
  requestData: FundingRequest,
): Promise<InvestmentAccount> {
  return request<InvestmentAccount>(`/api/investments/accounts/${accountId}/fund`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export async function getHoldings(accountId: number): Promise<Holding[]> {
  return request<Holding[]>(`/api/investments/accounts/${accountId}/holdings`)
}

export async function getPortfolio(accountId: number): Promise<Portfolio> {
  return request<Portfolio>(`/api/investments/accounts/${accountId}/portfolio`)
}

export async function getInvestmentOrders(accountId: number): Promise<InvestmentOrder[]> {
  return request<InvestmentOrder[]>(`/api/investments/accounts/${accountId}/orders`)
}

export async function buyStock(
  accountId: number,
  requestData: TradeRequest,
): Promise<InvestmentOrder> {
  return request<InvestmentOrder>(`/api/investments/accounts/${accountId}/buy`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export async function sellStock(
  accountId: number,
  requestData: TradeRequest,
): Promise<InvestmentOrder> {
  return request<InvestmentOrder>(`/api/investments/accounts/${accountId}/sell`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export async function closeInvestmentAccount(accountId: number): Promise<void> {
  return request<void>(`/api/investments/accounts/${accountId}`, {
    method: 'DELETE',
  })
}
