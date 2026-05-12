export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type || "info"}`}>
      <div>
        <strong>{toast.title || "Notice"}</strong>
        <p>{toast.message}</p>
      </div>

      <button onClick={onClose}>×</button>
    </div>
  );
}