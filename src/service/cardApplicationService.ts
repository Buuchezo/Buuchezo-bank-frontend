const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CardApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type CardType = 'DEBIT' | 'CREDIT'

export interface CardApplication {
  id: number
  applicantEmail: string
  accountNumber: string
  cardType: CardType
  holderName: string
  applicationStatus: CardApplicationStatus
  rejectionReason: string | null
  createdAt: string
  updatedAt: string | null
  reviewedAt: string | null
  cardId: number | null
}

export interface CreateCardApplicationRequest {
  accountNumber: string
  cardType: CardType
  holderName: string
}

function getToken(): string | null {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

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

export async function createCardApplication(
  requestData: CreateCardApplicationRequest,
): Promise<CardApplication> {
  return request<CardApplication>('/api/cards/applications', {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export async function getMyCardApplications(): Promise<CardApplication[]> {
  return request<CardApplication[]>('/api/cards/applications')
}

export async function getMyCardApplication(id: number): Promise<CardApplication> {
  return request<CardApplication>(`/api/cards/applications/${id}`)
}

// ============================================================
// ADMIN
// ============================================================

export async function getPendingCardApplications(): Promise<CardApplication[]> {
  return request<CardApplication[]>('/api/cards/applications/pending')
}

export async function getAllCardApplications(): Promise<CardApplication[]> {
  return request<CardApplication[]>('/api/cards/applications/all')
}

export async function approveCardApplication(id: number): Promise<CardApplication> {
  return request<CardApplication>(`/api/cards/applications/${id}/approve`, {
    method: 'PATCH',
  })
}

export async function rejectCardApplication(
  id: number,
  rejectionReason: string,
): Promise<CardApplication> {
  return request<CardApplication>(`/api/cards/applications/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({
      rejectionReason,
    }),
  })
}
