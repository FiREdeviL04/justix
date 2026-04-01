import { useState } from "react";

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "16:00", "18:00"];

const BookingForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    type: "call",
    message: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirm = () => {
    setShowConfirm(false);
    onSubmit(form);
  };

  return (
    <>
      <form className="card space-y-4 p-6" onSubmit={submit}>
        <h2 className="text-2xl text-brand-900">Book / Schedule</h2>

        <div>
          <label className="mb-1 block text-sm font-semibold text-brand-700">Date</label>
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-brand-700">Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, time: slot }))}
                className={
                  form.time === slot
                    ? "rounded-xl border border-brand-500 bg-brand-500/15 px-2 py-2 text-sm font-semibold text-brand-900"
                    : "rounded-xl border border-brand-100 bg-white px-2 py-2 text-sm text-brand-700"
                }
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-brand-700">Type</label>
          <div className="flex gap-2">
            {[
              { key: "call", label: "Call" },
              { key: "email", label: "Email" },
              { key: "meeting", label: "Meeting" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: item.key }))}
                className={
                  form.type === item.key
                    ? "rounded-xl border border-brand-500 bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-900"
                    : "rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm text-brand-700"
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-brand-700">Message</label>
          <textarea
            className="input min-h-28"
            placeholder="Describe your legal requirement"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            required
          />
        </div>

        <button className="btn-primary w-full" type="submit" disabled={loading || !form.time}>
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>

      {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
            <div className="card w-full max-w-md p-6">
              <h3 className="text-xl text-brand-900">Confirm Booking</h3>
              <p className="mt-2 text-sm text-slate-700">{form.date} at {form.time} • {form.type}</p>
              <p className="mt-2 text-sm text-slate-600">{form.message}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => setShowConfirm(false)}>
                  Edit
                </button>
                <button type="button" className="btn-primary" onClick={confirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default BookingForm;
