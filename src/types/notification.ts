export type NotificationType = 'TRANSACTION' | 'ACCOUNT' | 'SECURITY' | 'SYSTEM'

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS'

export type NotificationStatus = 'SENT' | 'FAILED'

export interface Notification {
  id: number
  notificationType: NotificationType
  channel: NotificationChannel
  title: string
  message: string
  status: NotificationStatus
  read: boolean
  transactionReference?: string
  createdAt: string
}
