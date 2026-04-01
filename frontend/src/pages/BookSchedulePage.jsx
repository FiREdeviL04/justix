import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { createBookingInquiry, fetchLawyerProfile } from "../services/legalService";

const BookSchedulePage = () => {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [loadingLawyer, setLoadingLawyer] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { toasts, pushToast, removeToast } = useToast();

  useEffect(() => {
    const loadLawyer = async () => {
      setLoadingLawyer(true);
      try {
        const data = await fetchLawyerProfile(lawyerId);
        setLawyer(data);
      } catch (_error) {
        pushToast("Lawyer details not found.", "error");
      } finally {
        setLoadingLawyer(false);
      }
    };

    loadLawyer();
  }, [lawyerId, pushToast]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "customer") {
    return (
      <section className="card max-w-xl p-6">
        <h1 className="text-2xl text-brand-900">Booking access restricted</h1>
        <p className="mt-2 text-sm text-slate-600">Only customers can create bookings with lawyers.</p>
      </section>
    );
  }

  if (user.id === lawyerId) {
    return (
      <section className="card max-w-xl p-6">
        <h1 className="text-2xl text-brand-900">You cannot book yourself</h1>
        <p className="mt-2 text-sm text-slate-600">Please choose another lawyer profile to continue.</p>
      </section>
    );
  }

  const handleSubmit = async (form) => {
    setBookingLoading(true);
    try {
      const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();
      await createBookingInquiry({
        lawyerId,
        type: form.type,
        message: form.message,
        scheduledAt,
      });

      pushToast("Booking request submitted successfully.");
      setTimeout(() => navigate("/customer/dashboard"), 700);
    } catch (_error) {
      pushToast("Failed to submit booking. Please try again.", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {loadingLawyer ? (
        <div className="card h-32 animate-pulse bg-brand-50" />
      ) : (
        lawyer && (
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Booking With</p>
            <h1 className="text-2xl text-brand-900">{lawyer.userId?.name}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {lawyer.experienceYears} years • {lawyer.experienceLevel} • {lawyer.pricing}
            </p>
            <Link to={`/lawyer/${lawyerId}`} className="mt-2 inline-flex text-sm font-semibold text-brand-700 underline">
              View full profile
            </Link>
          </div>
        )
      )}

      <BookingForm onSubmit={handleSubmit} loading={bookingLoading} />
    </section>
  );
};

export default BookSchedulePage;
