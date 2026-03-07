import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: #0a0a0f !important;
          min-height: 100vh;
          /* NEVER hide overflow on html/body — breaks scroll */
          overflow-x: hidden;
        }

        .auth-root {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          /* NO overflow:hidden here — was killing scroll */
          position: relative;
        }

        .auth-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 80% 50%, rgba(99,235,178,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 20%, rgba(99,180,235,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 40% 80%, rgba(235,180,99,0.04) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          width: 480px;
          flex-shrink: 0;
          /* min-height so it grows with content, never clips */
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          /* vertical padding so card never touches edges on small screens */
          padding: 48px 40px;
          position: relative;
          z-index: 1;
          background: rgba(10, 10, 15, 0.9);
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .auth-card {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #63ebb2, #3db88a);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .brand-name span { color: #63ebb2; }

        .card-header { margin-bottom: 32px; }

        .card-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .card-header p { font-size: 14px; color: rgba(255,255,255,0.4); }

        .field { margin-bottom: 18px; }

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

        .password-hint { font-size: 12px; color: rgba(255,255,255,0.25); margin-top: 6px; }

        .error-msg {
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ff8080;
          margin-bottom: 16px;
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
          margin-top: 24px;
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

        /* ── RIGHT PANEL ── */
        .auth-right {
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          z-index: 1;
        }

        .perks h3 {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 32px;
        }

        .perk-list { display: flex; flex-direction: column; gap: 24px; }

        .perk { display: flex; align-items: flex-start; gap: 16px; }

        .perk-icon {
          width: 44px;
          height: 44px;
          background: rgba(99,235,178,0.1);
          border: 1px solid rgba(99,235,178,0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .perk-text h4 {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .perk-text p { font-size: 14px; color: rgba(255,255,255,0.35); line-height: 1.5; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .auth-right { display: none; }
          .auth-left {
            width: 100%;
            border-right: none;
            padding: 48px 24px;
            /* on mobile: don't center vertically, let content flow from top */
            align-items: flex-start;
            padding-top: 60px;
          }
          .auth-card { max-width: 480px; width: 100%; padding: 36px 28px; }
        }

        @media (max-width: 480px) {
          .auth-left { padding: 40px 16px; }
          .auth-card { padding: 28px 20px; border-radius: 16px; }
          .card-header h2 { font-size: 22px; }
          .field input { padding: 12px 14px; font-size: 14px; }
          .btn-primary { padding: 14px; font-size: 14px; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-bg" />
        <div className="grid-overlay" />

        <div className="auth-left">
          <div className="auth-card">
            <div className="brand-mark">
              <div className="brand-icon">💰</div>
              <div className="brand-name">Smart<span>Spend</span></div>
            </div>

            <div className="card-header">
              <h2>Create account</h2>
              <p>Start tracking your expenses today — it's free</p>
            </div>

            <form onSubmit={handleRegister}>
              <div className="field">
                <label>Full Name</label>
                <input
                  placeholder="Kirtan Shah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <p className="password-hint">Minimum 8 characters recommended</p>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")}>Sign in</button>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="perks">
            <h3>Why SmartSpend?</h3>
            <div className="perk-list">
              <div className="perk">
                <div className="perk-icon">📊</div>
                <div className="perk-text">
                  <h4>Visual Analytics</h4>
                  <p>See exactly where your money goes with beautiful charts and category breakdowns.</p>
                </div>
              </div>
              <div className="perk">
                <div className="perk-icon">⚡</div>
                <div className="perk-text">
                  <h4>Add in Seconds</h4>
                  <p>Log any expense in under 5 seconds. No complicated forms, no friction.</p>
                </div>
              </div>
              <div className="perk">
                <div className="perk-icon">🔒</div>
                <div className="perk-text">
                  <h4>Private & Secure</h4>
                  <p>Your data is yours. Secured with JWT authentication and encrypted storage.</p>
                </div>
              </div>
              <div className="perk">
                <div className="perk-icon">🎯</div>
                <div className="perk-text">
                  <h4>Built for Students</h4>
                  <p>Designed around how students actually spend — food, travel, stationery and more.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;