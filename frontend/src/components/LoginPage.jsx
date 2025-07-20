import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/axios.js";
import Loader from "./Loader.jsx";
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { authUser, setAuthUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      setAuthUser(res.data.user);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        description: error.message,
      });
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-base-500">
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-lg shadow-md w-full max-w-sm border border-primary bg-base-100 text-base-content"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-base-content">
            Login to Account
          </h2>

          <div>
            <div className="space-y-3.5">
              {/* email */}
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  required
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>

              {/* password */}
              <label className="input">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                  minLength="8"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="gray" />
                  ) : (
                    <Eye size={18} color="gray" />
                  )}
                </button>
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />
                At least one number <br />
                At least one lowercase letter <br />
                At least one uppercase letter
              </p>
            </div>
          </div>
          <div>
            <p className="text-base-content/80">
              Don't have an account{" "}
              <Link to="/signup" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-3">
            {isLoading ? <Loader className="text-gray" /> : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
