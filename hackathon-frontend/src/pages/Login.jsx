import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body, #root {
          height: 100%;
          background: #0a0a0f;
        }

        .auth-root {
          min-height: 100vh;
          height: 100%;
          background: #0a0a0f;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .auth-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(99,235,178,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(99,180,235,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 80%, rgba(235,99,180,0.04) 0%, transparent 50%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          z-index: 1;
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 80px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #63ebb2, #3db88a);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .brand-name span { color: #63ebb2; }

        .hero-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 24px;
        }

        .hero-text h1 em {
          font-style: normal;
          color: #63ebb2;
        }

        .hero-text p {
          font-size: 17px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 380px;
          font-weight: 300;
        }

        .stats-row {
          display: flex;
          gap: 48px;
          margin-top: 64px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ── RIGHT PANEL ── */
        .auth-right {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          z-index: 1;
          background: rgba(10,10,15,0.6);
          border-left: 1px solid rgba(255,255,255,0.05);
          align-self: stretch;
        }

        .auth-card {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
        }

        .card-header {
          margin-bottom: 36px;
        }

        .card-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .card-header p {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
        }

        .field {
          margin-bottom: 20px;
        }

        .field label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .field input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s ease;
        }

        .field input::placeholder { color: rgba(255,255,255,0.2); }

        .field input:focus {
          border-color: #63ebb2;
          background: rgba(99,235,178,0.05);
          box-shadow: 0 0 0 3px rgba(99,235,178,0.08);
        }

        .error-msg {
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ff8080;
          margin-bottom: 20px;
        }

        .btn-primary {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #63ebb2, #3db88a);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0a0a0f;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
          margin-top: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,235,178,0.25);
        }

        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 14px;
          color: rgba(255,255,255,0.35);
        }

        .auth-footer button {
          background: none;
          border: none;
          color: #63ebb2;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ── RESPONSIVE ── */

        /* Tablet: hide left panel, right fills screen */
        @media (max-width: 900px) {
          .auth-left { display: none; }

          .auth-right {
            width: 100%;          /* fill entire viewport width */
            min-height: 100vh;    /* fill entire viewport height */
            padding: 32px 24px;
            align-items: center;
          }

          .auth-card {
            max-width: 480px;
            width: 100%;
            padding: 36px 28px;
            border-radius: 20px;
          }

          .card-header h2 { font-size: 24px; }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .auth-right {
            padding: 24px 16px;
            align-items: flex-start;
            padding-top: 48px;
          }

          .auth-card {
            padding: 28px 20px;
            border-radius: 16px;
          }

          .card-header h2 { font-size: 22px; }
          .card-header p  { font-size: 13px; }

          .field input    { padding: 12px 14px; font-size: 14px; }
          .btn-primary    { padding: 14px; font-size: 14px; }
          .auth-footer    { font-size: 13px; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-bg" />
        <div className="grid-overlay" />

        <div className="auth-left">
          <div className="brand-mark">
            <div className="brand-icon">💰</div>
            <div className="brand-name">Smart<span>Spend</span></div>
          </div>
          <div className="hero-text">
            <h1>Track every<br /><em>rupee</em> you<br />spend.</h1>
            <p>A simple, powerful expense tracker built for students who want to understand where their money goes.</p>
          </div>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Free</span>
            </div>
            <div className="stat">
              <span className="stat-num">5 sec</span>
              <span className="stat-label">To add expense</span>
            </div>
            <div className="stat">
              <span className="stat-num">∞</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="card-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")}>Create one</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;