import type { Notification } from '@/types/notification'

const API_BASE_URL = 'http://13.48.104.209:8084'

/*
 * ------------------------------------------------------------
 * AUTHENTICATION
 * ------------------------------------------------------------
 *
 * Customer pages use:
 *   accessToken
 *
 * Admin pages use:
 *   adminAccessToken
 *
 * The notification component is shared by both sides, so the
 * service automatically prefers the admin token when an
 * admin session exists.
 */

function getToken(): string | null {
  return (
    localStorage.getItem('adminAccessToken') ||
    sessionStorage.getItem('adminAccessToken') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  )
}

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
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

  let result: T | null = null

  try {
    result = await response.json()
  } catch {
    result = null
  }

  if (!response.ok) {
    const errorResult = result as
      | { message?: string }
      | null

    throw new Error(
      errorResult?.message ||
        'Notification request failed.',
    )
  }

  return result as T
}

/*
 * ------------------------------------------------------------
 * GET ALL NOTIFICATIONS
 * ------------------------------------------------------------
 */

export async function getNotifications(): Promise<Notification[]> {
  const result = await request<{
    statusCode: number
    message: string
    data: Notification[]
  }>(`${API_BASE_URL}/api/notifications`)

  return result.data || []
}

/*
 * ------------------------------------------------------------
 * GET UNREAD NOTIFICATIONS
 * ------------------------------------------------------------
 */

export async function getUnreadNotifications(): Promise<Notification[]> {
  const result = await request<{
    statusCode: number
    message: string
    data: Notification[]
  }>(`${API_BASE_URL}/api/notifications/unread`)

  return result.data || []
}

/*
 * ------------------------------------------------------------
 * MARK ONE NOTIFICATION AS READ
 * ------------------------------------------------------------
 */

export async function markNotificationAsRead(
  notificationId: number,
): Promise<Notification> {
  const result = await request<{
    statusCode: number
    message: string
    data: Notification
  }>(
    `${API_BASE_URL}/api/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
    },
  )

  return result.data
}

/*
 * ------------------------------------------------------------
 * MARK ALL NOTIFICATIONS AS READ
 * ------------------------------------------------------------
 */

export async function markAllNotificationsAsRead(): Promise<number> {
  const result = await request<{
    statusCode: number
    message: string
    data: number
  }>(
    `${API_BASE_URL}/api/notifications/read-all`,
    {
      method: 'PATCH',
    },
  )

  return result.data || 0
}
