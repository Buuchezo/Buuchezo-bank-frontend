const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Card {
  id: number
  maskedCardNumber: string
  accountNumber: string
  cardType: string
  cardStatus: string
  holderName: string
  expiryDate: string
  createdAt: string
  updatedAt: string
}

function getCustomerToken(): string | null {
  return (
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  )
}

function getAdminToken(): string | null {
  return (
    localStorage.getItem('adminAccessToken') ||
    sessionStorage.getItem('adminAccessToken')
  )
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token: string | null = getCustomerToken(),
): Promise<T> {
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorData = await response.json()

      if (errorData.message) {
        message = errorData.message
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message)
  }

  return response.json()
}

// ============================================================
// CUSTOMER
// ============================================================

export async function getCardsByAccount(accountNumber: string): Promise<Card[]> {
  return request<Card[]>(
    `/api/cards/account/${encodeURIComponent(accountNumber)}`,
  )
}

export async function getCardById(id: number): Promise<Card> {
  return request<Card>(`/api/cards/${id}`)
}

export async function getCardByNumber(cardNumber: string): Promise<Card> {
  return request<Card>(
    `/api/cards/number/${encodeURIComponent(cardNumber)}`,
  )
}

export async function getCardsByAccountAndStatus(
  accountNumber: string,
  status: string,
): Promise<Card[]> {
  return request<Card[]>(
    `/api/cards/account/${encodeURIComponent(accountNumber)}/status/${encodeURIComponent(status)}`,
  )
}

// ============================================================
// ADMIN
// ============================================================

export async function activateCard(id: number): Promise<Card> {
  return request<Card>(
    `/api/cards/${id}/activate`,
    {
      method: 'PATCH',
    },
    getAdminToken(),
  )
}

export async function blockCard(id: number): Promise<Card> {
  return request<Card>(
    `/api/cards/${id}/block`,
    {
      method: 'PATCH',
    },
    getAdminToken(),
  )
}

export async function cancelCard(id: number): Promise<Card> {
  return request<Card>(
    `/api/cards/${id}/cancel`,
    {
      method: 'PATCH',
    },
    getAdminToken(),
  )
}

export async function getAllCards(): Promise<Card[]> {
  return request<Card[]>(
    '/api/cards/admin/all',
    {},
    getAdminToken(),
  )
}

