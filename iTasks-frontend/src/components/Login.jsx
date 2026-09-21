import { useContext } from "react";
import { TaskContext, URL } from "../context/Context";
import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginModal = () => {
  const { setIsLogged, setUserName } = useContext(TaskContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Clear form when switching modes
  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setMessage({ text: "", type: "" });
  }, [isLoginMode]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const { username, password, email, confirmPassword } = formData;

    if (!username.trim()) {
      setMessage({ text: "Username is required", type: "error" });
      return false;
    }

    if (!password.trim()) {
      setMessage({ text: "Password is required", type: "error" });
      return false;
    }

    if (!isLoginMode) {
      if (!email.trim()) {
        setMessage({ text: "Email is required", type: "error" });
        return false;
      }

      if (!isValidEmail(email)) {
        setMessage({
          text: "Please enter a valid email address",
          type: "error",
        });
        return false;
      }

      if (!confirmPassword.trim()) {
        setMessage({ text: "Please confirm your password", type: "error" });
        return false;
      }

      if (password !== confirmPassword) {
        setMessage({ text: "Passwords do not match", type: "error" });
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    await axios
      .post(`${isLoginMode ? `${URL}/login` : `${URL}/register`}`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: isLoginMode,
      })
      .then(() => {
        setUserName(formData.username);
        setIsLoading(false);
        isLoginMode ? setIsLogged(true) : setIsLoginMode(true);
      })
      .catch((error) => {
        setIsLoading(false);
        alert("User Not Found Try Register");
        console.log(error);
      });
  };

  // Toggle between login and register
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  // Close modal (in real app, this would be passed as prop)
  const closeModal = () => {
    alert("Hehe Its just for aesthetic :)");
  };

  // Handle keyboard events
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  return (
    <>
      {/* BACKDROP OVERLAY - Covers entire screen */}
      <div
        className="fixed inset-0 bg-gray-700 z-[9998]"
        onClick={closeModal}
      />

      {/* MODAL CONTAINER - Centered on screen */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
        {/* MODAL CONTENT - The actual modal box */}
        <div
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 z-[10000] flex items-center justify-center
                     h-8 w-8 text-2xl text-gray-500 hover:text-red-500 
                     hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200
                     border-2 border-transparent hover:border-red-200 dark:hover:border-red-800"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* MODAL HEADER */}
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 pr-8">
              {isLoginMode ? "Login Form" : "Register Form"}
            </h2>
          </div>

          {/* MODAL BODY - Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 
                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800 dark:text-gray-200
                         hover:border-gray-300 dark:hover:border-gray-500
                         bg-white dark:bg-gray-700"
                placeholder="Enter your username..."
                required
              />
            </div>

            {/* Email Input (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 
                           rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           transition-all duration-200 text-gray-800 dark:text-gray-200
                           hover:border-gray-300 dark:hover:border-gray-500
                           bg-white dark:bg-gray-700"
                  placeholder="Enter your email..."
                  required
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 
                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800 dark:text-gray-200
                         hover:border-gray-300 dark:hover:border-gray-500
                         bg-white dark:bg-gray-700"
                placeholder="Enter your password..."
                required
              />
            </div>

            {/* Confirm Password Input (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 
                           rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           transition-all duration-200 text-gray-800 dark:text-gray-200
                           hover:border-gray-300 dark:hover:border-gray-500
                           bg-white dark:bg-gray-700"
                  placeholder="Confirm your password..."
                  required
                />
              </div>
            )}

            {/* Message Display */}
            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  message.type === "error"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg 
                         hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 
                         focus:ring-offset-2 transition-all duration-200 font-semibold
                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Please wait..."
                  : isLoginMode
                  ? "Login"
                  : "Register"}
              </button>
            </div>

            {/* Toggle Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLoginMode
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-blue-500 hover:text-blue-600 font-medium 
                           underline focus:outline-none focus:ring-2 focus:ring-blue-300 
                           focus:ring-offset-2 rounded transition-colors duration-200"
                >
                  {isLoginMode ? "Register" : "Login"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
