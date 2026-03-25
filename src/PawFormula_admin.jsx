import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kitaribnmqztxbogszga.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NnN7NxcOFtEXBdwslFZMjA_4COsQQNw";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const C = {
  sage: "#7A9E7E", sageL: "#EBF2EC", sageD: "#4A7150",
  earth: "#C4956A", earthL: "#F5EDE3",
  cream: "#FAF7F2", white: "#FFFDF9",
  border: "#E8E2D9", mid: "#6B6B6B", light: "#B0ADA8", dark: "#2C2C2C",
};

const STATUS_COLORS = {
  pending:   { bg: "#FEF3C7", color: "#92400E", label: "待處理" },
  confirmed: { bg: "#DBEAFE", color: "#1E40AF", label: "已確認" },
  shipped:   { bg: "#EDE9FE", color: "#5B21B6", label: "已出貨" },
  delivered: { bg: "#D1FAE5", color: "#065F46", label: "已送達" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "已取消" },
};

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
      {s.label}
    </span>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const ADMIN_PW = "pawformula2024";
  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans TC', sans-serif" }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "40px 36px", width: 360 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 600, color: C.dark, marginBottom: 4 }}>
          Paw<span style={{ color: C.sage }}>Formula</span>
        </div>
        <div style={{ fontSize: 13, color: C.mid, marginBottom: 28 }}>後台管理系統</div>
        {error && <div style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 14 }}>密碼錯誤，請再試一次</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: C.dark, display: "block", marginBottom: 6 }}>管理員密碼</label>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (pw === ADMIN_PW ? onLogin() : setError(true))}
            placeholder="輸入密碼"
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: C.dark, background: C.cream, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button onClick={() => pw === ADMIN_PW ? onLogin() : setError(true)}
          style={{ width: "100%", padding: 12, background: C.sage, color: "white", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          登入
        </button>
        <div style={{ fontSize: 11, color: C.light, textAlign: "center", marginTop: 12 }}>預設密碼：pawformula2024</div>
      </div>
    </div>
  );
}

// ── ORDER DETAIL MODAL ────────────────────────────────────────────
function OrderModal({ order, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(order.id, status);
    setSaving(false);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, fontFamily: "'Noto Sans TC', sans-serif" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 32, width: 480, maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500 }}>訂單詳情</div>
          <div onClick={onClose} style={{ cursor: "pointer", fontSize: 20, color: C.light }}>✕</div>
        </div>

        {/* Customer info */}
        <div style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>👤 客戶資料</div>
          <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.9 }}>
            <div>姓名：<span style={{ color: C.dark, fontWeight: 500 }}>{order.customers?.name}</span></div>
            <div>電話：{order.customers?.phone}</div>
            <div>Email：{order.customers?.email}</div>
            <div>地址：台北市{order.customers?.district} {order.customers?.address}</div>
            {order.customers?.note && <div>備註：{order.customers?.note}</div>}
          </div>
        </div>

        {/* Order items */}
        <div style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>🛒 訂購內容</div>
          {order.order_items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingBottom: 6, marginBottom: 6, borderBottom: i < order.order_items.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span>{item.product_emoji} {item.product_name} {item.pet_name ? `（${item.pet_name}）` : ""}</span>
              <span style={{ fontWeight: 600, color: C.dark }}>NT${(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: C.sageD, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <span>總計</span><span style={{ color: C.sage }}>NT${order.total?.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment */}
        <div style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>💳 付款方式</div>
          <div style={{ fontSize: 13, color: C.mid }}>
            {{ credit: "信用卡 / 金融卡", linepay: "LINE Pay", atm: "ATM 轉帳" }[order.payment_method] || order.payment_method}
          </div>
        </div>

        {/* Status update */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 8 }}>更新訂單狀態</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: C.dark, background: C.cream, outline: "none" }}>
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: "0 0 auto", padding: "11px 20px", background: "white", color: C.mid, border: `1.5px solid ${C.border}`, borderRadius: 50, fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>取消</button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: 12, background: saving ? C.light : C.sage, color: "white", border: "none", borderRadius: 50, fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "儲存中…" : "儲存變更"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`*, customers(*), order_items(*)`)
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    await fetchOrders();
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <div style={{ fontFamily: "'Noto Sans TC', sans-serif", background: C.cream, minHeight: "100vh" }}>
      {/* Topbar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: C.dark }}>
          Paw<span style={{ color: C.sage }}>Formula</span>
          <span style={{ fontSize: 12, fontWeight: 400, color: C.mid, marginLeft: 10 }}>後台管理</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={fetchOrders} style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit" }}>
            🔄 重新整理
          </button>
          <button onClick={onLogout} style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit" }}>
            登出
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "總訂單數", value: orders.length, unit: "筆" },
            { label: "總營收", value: `NT$${totalRevenue.toLocaleString()}`, unit: "" },
            { label: "待處理", value: pendingCount, unit: "筆", alert: pendingCount > 0 },
            { label: "本月新客", value: orders.filter(o => new Date(o.created_at).getMonth() === new Date().getMonth()).length, unit: "位" },
          ].map((m, i) => (
            <div key={i} style={{ background: m.alert ? "#FEF3C7" : C.white, border: `1px solid ${m.alert ? "#FCD34D" : C.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: C.mid, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: m.alert ? "#92400E" : C.dark }}>{m.value}{m.unit && <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 3 }}>{m.unit}</span>}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {[["all", "全部"], ...Object.entries(STATUS_COLORS).map(([k, v]) => [k, v.label])].map(([key, label]) => (
            <div key={key} onClick={() => setFilter(key)}
              style={{ padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", border: `1.5px solid ${filter === key ? C.sage : C.border}`, background: filter === key ? C.sageL : C.white, color: filter === key ? C.sageD : C.mid, transition: "all .15s" }}>
              {label} {key !== "all" && `(${orders.filter(o => o.status === key).length})`}
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: C.mid, fontSize: 14 }}>載入中…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: C.mid, fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🐾</div>
              還沒有訂單
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["下單時間", "客戶", "訂購內容", "總計", "付款方式", "狀態", ""].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.mid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.cream}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: C.mid, whiteSpace: "nowrap" }}>
                      {new Date(order.created_at).toLocaleDateString("zh-TW")}<br />
                      <span style={{ fontSize: 11 }}>{new Date(order.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{order.customers?.name}</div>
                      <div style={{ fontSize: 11, color: C.mid }}>{order.customers?.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: C.mid, maxWidth: 180 }}>
                      {order.order_items?.map((item, j) => (
                        <div key={j}>{item.product_emoji} {item.product_name}</div>
                      ))}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: C.dark, whiteSpace: "nowrap" }}>
                      NT${order.total?.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: C.mid }}>
                      {{ credit: "信用卡", linepay: "LINE Pay", atm: "ATM" }[order.payment_method] || order.payment_method}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge status={order.status} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => setSelected(order)}
                        style={{ fontSize: 12, padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                        查看 →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} />}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────
export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <Dashboard onLogout={() => setLoggedIn(false)} /> : <LoginPage onLogin={() => setLoggedIn(true)} />;
}
