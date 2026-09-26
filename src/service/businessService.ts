const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Business {
  id: number
  legalName: string
  tradingName?: string | null
  registrationNumber?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
}

export interface BusinessAccount {
  id: number
  accountNumber: string
  balance: number
  currency: string
  accountType: string
  accountStatus: string
  ownershipType?: string
  businessId?: number
  businessName?: string
}
export interface BusinessTransaction {
  id: number
  reference: string
  fromAccountNumber: string
  fromBankCode?: string
  toAccountNumber: string
  toBankCode?: string
  amount: number
  description?: string
  currency?: string
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT'
  transactionStatus?: string
  transactionDirection: 'DEBIT' | 'CREDIT'
  channel?: string
  createdAt: string
}

export interface BusinessMembership {
  id: number
  businessId: number
  userId: number
  userEmail: string
  role: 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'EMPLOYEE' | 'VIEWER'
  active: boolean
  createdAt?: string
}
export function getBusinessTransactions(accountNumber: string): Promise<BusinessTransaction[]> {
  return request<BusinessTransaction[]>(
    `/api/transactions/history?accountNumber=${encodeURIComponent(accountNumber)}`,
  )
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

  if (!token) {
    throw new Error('You are not authenticated.')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || `Request failed with status ${response.status}.`)
  }

  return (result?.data !== undefined ? result.data : result) as T
}

export function getMyBusinesses(): Promise<Business[]> {
  return request<Business[]>('/api/businesses/me')
}

export function getBusiness(businessId: number): Promise<Business> {
  return request<Business>(`/api/businesses/${businessId}`)
}

export function getBusinessAccounts(businessId: number): Promise<BusinessAccount[]> {
  return request<BusinessAccount[]>(`/api/businesses/${businessId}/accounts`)
}

export function getBusinessMembers(businessId: number): Promise<BusinessMembership[]> {
  return request<BusinessMembership[]>(`/api/businesses/${businessId}/members`)
}

export function addBusinessMember(
  businessId: number,
  memberEmail: string,
  role: BusinessMembership['role'],
): Promise<BusinessMembership> {
  const params = new URLSearchParams({
    memberEmail,
    role,
  })

  return request<BusinessMembership>(`/api/businesses/${businessId}/members?${params.toString()}`, {
    method: 'POST',
  })
}

export function updateBusinessMemberRole(
  businessId: number,
  membershipId: number,
  role: BusinessMembership['role'],
): Promise<BusinessMembership> {
  const params = new URLSearchParams({
    role,
  })

  return request<BusinessMembership>(
    `/api/businesses/${businessId}/members/${membershipId}?${params.toString()}`,
    {
      method: 'PATCH',
    },
  )
}

export function removeBusinessMember(businessId: number, membershipId: number): Promise<void> {
  return request<void>(`/api/businesses/${businessId}/members/${membershipId}`, {
    method: 'DELETE',
  })
}
