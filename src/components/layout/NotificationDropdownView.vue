<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
} from 'lucide-vue-next'

import type { Notification } from '@/types/notification'

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/service/notificationService.ts'

const isOpen = ref(false)
const loading = ref(false)
const markingAllAsRead = ref(false)

const notifications = ref<Notification[]>([])
const error = ref('')

const selectedNotification = ref<Notification | null>(null)

const unreadCount = computed(
  () =>
    notifications.value.filter(
      notification => !notification.read
    ).length
)

async function loadNotifications() {
  loading.value = true
  error.value = ''

  try {
    /*
     * We now load ALL notifications instead of only
     * unread notifications.
     *
     * This means a notification remains visible after
     * it has been read.
     */
    notifications.value = await getNotifications()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Could not load notifications.'
  } finally {
    loading.value = false
  }
}

async function toggleNotifications() {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    await loadNotifications()
  }
}

async function openNotification(
  notification: Notification
) {
  /*
   * Show the complete notification first.
   */
  selectedNotification.value = notification

  /*
   * If it is unread, mark it as read in the backend.
   */
  if (!notification.read) {
    try {
      const updated =
        await markNotificationAsRead(
          notification.id
        )

      /*
       * Update the local notification rather than
       * removing it from the list.
       */
      notification.read = updated.read
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Could not mark notification as read.'
    }
  }
}

function closeNotificationDetail() {
  selectedNotification.value = null
}

async function markAllAsRead() {
  if (
    markingAllAsRead.value ||
    unreadCount.value === 0
  ) {
    return
  }

  markingAllAsRead.value = true
  error.value = ''

  try {
    await markAllNotificationsAsRead()

    /*
     * Keep the notifications visible.
     * Only change their read state.
     */
    notifications.value.forEach(
      notification => {
        notification.read = true
      }
    )
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Could not mark notifications as read.'
  } finally {
    markingAllAsRead.value = false
  }
}

function formatNotificationTime(
  createdAt: string
): string {
  const date = new Date(createdAt)
  const now = new Date()

  const difference =
    now.getTime() - date.getTime()

  const minutes = Math.floor(
    difference / (1000 * 60)
  )

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hr ago`
  }

  const days = Math.floor(hours / 24)

  if (days === 1) {
    return 'Yesterday'
  }

  return `${days} days ago`
}

function formatFullDate(
  createdAt: string
): string {
  const date = new Date(createdAt)

  return date.toLocaleString(
    undefined,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

function getNotificationIcon(
  notification: Notification
) {
  const message =
    `${notification.title} ${notification.message}`
      .toLowerCase()

  if (
    message.includes('received') ||
    message.includes('deposited') ||
    message.includes('credited')
  ) {
    return ArrowDownLeft
  }

  if (
    message.includes('withdraw') ||
    message.includes('transferred') ||
    message.includes('paid')
  ) {
    return ArrowUpRight
  }

  return Info
}

function closeOnOutsideClick(
  event: MouseEvent
) {
  const target =
    event.target as HTMLElement

  if (
    !target.closest(
      '.notification-wrapper'
    )
  ) {
    isOpen.value = false
    selectedNotification.value = null
  }
}

onMounted(() => {
  document.addEventListener(
    'click',
    closeOnOutsideClick
  )

  loadNotifications()
})

onUnmounted(() => {
  document.removeEventListener(
    'click',
    closeOnOutsideClick
  )
})
</script>

<template>
  <div class="notification-wrapper">

    <!-- Notification bell -->
    <button
      class="notification-button"
      type="button"
      aria-label="Notifications"
      @click.stop="toggleNotifications"
    >
      <Bell :size="21" />

      <span
        v-if="unreadCount > 0"
        class="notification-badge"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notification dropdown -->
    <Transition name="notification-fade">
      <div
        v-if="isOpen"
        class="notification-dropdown"
        @click.stop
      >

        <!-- Header -->
        <div class="notification-header">

          <div>
            <h3>Notifications</h3>

            <span v-if="unreadCount > 0">
              {{ unreadCount }} unread
            </span>

            <span v-else>
              All caught up
            </span>
          </div>

          <button
            class="close-button"
            type="button"
            @click="isOpen = false"
          >
            <X :size="18" />
          </button>

        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="notification-state"
        >
          <Loader2
            class="loading-icon"
            :size="24"
          />

          <p>
            Loading notifications...
          </p>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="notification-state error-state"
        >
          <p>{{ error }}</p>

          <button
            type="button"
            @click="loadNotifications"
          >
            Try again
          </button>
        </div>

        <!-- Empty -->
        <div
          v-else-if="
            notifications.length === 0
          "
          class="notification-state"
        >

          <div class="empty-icon">
            <Bell :size="24" />
          </div>

          <strong>
            No notifications
          </strong>

          <p>
            You're all caught up.
          </p>

        </div>

        <!-- Notification list -->
        <div
          v-else
          class="notification-list"
        >

          <button
            v-for="notification in notifications"
            :key="notification.id"
            type="button"
            class="notification-item"
            :class="{
              unread: !notification.read
            }"
            @click="
              openNotification(notification)
            "
          >

            <div
              class="notification-icon"
            >
              <component
                :is="
                  getNotificationIcon(
                    notification
                  )
                "
                :size="17"
              />
            </div>

            <div
              class="notification-content"
            >

              <strong>
                {{ notification.title }}
              </strong>

              <p>
                {{ notification.message }}
              </p>

              <span>
                {{
                  formatNotificationTime(
                    notification.createdAt
                  )
                }}
              </span>

            </div>

            <span
              v-if="!notification.read"
              class="unread-dot"
            />

          </button>

        </div>

        <!-- Footer -->
        <div
          v-if="
            notifications.length > 0 &&
            unreadCount > 0
          "
          class="notification-footer"
        >

          <button
            type="button"
            :disabled="markingAllAsRead"
            @click="markAllAsRead"
          >

            <Loader2
              v-if="markingAllAsRead"
              class="loading-icon"
              :size="15"
            />

            <CheckCheck
              v-else
              :size="15"
            />

            Mark all as read

          </button>

        </div>

      </div>
    </Transition>

    <!-- Notification detail modal -->
    <Transition name="detail-fade">
      <div
        v-if="selectedNotification"
        class="notification-detail-overlay"
        @click.self="
          closeNotificationDetail
        "
      >

        <div
          class="notification-detail"
          @click.stop
        >

          <!-- Detail header -->
          <div
            class="detail-header"
          >

            <div
              class="detail-icon"
            >
              <component
                :is="
                  getNotificationIcon(
                    selectedNotification
                  )
                "
                :size="24"
              />
            </div>

            <button
              type="button"
              class="detail-close"
              @click="
                closeNotificationDetail
              "
            >
              <X :size="20" />
            </button>

          </div>

          <!-- Detail content -->
          <div
            class="detail-content"
          >

            <span
              class="detail-type"
            >
              {{
                selectedNotification
                  .notificationType
                  .replace('_', ' ')
              }}
            </span>

            <h2>
              {{
                selectedNotification.title
              }}
            </h2>

            <p
              class="detail-message"
            >
              {{
                selectedNotification.message
              }}
            </p>

            <div
              class="detail-divider"
            />

            <div
              class="detail-information"
            >

              <div
                class="detail-row"
              >
                <span>
                  Date
                </span>

                <strong>
                  {{
                    formatFullDate(
                      selectedNotification
                        .createdAt
                    )
                  }}
                </strong>
              </div>

              <div
                v-if="
                  selectedNotification
                    .transactionReference
                "
                class="detail-row"
              >
                <span>
                  Reference
                </span>

                <strong>
                  {{
                    selectedNotification
                      .transactionReference
                  }}
                </strong>
              </div>

              <div
                class="detail-row"
              >
                <span>
                  Status
                </span>

                <strong
                  class="status-value"
                >
                  <Check :size="14" />
                  {{
                    selectedNotification.status
                  }}
                </strong>
              </div>

            </div>

          </div>

          <!-- Detail footer -->
          <div
            class="detail-footer"
          >
            <button
              type="button"
              class="detail-done-button"
              @click="
                closeNotificationDetail
              "
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </Transition>

  </div>
</template>

<style scoped>
.notification-wrapper {
  position: relative;
}

.notification-button {
  position: relative;
  width: 42px;
  height: 42px;
  border: 1px solid #e5eaf2;
  border-radius: 12px;
  background: #ffffff;
  color: #172033;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-button:hover {
  border-color: #cbd6e8;
  background: #f8faff;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #146ef5;
  color: white;
  border: 2px solid white;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 390px;
  background: white;
  border: 1px solid #e5eaf2;
  border-radius: 18px;
  box-shadow:
    0 20px 50px rgba(15, 35, 70, 0.16);
  overflow: hidden;
  z-index: 1000;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #edf0f5;
}

.notification-header h3 {
  margin: 0 0 3px;
  color: #172033;
  font-size: 16px;
  font-weight: 800;
}

.notification-header span {
  color: #8994a7;
  font-size: 12px;
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 9px;
  background: #f4f6f9;
  color: #68758a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.notification-list {
  max-height: 390px;
  overflow-y: auto;
}

.notification-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border: none;
  border-bottom: 1px solid #f0f2f6;
  background: white;
  text-align: left;
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #f8faff;
}

.notification-item.unread {
  background: #fbfdff;
}

.notification-icon {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: #eaf3ff;
  color: #146ef5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  min-width: 0;
  flex: 1;
}

.notification-content strong {
  display: block;
  color: #172033;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 4px;
}

.notification-content p {
  margin: 0 0 6px;
  color: #68758a;
  font-size: 12px;
  line-height: 1.5;
}

.notification-content span {
  color: #a0a9b8;
  font-size: 10px;
  font-weight: 600;
}

.unread-dot {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  margin-top: 6px;
  border-radius: 50%;
  background: #146ef5;
}

.notification-state {
  min-height: 180px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #68758a;
}

.notification-state p {
  margin: 8px 0 0;
  font-size: 13px;
}

.notification-state strong {
  margin-top: 10px;
  color: #172033;
  font-size: 14px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f1f5fa;
  color: #8b98aa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-state {
  color: #b42318;
}

.error-state button {
  margin-top: 12px;
  border: none;
  background: #146ef5;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #edf0f5;
}

.notification-footer button {
  width: 100%;
  border: none;
  background: transparent;
  color: #146ef5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.notification-footer button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* ========================= */
/* Notification detail modal */
/* ========================= */

.notification-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(12, 25, 48, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.notification-detail {
  width: min(520px, 100%);
  background: white;
  border-radius: 22px;
  box-shadow:
    0 30px 80px rgba(10, 25, 55, 0.25);
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 0;
}

.detail-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #eaf3ff;
  color: #146ef5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: #f4f6f9;
  color: #68758a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-close:hover {
  background: #e9edf3;
  color: #172033;
}

.detail-content {
  padding: 22px 24px;
}

.detail-type {
  display: inline-block;
  margin-bottom: 8px;
  color: #146ef5;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.detail-content h2 {
  margin: 0 0 14px;
  color: #172033;
  font-size: 23px;
  line-height: 1.25;
  font-weight: 800;
}

.detail-message {
  margin: 0;
  color: #4e5c70;
  font-size: 15px;
  line-height: 1.7;
}

.detail-divider {
  height: 1px;
  margin: 22px 0;
  background: #edf0f5;
}

.detail-information {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.detail-row span {
  color: #8b96a8;
  font-size: 12px;
}

.detail-row strong {
  color: #172033;
  font-size: 12px;
  text-align: right;
  max-width: 65%;
  word-break: break-word;
}

.status-value {
  color: #16845b !important;
  display: flex;
  align-items: center;
  gap: 5px;
}

.detail-footer {
  padding: 16px 24px 22px;
  border-top: 1px solid #edf0f5;
}

.detail-done-button {
  width: 100%;
  border: none;
  border-radius: 11px;
  background: #146ef5;
  color: white;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease;
}

.detail-done-button:hover {
  background: #0f5ed8;
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 0.2s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .notification-dropdown {
    position: fixed;
    top: 70px;
    right: 14px;
    left: 14px;
    width: auto;
  }

  .notification-detail-overlay {
    padding: 14px;
  }

  .notification-detail {
    border-radius: 18px;
  }

  .detail-content h2 {
    font-size: 20px;
  }

  .detail-message {
    font-size: 14px;
  }
}
</style>
