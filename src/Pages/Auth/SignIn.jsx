"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCredentials } from "../../features/authSlice";
import { useLoginMutation } from "../../Api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      toast.success(t("login.toastSuccess"));
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      toast.error(error.data?.message || t("login.toastError"));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, #E5E7EB 0%, #99A1AF 100%)`,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden py-12"
        style={{
          background: `linear-gradient(135deg, #001A55 0%, #0241A3 100%)`,
        }}
      >
        {/* Logo Section */}
        <div className="pt-8 pb-6 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border border-white border-opacity-30 backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <h1 className="text-white text-sm font-light tracking-wider">
            {t("login.brand")}
          </h1>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          <div className="mb-8 text-center">
            <h2 className="text-white text-3xl font-bold mb-2">
              {t("login.welcomeBack")}
            </h2>
            <p className="text-blue-100 text-sm">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-white text-xs font-semibold mb-2 uppercase tracking-wide">
                {t("login.emailAddress")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type="email"
                  placeholder={t("login.placeholderEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-white border border-white bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-xs font-semibold mb-2 uppercase tracking-wide">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.placeholderPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 text-white border bg-transparent border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-blue-900 font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                  {t("login.signingIn")}
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  {t("login.signIn")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
