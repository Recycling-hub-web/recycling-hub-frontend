// The bell (useNotifications) and the full Notifications page
// (useNotificationsList) are two independent hook instances with no
// shared state — marking read from one wouldn't otherwise update the
// other until its next poll tick. A plain window event is enough to
// keep them in sync instantly without reaching for a bigger state
// library or the websocket infra this project deliberately isn't
// building yet (see useNotifications' own docstring).
const NOTIFICATIONS_CHANGED_EVENT = 'recycling-hub:notifications-changed';

const notifyNotificationsChanged = () => {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
};

export { NOTIFICATIONS_CHANGED_EVENT, notifyNotificationsChanged };
