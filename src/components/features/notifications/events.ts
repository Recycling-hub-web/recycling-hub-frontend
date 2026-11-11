// Broadcast invalidation only; no notification contents enter browser storage.
const NOTIFICATIONS_CHANGED_EVENT = 'recycling-hub:notifications-changed';

const notifyNotificationsChanged = () => {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
  try {
    localStorage.setItem(
      NOTIFICATIONS_CHANGED_EVENT,
      `${Date.now()}-${Math.random()}`,
    );
  } catch {
    // The current tab still refreshes when browser storage is disabled.
  }
};

export { NOTIFICATIONS_CHANGED_EVENT, notifyNotificationsChanged };
