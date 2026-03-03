export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div className={`notification notification-${notification.type}`}>
      {notification.message}
    </div>
  );
}