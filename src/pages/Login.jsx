import { useState } from "react";

import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email address and password."
      );

      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = login(
        cleanEmail,
        password,
        rememberMe
      );

      if (!result.success) {
        setLoading(false);
        setError(result.message);
        return;
      }

      setLoading(false);

      const destination =
        location.state?.from ||
        (result.user.role === "admin"
          ? "/admin"
          : "/customer");

      navigate(destination, {
        replace: true,
      });
    }, 500);
  };

  const handleForgotPassword = () => {
    setError(
      "Password recovery will be connected to the MARVEL account system."
    );
  };

  return (
    <main className="login-page">

      {/* LEFT VISUAL */}

      <section className="login-visual">

        <div className="login-overlay">

          <span className="section-label">
            MARVEL GLOBAL FISH TRADING
          </span>

          <h1>
            Seafood trade,
            <br />
            <span>made simple.</span>
          </h1>

          <p>
            Access your invoices, payments, orders
            and shipping documents from one secure
            customer portal.
          </p>

          <div className="login-trade-line">

            <span>QUOTE</span>

            <ArrowRight size={15} />

            <span>INVOICE</span>

            <ArrowRight size={15} />

            <span>PAYMENT</span>

            <ArrowRight size={15} />

            <span>SHIPMENT</span>

          </div>

        </div>

      </section>

      {/* LOGIN PANEL */}

      <section className="login-panel">

        <div className="login-box">

          <Link
            to="/"
            className="login-brand"
          >
            MARVEL

            <span>
              GLOBAL FISH TRADING
            </span>
          </Link>

          <div className="login-heading">

            <span className="section-label">
              SECURE ACCESS
            </span>

            <h2>
              Welcome back.
            </h2>

            <p>
              Sign in to access your MARVEL account.
            </p>

          </div>

          {error && (
            <div className="login-error">

              <AlertCircle size={17} />

              <span>
                {error}
              </span>

            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <label>
              Email Address

              <div className="input-with-icon">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  required
                />

              </div>

            </label>

            {/* PASSWORD */}

            <label>
              Password

              <div className="input-with-icon">

                <LockKeyhole size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </label>

            {/* OPTIONS */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

          <div className="login-footer">

            <p>
              Need access to the MARVEL customer portal?
            </p>

            <Link to="/request-quote">
              Request a business account
              <ArrowRight size={15} />
            </Link>

          </div>

          <Link
            to="/"
            className="back-home"
          >
            ← Back to MARVEL website
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Login;