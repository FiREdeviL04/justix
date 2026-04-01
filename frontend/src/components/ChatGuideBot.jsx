import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const defaultPrompts = [
  "How do I find affordable lawyers?",
  "How can a lawyer get approved?",
  "How do I contact a lawyer quickly?",
  "How do I schedule a meeting?",
];

const getBotReply = (message, role) => {
  const text = message.toLowerCase();

  if (text.includes("affordable") || text.includes("cheap") || text.includes("budget")) {
    return "Use Home or Customer Dashboard filters and set Budget to Low Cost. Also check the Beginner Friendly section for lower-fee options.";
  }

  if (text.includes("approved") || text.includes("approval")) {
    if (role === "lawyer") {
      return "Update your profile with valid specialization, years, and case studies. Your profile status becomes pending and admin can approve it from Admin Dashboard.";
    }
    return "Lawyer profiles are reviewed by admin before public listing. Approved lawyers appear in search results.";
  }

  if (text.includes("contact") || text.includes("call") || text.includes("email") || text.includes("whatsapp")) {
    return "Open a lawyer profile and use Call, Email, or WhatsApp buttons for direct communication. For tracked follow-up, submit an inquiry.";
  }

  if (text.includes("meeting") || text.includes("schedule") || text.includes("book")) {
    return "From the lawyer profile, select Meeting, add your message, choose date/time, and submit inquiry. Lawyer can accept/reject from dashboard.";
  }

  if (text.includes("lawyer") && text.includes("register")) {
    return "Go to Lawyer Join, create account, then complete your dashboard profile with specialization and case studies to improve approval chances.";
  }

  if (text.includes("customer") && text.includes("register")) {
    return "Go to Customer Join and create an account. After login, you can search, save favorites, and track booking history.";
  }

  return "I can guide you with search filters, profile approval, bookings, and contact options. Try one of the quick prompts below.";
};

const quickLinks = [
  { label: "Find Lawyers", to: "/" },
  { label: "Customer Join", to: "/register/customer" },
  { label: "Lawyer Join", to: "/register/lawyer" },
  { label: "Login", to: "/login" },
];

const ChatGuideBot = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am Justix Guide Bot. I can help new users and lawyers navigate the platform.",
    },
  ]);

  const roleLabel = useMemo(() => {
    if (!user?.role) return "guest";
    return user.role;
  }, [user?.role]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text: text.trim() };
    const reply = { sender: "bot", text: getBotReply(text, roleLabel) };

    setMessages((prev) => [...prev, userMessage, reply]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-3 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft">
          <div className="bg-brand-700 px-4 py-3 text-white">
            <p className="text-sm font-semibold">Justix Guide Bot</p>
            <p className="text-xs text-brand-100">Interactive helper for users and lawyers</p>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto bg-brand-50/40 p-3">
            {messages.map((msg, idx) => (
              <div key={`${msg.sender}-${idx}`} className={msg.sender === "bot" ? "text-left" : "text-right"}>
                <p
                  className={
                    msg.sender === "bot"
                      ? "inline-block max-w-[90%] rounded-2xl bg-white px-3 py-2 text-sm text-slate-700"
                      : "inline-block max-w-[90%] rounded-2xl bg-brand-500 px-3 py-2 text-sm text-white"
                  }
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-100 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickLinks.map((item) => (
                <Link key={item.to} to={item.to} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mb-2 flex flex-wrap gap-2">
              {defaultPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(input);
                }}
                placeholder="Ask anything about using Justix..."
                className="input py-2 text-sm"
              />
              <button type="button" onClick={() => sendMessage(input)} className="btn-primary">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
        {open ? "Close Guide" : "Chat with Guide"}
      </button>
    </div>
  );
};

export default ChatGuideBot;
