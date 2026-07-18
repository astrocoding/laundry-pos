export function formatTime(date: Date | string | number) {
  return new Date(date).toLocaleTimeString("en-US", {
    timeZone: "Asia/Jakarta",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | number) {
  return `${formatDate(date)} ${formatTime(date)}`;
}
