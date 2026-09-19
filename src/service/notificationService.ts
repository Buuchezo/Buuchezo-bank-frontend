import type { Notification } from '@/types/notification'

const API_BASE_URL = 'http://13.48.104.209:8084'

function getToken(): string | null {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
}

function getStoredUser(): { email?: string } | null {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

function getEmail(): string {
  const user = getStoredUser()

  if (!user?.email) {
    throw new Error('User email could not be found.')
  }

  return user.email
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  if (!token) {
    throw new Error('You are not authenticated.')
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.message || 'Notification request failed.')
  }

  return result
}

export async function getNotifications(): Promise<Notification[]> {
  const email = encodeURIComponent(getEmail())

  const result = await request<{
    statusCode: number
    message: string
    data: Notification[]
  }>(`${API_BASE_URL}/api/notifications?email=${email}`)

  return result.data || []
}

export async function getUnreadNotifications(): Promise<Notification[]> {
  const email = encodeURIComponent(getEmail())

  const result = await request<{
    statusCode: number
    message: string
    data: Notification[]
  }>(`${API_BASE_URL}/api/notifications/unread?email=${email}`)

  return result.data || []
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification> {
  const email = encodeURIComponent(getEmail())

  const result = await request<{
    statusCode: number
    message: string
    data: Notification
  }>(`${API_BASE_URL}/api/notifications/${notificationId}/read?email=${email}`, {
    method: 'PATCH',
  })

  return result.data
}

export async function markAllNotificationsAsRead(): Promise<number> {
  const email = encodeURIComponent(getEmail())

  const result = await request<{
    statusCode: number
    message: string
    data: number
  }>(`${API_BASE_URL}/api/notifications/read-all?email=${email}`, {
    method: 'PATCH',
  })

  return result.data || 0
}
