import type { Notification } from '@/types/notification'

const API_BASE_URL = 'http://13.48.104.209:8084'

function getToken(): string | null {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
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
  const result = await request<{
    statusCode: number
    message: string
    data: Notification[]
  }>(`${API_BASE_URL}/api/notifications`)

  return result.data || []
}

export async function getUnreadNotifications(): Promise<Notification[]> {
  const result = await request<{
    statusCode: number
    message: string
    data: Notification[]
  }>(`${API_BASE_URL}/api/notifications/unread`)

  return result.data || []
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification> {
  const result = await request<{
    statusCode: number
    message: string
    data: Notification
  }>(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  })

  return result.data
}

export async function markAllNotificationsAsRead(): Promise<number> {
  const result = await request<{
    statusCode: number
    message: string
    data: number
  }>(`${API_BASE_URL}/api/notifications/read-all`, {
    method: 'PATCH',
  })

  return result.data || 0
}
