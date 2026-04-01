const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-20 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
            toast.type === "error"
              ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-soft"
              : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-soft"
          }
        >
          <div className="flex items-center gap-3">
            <p>{toast.message}</p>
            <button type="button" onClick={() => onClose(toast.id)} className="text-xs font-semibold uppercase">
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
