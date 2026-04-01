import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatGuideBot from "./components/ChatGuideBot";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import FloatingActionButton from "./components/FloatingActionButton";

const HomePage = lazy(() => import("./pages/HomePage"));
const LawyersExplorePage = lazy(() => import("./pages/LawyersExplorePage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LawyerProfilePage = lazy(() => import("./pages/LawyerProfilePage"));
const BookSchedulePage = lazy(() => import("./pages/BookSchedulePage"));
const LawyerDashboardPage = lazy(() => import("./pages/LawyerDashboardPage"));
const CustomerDashboardPage = lazy(() => import("./pages/CustomerDashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Suspense fallback={<div className="card h-40 animate-pulse bg-brand-50" />}>
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/lawyers" element={<PageTransition><LawyersExplorePage /></PageTransition>} />
            <Route path="/how-it-works" element={<PageTransition><HowItWorksPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><FaqPage /></PageTransition>} />
            <Route path="/reviews" element={<PageTransition><ReviewsPage /></PageTransition>} />
            <Route path="/report" element={<PageTransition><ReportPage /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
            <Route path="/blog/:id" element={<PageTransition><BlogDetailPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/forget-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/forgotpassword" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/register/:role" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/lawyer/:id" element={<PageTransition><LawyerProfilePage /></PageTransition>} />
            <Route path="/book/:lawyerId" element={<PageTransition><BookSchedulePage /></PageTransition>} />

            <Route
              path="/lawyer/dashboard"
              element={
                <ProtectedRoute roles={["lawyer"]}>
                  <PageTransition><LawyerDashboardPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <PageTransition><CustomerDashboardPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <PageTransition><AdminDashboardPage /></PageTransition>
                </ProtectedRoute>
              }
            />

              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
          </Suspense>
      </main>
      <Footer />
      <FloatingActionButton />
      <ChatGuideBot />
    </div>
  );
};

export default App;
