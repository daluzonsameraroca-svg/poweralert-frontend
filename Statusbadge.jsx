export default function StatusBadge({ status }) {
  const safeStatus = status || "Unknown";
  const value = safeStatus.toLowerCase();

  let className = "badge";

  if (value === "scheduled" || value === "pending" || value === "unpaid") {
    className = "badge warning";
  }

  if (value === "ongoing" || value === "under repair" || value === "overdue") {
    className = "badge danger";
  }

  if (value === "restored" || value === "resolved" || value === "paid") {
    className = "badge success";
  }

  return <span className={className}>{safeStatus}</span>;
}