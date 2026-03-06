import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Food", "Travel", "Stationery", "Shopping", "Entertainment", "Other"];

const CATEGORY_COLORS = {
  Food: "#63ebb2",
  Travel: "#63b8eb",
  Stationery: "#f0c96a",
  Shopping: "#eb63b8",
  Entertainment: "#a063eb",
  Other: "#eb9163",
};

const CATEGORY_ICONS = {
  Food: "🍔",
  Travel: "🚌",
  Stationery: "📚",
  Shopping: "🛍️",
  Entertainment: "🎮",
  Other: "📦",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data.data || []);
    } catch {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    setAdding(true);
    try {
      await API.post("/expenses", { title, amount: parseFloat(amount), category, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle(""); setAmount(""); setCategory("Food"); setNote("");
      setShowForm(false);
      fetchExpenses();
    } catch {
      setError("Failed to add expense.");
    } finally {
      setAdding(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch {
      setError("Failed to delete expense.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  const topCategory = useMemo(() => {
    if (!Object.keys(categoryTotals).length) return null;
    return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  }, [categoryTotals]);

  const filteredExpenses = useMemo(() =>
    filterCat === "All" ? expenses : expenses.filter((e) => e.category === filterCat),
    [expenses, filterCat]
  );

  // Simple donut chart using SVG
  const DonutChart = () => {
    if (!totalSpent) return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "160px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
        No data yet
      </div>
    );
    const r = 60, cx = 80, cy = 80, circumference = 2 * Math.PI * r;
    let offset = 0;
    const slices = Object.entries(categoryTotals).map(([cat, val]) => {
      const pct = val / totalSpent;
      const dash = pct * circumference;
      const slice = { cat, val, dash, offset, color: CATEGORY_COLORS[cat] || "#888" };
      offset += dash;
      return slice;
    });
    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
        {slices.map((s) => (
          <circle key={s.cat} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="20"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset + circumference / 4}
            style={{ transition: "all 0.5s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Syne, sans-serif" fontWeight="700">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#63ebb2" fontSize="11" fontFamily="DM Sans, sans-serif">
          {expenses.length} items
        </text>
      </svg>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body { background: #0a0a0f; }

        .dash-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .dash-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(99,235,178,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 90% 80%, rgba(99,180,235,0.04) 0%, transparent 55%);
          pointer-events: none;
        }

        /* NAVBAR */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          background: rgba(10,10,15,0.9);
          backdrop-filter: blur(20px);
          z-index: 100;
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #63ebb2, #3db88a);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }

        .brand-name span { color: #63ebb2; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-add {
          padding: 9px 18px;
          background: linear-gradient(135deg, #63ebb2, #3db88a);
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0f;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,235,178,0.2); }

        .btn-logout {
          padding: 9px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout:hover { color: #fff; background: rgba(255,255,255,0.08); }

        /* LAYOUT */
        .dash-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .page-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 32px;
        }

        /* STATS ROW */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px 24px;
          transition: all 0.2s;
        }

        .stat-card:hover { border-color: rgba(99,235,178,0.15); transform: translateY(-2px); }

        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
          margin-bottom: 10px;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .stat-value.green { color: #63ebb2; }

        .stat-meta {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          margin-top: 6px;
        }

        /* MAIN GRID */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        /* EXPENSES LIST */
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
        }

        .panel-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
        }

        .filter-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pill {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .pill:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

        .pill.active {
          background: rgba(99,235,178,0.12);
          border-color: rgba(99,235,178,0.3);
          color: #63ebb2;
        }

        .expense-list { padding: 8px 0; }

        .expense-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .expense-item:last-child { border-bottom: none; }
        .expense-item:hover { background: rgba(255,255,255,0.02); }

        .exp-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.05);
        }

        .exp-info { flex: 1; min-width: 0; }

        .exp-title {
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .exp-meta {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }

        .exp-amount {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .btn-del {
          background: none;
          border: none;
          color: rgba(255,255,255,0.2);
          font-size: 16px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .btn-del:hover { color: #ff6b6b; background: rgba(255,80,80,0.1); }

        .empty-state {
          padding: 60px 24px;
          text-align: center;
          color: rgba(255,255,255,0.2);
        }

        .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
        .empty-state p { font-size: 14px; }

        /* SIDEBAR */
        .sidebar { display: flex; flex-direction: column; gap: 20px; }

        .chart-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px;
        }

        .chart-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 20px;
          color: rgba(255,255,255,0.8);
        }

        .chart-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .legend { display: flex; flex-direction: column; gap: 10px; }

        .legend-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .legend-left { display: flex; align-items: center; gap: 8px; }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-cat { color: rgba(255,255,255,0.6); }
        .legend-amount { color: rgba(255,255,255,0.4); font-size: 12px; }

        /* ADD EXPENSE MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal {
          width: 100%;
          max-width: 460px;
          background: #13131a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 36px 32px;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
        }

        .btn-close {
          background: rgba(255,255,255,0.06);
          border: none;
          color: rgba(255,255,255,0.5);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .btn-close:hover { background: rgba(255,80,80,0.15); color: #ff6b6b; }

        .form-field {
          margin-bottom: 18px;
        }

        .form-field label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
        }

        .form-field input::placeholder,
        .form-field textarea::placeholder { color: rgba(255,255,255,0.2); }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #63ebb2;
          background: rgba(99,235,178,0.04);
          box-shadow: 0 0 0 3px rgba(99,235,178,0.08);
        }

        .form-field select option { background: #13131a; color: #fff; }

        .form-field textarea { resize: none; height: 80px; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .cat-btn {
          padding: 10px 8px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          text-align: center;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .cat-btn .cat-emoji { font-size: 18px; }
        .cat-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
        .cat-btn.selected {
          border-color: rgba(99,235,178,0.4);
          background: rgba(99,235,178,0.08);
          color: #63ebb2;
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #63ebb2, #3db88a);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0f;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .btn-submit:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(99,235,178,0.25); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: rgba(255,80,80,0.15);
          border: 1px solid rgba(255,80,80,0.3);
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 14px;
          color: #ff8080;
          z-index: 300;
        }

        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          color: rgba(255,255,255,0.3);
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {loading ? (
        <div className="loading-screen">Loading your expenses...</div>
      ) : (
        <div className="dash-root">
          <div className="dash-bg" />

          {/* NAVBAR */}
          <nav className="navbar">
            <div className="brand-mark">
              <div className="brand-icon">💰</div>
              <div className="brand-name">Smart<span>Spend</span></div>
            </div>
            <div className="nav-right">
              <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Expense</button>
              <button className="btn-logout" onClick={handleLogout}>Log out</button>
            </div>
          </nav>

          <div className="dash-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Track and manage your daily expenses</p>

            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Spent</div>
                <div className="stat-value green">{formatCurrency(totalSpent)}</div>
                <div className="stat-meta">All time</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{expenses.length}</div>
                <div className="stat-meta">Recorded expenses</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Top Category</div>
                <div className="stat-value" style={{ fontSize: "20px" }}>
                  {topCategory ? `${CATEGORY_ICONS[topCategory[0]] || "📦"} ${topCategory[0]}` : "—"}
                </div>
                <div className="stat-meta">
                  {topCategory ? formatCurrency(topCategory[1]) : "No data yet"}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Avg per Expense</div>
                <div className="stat-value">
                  {expenses.length ? formatCurrency(totalSpent / expenses.length) : "—"}
                </div>
                <div className="stat-meta">Per transaction</div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="main-grid">
              {/* EXPENSES */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Expenses</span>
                  <div className="filter-pills">
                    {["All", ...CATEGORIES].map((c) => (
                      <button
                        key={c}
                        className={`pill ${filterCat === c ? "active" : ""}`}
                        onClick={() => setFilterCat(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="expense-list">
                  {filteredExpenses.length === 0 ? (
                    <div className="empty-state">
                      <div className="icon">💸</div>
                      <p>No expenses yet. Add your first one!</p>
                    </div>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <div className="expense-item" key={exp._id}>
                        <div className="exp-icon">
                          {CATEGORY_ICONS[exp.category] || "📦"}
                        </div>
                        <div className="exp-info">
                          <div className="exp-title">{exp.title}</div>
                          <div className="exp-meta">
                            {exp.category} · {formatDate(exp.date || exp.createdAt)}
                          </div>
                        </div>
                        <div className="exp-amount">{formatCurrency(exp.amount)}</div>
                        <button className="btn-del" onClick={() => deleteExpense(exp._id)}>✕</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="sidebar">
                <div className="chart-panel">
                  <div className="chart-title">Spending by Category</div>
                  <div className="chart-wrap"><DonutChart /></div>
                  <div className="legend">
                    {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                      <div className="legend-item" key={cat}>
                        <div className="legend-left">
                          <div className="legend-dot" style={{ background: CATEGORY_COLORS[cat] || "#888" }} />
                          <span className="legend-cat">{cat}</span>
                        </div>
                        <span className="legend-amount">{formatCurrency(val)}</span>
                      </div>
                    ))}
                    {Object.keys(categoryTotals).length === 0 && (
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Add expenses to see breakdown</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ADD EXPENSE MODAL */}
          {showForm && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
              <div className="modal">
                <div className="modal-header">
                  <span className="modal-title">New Expense</span>
                  <button className="btn-close" onClick={() => setShowForm(false)}>✕</button>
                </div>

                <form onSubmit={addExpense}>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Title</label>
                      <input
                        placeholder="e.g. Lunch"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Category</label>
                    <div className="cat-grid">
                      {CATEGORIES.map((c) => (
                        <button
                          type="button"
                          key={c}
                          className={`cat-btn ${category === c ? "selected" : ""}`}
                          onClick={() => setCategory(c)}
                        >
                          <span className="cat-emoji">{CATEGORY_ICONS[c]}</span>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Note (optional)</label>
                    <textarea
                      placeholder="Any extra details..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-submit" disabled={adding}>
                    {adding ? "Adding..." : "Add Expense →"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {error && <div className="error-toast">{error}</div>}
        </div>
      )}
    </>
  );
}
