export default function StatusBadge({ status }) {
  const value = status?.toLowerCase();

  let className = "badge";

  if (
    value === "pending" ||
    value === "scheduled" ||
    value === "unpaid" ||
    value === "under review"
  ) {
    className = "badge warning";
  }

  if (
    value === "ongoing" ||
    value === "in progress" ||
    value === "under repair" ||
    value === "overdue"
  ) {
    className = "badge danger";
  }

  if (
    value === "resolved" ||
    value === "restored" ||
    value === "paid"
  ) {
    className = "badge success";
  }

  return <span className={className}>{status}</span>;
}