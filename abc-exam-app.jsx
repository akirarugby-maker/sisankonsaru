/*
========================================
💹 ABCコンサルタント試験アプリ - ビルド進捗
========================================
フェーズ1:  基盤・デザインシステム        [✅]
フェーズ2:  計算コンポーネント・公式データ [ ]
フェーズ3:  倫理・基礎データ定義          [ ]
フェーズ4:  PF・金融商品データ            [ ]
フェーズ5:  共通コンポーネント            [ ]
フェーズ6:  ホーム画面                   [ ]
フェーズ7:  ①顧客本位・倫理タブ          [ ]
フェーズ8:  ②資産運用の基礎タブ 前半     [ ]
フェーズ9:  ②資産運用の基礎タブ 後半     [ ]
フェーズ10: ③ポートフォリオ理論タブ      [ ]
フェーズ11: ④金融商品タブ               [ ]
フェーズ12: ⑤ケーススタディタブ          [ ]
フェーズ13: ⑥苦手分析タブ               [ ]
フェーズ14: AI機能（モック）統合         [ ]
フェーズ15: 仕上げ・模擬試験・結合       [ ]
========================================
*/

import { useState, useEffect, useCallback } from "react";
import {
  Search, BookOpen, Calculator, BarChart2, Home, TrendingUp,
  PieChart, DollarSign, Shield, RefreshCw, Check, ChevronRight,
  Award, AlertTriangle, Percent, Activity
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Area, AreaChart
} from "recharts";

// ============================================================
// デザイントークン
// ============================================================
const COLORS = {
  primary:   "#4A90D9",
  secondary: "#50C878",
  accent:    "#FFB347",
  highlight: "#9B59B6",
  danger:    "#E74C3C",
  bg:        "#FFFFFF",
  text:      "#2C3E50",
  cardBg:    "#F8FAFE",
  border:    "#D5E8F8",
  textLight: "#7F8C8D",
  textMuted: "#BDC3C7",
};

const STYLES = {
  card: {
    background: COLORS.cardBg,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(74,144,217,0.15)",
    padding: 16,
  },
  cardLg: {
    background: COLORS.cardBg,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 24,
    boxShadow: "0 4px 16px rgba(74,144,217,0.2)",
    padding: 20,
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${COLORS.primary}, #357ABD)`,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 3px 10px rgba(74,144,217,0.35)",
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  btnSecondary: {
    background: `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)`,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 3px 10px rgba(80,200,120,0.35)",
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  btnAccent: {
    background: `linear-gradient(135deg, ${COLORS.accent}, #E8922A)`,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 3px 10px rgba(255,179,71,0.35)",
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  btnOutline: {
    background: "transparent",
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: 12,
    padding: "8px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  input: {
    background: "#fff",
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "9px 13px",
    fontSize: 14,
    color: COLORS.text,
    outline: "none",
    fontFamily: "'Noto Sans JP', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  badge: (color) => ({
    display: "inline-block",
    background: color + "22",
    color: color,
    borderRadius: 8,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 700,
  }),
  sectionTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: COLORS.text,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: 600,
    marginBottom: 4,
    display: "block",
  },
};

// ============================================================
// グローバル状態の初期値
// ============================================================
const INITIAL_PROGRESS = {
  ethics:    { A: false, B: false, C: false },
  basics:    { A: false, B: false, C: false, D: false, E: false },
  portfolio: { A: false, B: false, C: false, D: false },
  products:  { A: false, B: false, C: false, D: false, E: false },
  casestudy: { A: false, B: false, C: false },
  analysis:  { analyzed: false },
};

const INITIAL_STATE = {
  examDate:     "",
  progress:     INITIAL_PROGRESS,
  testHistory:  [],
  calcHistory:  [],
  reviewStatus: {},
};

const STORAGE_KEY = "abc-exam-app-data";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...saved,
      progress: { ...INITIAL_PROGRESS, ...saved.progress },
    };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ============================================================
// タブ定義
// ============================================================
const TABS = [
  {
    id:    "home",
    label: "ホーム",
    icon:  Home,
    color: COLORS.primary,
  },
  {
    id:    "ethics",
    label: "①顧客本位",
    icon:  Shield,
    color: COLORS.secondary,
    short: "倫理",
  },
  {
    id:    "basics",
    label: "②基礎",
    icon:  BookOpen,
    color: COLORS.accent,
    short: "基礎",
  },
  {
    id:    "portfolio",
    label: "③PF理論",
    icon:  TrendingUp,
    color: COLORS.highlight,
    short: "PF",
  },
  {
    id:    "products",
    label: "④金融商品",
    icon:  DollarSign,
    color: "#E67E22",
    short: "商品",
  },
  {
    id:    "casestudy",
    label: "⑤ケース",
    icon:  Activity,
    color: "#16A085",
    short: "ケース",
  },
  {
    id:    "analysis",
    label: "⑥苦手分析",
    icon:  BarChart2,
    color: COLORS.danger,
    short: "分析",
  },
];

// ============================================================
// ナビゲーションバー
// ============================================================
function NavigationBar({ activeTab, onTabChange }) {
  return (
    <nav
      style={{
        position:        "fixed",
        bottom:          0,
        left:            0,
        right:           0,
        background:      "#fff",
        borderTop:       `2px solid ${COLORS.border}`,
        display:         "flex",
        justifyContent:  "space-around",
        alignItems:      "center",
        padding:         "6px 0 8px",
        zIndex:          1000,
        boxShadow:       "0 -4px 16px rgba(74,144,217,0.12)",
      }}
    >
      {TABS.map((tab) => {
        const Icon   = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background:    "none",
              border:        "none",
              cursor:        "pointer",
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              gap:           3,
              padding:       "4px 6px",
              borderRadius:  10,
              transition:    "all 0.18s ease",
              minWidth:      44,
            }}
          >
            <div
              style={{
                width:        32,
                height:       32,
                borderRadius: 10,
                background:   active ? tab.color + "22" : "transparent",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                transition:   "all 0.18s ease",
              }}
            >
              <Icon size={18} color={active ? tab.color : COLORS.textMuted} />
            </div>
            <span
              style={{
                fontSize:   10,
                fontWeight: active ? 800 : 500,
                color:      active ? tab.color : COLORS.textMuted,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {tab.short || tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ============================================================
// ページヘッダー
// ============================================================
function PageHeader({ title, subtitle, color = COLORS.primary, icon: Icon }) {
  return (
    <div
      style={{
        background:   `linear-gradient(135deg, ${color}18, ${color}08)`,
        border:       `1.5px solid ${color}33`,
        borderRadius: 20,
        padding:      "16px 20px",
        marginBottom: 16,
        display:      "flex",
        alignItems:   "center",
        gap:          14,
      }}
    >
      {Icon && (
        <div
          style={{
            width:          48,
            height:         48,
            borderRadius:   14,
            background:     color + "25",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
        >
          <Icon size={24} color={color} />
        </div>
      )}
      <div>
        <div
          style={{
            fontSize:   19,
            fontWeight: 800,
            color:      COLORS.text,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize:   13,
              color:      COLORS.textLight,
              marginTop:  4,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// プレースホルダータブ（フェーズ2以降で実装）
// ============================================================
function PlaceholderTab({ tab }) {
  const Icon = tab.icon;
  return (
    <div style={{ padding: "24px 16px", textAlign: "center" }}>
      <PageHeader
        title={tab.label}
        subtitle="このタブは準備中です"
        color={tab.color}
        icon={Icon}
      />
      <div
        style={{
          ...STYLES.cardLg,
          textAlign: "center",
          padding:   40,
          color:     COLORS.textLight,
        }}
      >
        <Icon size={48} color={tab.color + "66"} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
          フェーズ2以降で実装予定
        </div>
        <div style={{ fontSize: 13 }}>
          内容：{tab.label}に関する学習コンテンツ・電卓・テスト
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ホーム画面（フェーズ6で詳細実装・ここは骨格のみ）
// ============================================================
function HomeTab({ state, setState, onTabChange }) {
  const daysLeft = (() => {
    if (!state.examDate) return null;
    const diff = new Date(state.examDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const totalSections = Object.values(INITIAL_PROGRESS).reduce(
    (acc, sec) => acc + Object.keys(sec).length, 0
  );
  const doneSections = Object.entries(state.progress).reduce(
    (acc, [tab, secs]) =>
      acc + Object.values(secs).filter(Boolean).length,
    0
  );
  const progressPct = Math.round((doneSections / totalSections) * 100);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      {/* タイトルバナー */}
      <div
        style={{
          background:   `linear-gradient(135deg, ${COLORS.primary}, #357ABD)`,
          borderRadius: 20,
          padding:      "20px 20px 16px",
          marginBottom: 16,
          color:        "#fff",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 4 }}>
          💹 試験勉強アプリ
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.3 }}>
          資産形成コンサルタント<br />（ABC）資格試験
        </div>
        <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>
          日本証券アナリスト協会 ／ CBT方式 ／ 4肢択一40問
        </div>
      </div>

      {/* 受験日設定 */}
      <div style={{ ...STYLES.card, marginBottom: 12 }}>
        <div style={STYLES.sectionTitle}>
          <Award size={18} color={COLORS.accent} /> 目標受験日
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="date"
            value={state.examDate}
            onChange={(e) =>
              setState((s) => ({ ...s, examDate: e.target.value }))
            }
            style={{ ...STYLES.input, width: 160 }}
          />
          {daysLeft !== null && (
            <span
              style={{
                ...STYLES.badge(
                  daysLeft <= 7
                    ? COLORS.danger
                    : daysLeft <= 30
                    ? COLORS.accent
                    : COLORS.secondary
                ),
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              残り {daysLeft} 日
            </span>
          )}
        </div>
      </div>

      {/* 学習進捗 */}
      <div style={{ ...STYLES.card, marginBottom: 12 }}>
        <div style={STYLES.sectionTitle}>
          <BarChart2 size={18} color={COLORS.primary} /> 学習進捗
        </div>
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              height:       10,
              background:   COLORS.border,
              borderRadius: 10,
              overflow:     "hidden",
            }}
          >
            <div
              style={{
                height:       "100%",
                width:        `${progressPct}%`,
                background:   `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                borderRadius: 10,
                transition:   "width 0.4s ease",
              }}
            />
          </div>
          <div
            style={{
              fontSize:   12,
              color:      COLORS.textLight,
              marginTop:  4,
              textAlign:  "right",
            }}
          >
            {doneSections} / {totalSections} セクション完了（{progressPct}%）
          </div>
        </div>

        {/* タブ別進捗リスト */}
        {TABS.filter((t) => t.id !== "home").map((tab) => {
          const secs  = state.progress[tab.id] || {};
          const keys  = Object.keys(secs);
          const done  = Object.values(secs).filter(Boolean).length;
          const color = tab.color;
          return (
            <div
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           10,
                padding:       "7px 0",
                borderBottom:  `1px solid ${COLORS.border}`,
                cursor:        "pointer",
              }}
            >
              <tab.icon size={15} color={color} />
              <span
                style={{
                  flex:       1,
                  fontSize:   13,
                  fontWeight: 600,
                  color:      COLORS.text,
                }}
              >
                {tab.label}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {keys.map((k) => (
                  <div
                    key={k}
                    style={{
                      width:        18,
                      height:       18,
                      borderRadius: 6,
                      background:   secs[k] ? color : COLORS.border,
                      display:      "flex",
                      alignItems:   "center",
                      justifyContent: "center",
                    }}
                  >
                    {secs[k] && <Check size={11} color="#fff" />}
                  </div>
                ))}
              </div>
              <span
                style={{
                  fontSize:   12,
                  color:      done === keys.length ? COLORS.secondary : COLORS.textLight,
                  fontWeight: 700,
                  minWidth:   36,
                  textAlign:  "right",
                }}
              >
                {done}/{keys.length}
              </span>
              <ChevronRight size={14} color={COLORS.textMuted} />
            </div>
          );
        })}
      </div>

      {/* 試験概要カード */}
      <div style={{ ...STYLES.card, marginBottom: 12 }}>
        <div style={STYLES.sectionTitle}>
          <BookOpen size={18} color={COLORS.primary} /> 試験概要
        </div>
        {[
          ["正式名称", "資産形成コンサルタント（ABC）資格試験"],
          ["主催",     "日本証券アナリスト協会"],
          ["試験方式", "CBT（コンピュータ試験）・全国約300会場"],
          ["出題形式", "4肢択一・40問"],
          ["試験時間", "60分"],
          ["合格基準", "60点以上（100点満点換算）"],
          ["受験料",   "9,900円（一般）"],
          ["受験資格", "特になし"],
          ["有効期限", "無期限（更新不要）"],
          ["難易度",   "FP2〜1級レベル"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display:      "flex",
              gap:          8,
              padding:      "5px 0",
              borderBottom: `1px solid ${COLORS.border}`,
              fontSize:     13,
            }}
          >
            <span style={{ color: COLORS.textLight, minWidth: 80, fontWeight: 600 }}>
              {k}
            </span>
            <span style={{ color: COLORS.text }}>{v}</span>
          </div>
        ))}
      </div>

      {/* クイックリセット */}
      <button
        style={{ ...STYLES.btnOutline, width: "100%", marginTop: 4 }}
        onClick={() => {
          if (window.confirm("学習進捗をリセットしますか？（テスト履歴も削除されます）")) {
            setState(INITIAL_STATE);
          }
        }}
      >
        <RefreshCw size={13} style={{ marginRight: 6 }} />
        進捗をリセット
      </button>
    </div>
  );
}

// ============================================================
// メインアプリ
// ============================================================
export default function ABCExamApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [state, setStateRaw] = useState(loadState);

  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  // フォントロード
  useEffect(() => {
    if (!document.getElementById("noto-sans-jp")) {
      const link   = document.createElement("link");
      link.id      = "noto-sans-jp";
      link.rel     = "stylesheet";
      link.href    =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeTab
            state={state}
            setState={setState}
            onTabChange={setActiveTab}
          />
        );
      default: {
        const tab = TABS.find((t) => t.id === activeTab);
        return tab ? <PlaceholderTab tab={tab} /> : null;
      }
    }
  };

  return (
    <div
      style={{
        fontFamily:      "'Noto Sans JP', 'Hiragino Sans', sans-serif",
        background:      COLORS.bg,
        minHeight:       "100vh",
        paddingBottom:   80,
        color:           COLORS.text,
        maxWidth:        480,
        margin:          "0 auto",
        position:        "relative",
      }}
    >
      {/* コンテンツエリア */}
      <main>{renderTab()}</main>

      {/* ナビゲーションバー */}
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
