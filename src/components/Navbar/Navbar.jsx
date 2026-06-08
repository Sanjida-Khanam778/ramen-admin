import { useState, useRef, useEffect } from "react";

const initialNotifications = [
  {
    id: 1, read: false, time: "2 minutes ago",
    title: "New Business Registration",
    message: "TechCorp Solutions has registered on the platform",
    icon: "building",
    iconBg: "bg-blue-50", iconColor: "text-blue-500",
  },
  {
    id: 2, read: false, time: "15 minutes ago",
    title: "Payment Received",
    message: "Digital Marketing Pro upgraded to Professional plan – $99",
    icon: "card",
    iconBg: "bg-emerald-50", iconColor: "text-emerald-500",
  },
  {
    id: 3, read: false, time: "1 hour ago",
    title: "Failed Login Attempt",
    message: "Suspicious login attempt from unknown location detected",
    icon: "warning",
    iconBg: "bg-rose-50", iconColor: "text-rose-500",
  },
  {
    id: 4, read: true, time: "2 hours ago",
    title: "New Team Members Added",
    message: "StartupHub Inc added 5 new team members",
    icon: "users",
    iconBg: "bg-purple-50", iconColor: "text-purple-500",
  },
  {
    id: 5, read: true, time: "3 hours ago",
    title: "Message Flagged for Review",
    message: "A message in #general channel requires moderation",
    icon: "chat",
    iconBg: "bg-amber-50", iconColor: "text-amber-500",
  },
  {
    id: 6, read: true, time: "5 hours ago",
    title: "Database Backup Completed",
    message: "Scheduled backup completed successfully",
    icon: "check",
    iconBg: "bg-teal-50", iconColor: "text-teal-500",
  },
  {
    id: 7, read: true, time: "6 hours ago",
    title: "Trial Expiring Soon",
    message: "5 businesses have trials expiring in the next 3 days",
    icon: "clock",
    iconBg: "bg-orange-50", iconColor: "text-orange-500",
  },
  {
    id: 8, read: true, time: "1 day ago",
    title: "2FA Enabled",
    message: "Global Ventures enabled two-factor authentication",
    icon: "shield",
    iconBg: "bg-slate-100", iconColor: "text-slate-500",
  },
];

function NotifIcon({ type, bg, color }) {
  const icons = {
    building: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
    card: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
    ),
    warning: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    ),
    users: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    chat: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    ),
    check: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    clock: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    shield: (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
  };
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
      {icons[type]}
    </div>
  );
}

export default function Navbar() {
  const [notifs, setNotifs] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const panelRef = useRef();

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div>
      {/* Navbar */}
      <div className="w-full bg-white border-b border-gray px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        {/* Left: Welcome */}
        <div>
          <span className="text-2xl font-semibold text-slate-900">Welcome</span>
          <span className="text-lg text-slate-500">, Admin Dashboard</span>
        </div>

        {/* Right: Bell + User */}
        <div className="flex items-center gap-4">
          {/* Bell */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unread}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {open && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                {/* Panel Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Notifications</p>
                      <p className="text-xs text-slate-400">{unread} unread</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <button onClick={markAllRead}
                        className="text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors whitespace-nowrap">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors ml-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
                  {notifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <NotifIcon type={n.icon} bg={n.iconBg} color={n.iconColor} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{n.title}</p>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100">
                  <button className="w-full py-3 text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-colors">
                    View All Activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200" />

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">SA</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-400">admin@rideshare.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}