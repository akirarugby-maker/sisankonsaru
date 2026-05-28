/*
========================================
💹 ABCコンサルタント試験アプリ - ビルド進捗
========================================
フェーズ1:  基盤・デザインシステム        [✅]
フェーズ2:  計算コンポーネント・公式データ [✅]
フェーズ3:  倫理・基礎データ定義          [✅]
フェーズ4:  PF・金融商品データ            [✅]
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
// フェーズ2: 計算コンポーネント・公式データ
// ============================================================

// --- StepDisplay: 計算ステップ表示 ---
function StepDisplay({ steps }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div
      style={{
        background:   "#F0F8FF",
        border:       `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding:      12,
        marginTop:    10,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 8 }}>
        計算過程
      </div>
      {steps.map((step, i) => (
        <div
          key={i}
          style={{
            display:      "flex",
            gap:          10,
            marginBottom: 5,
            alignItems:   "flex-start",
          }}
        >
          <span
            style={{
              minWidth:       22,
              height:         22,
              background:     COLORS.primary,
              color:          "#fff",
              borderRadius:   "50%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       11,
              fontWeight:     800,
              flexShrink:     0,
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>{step}</span>
        </div>
      ))}
    </div>
  );
}

// --- ResultCard: 計算結果表示 ---
function ResultCard({ label, value, unit = "", color = COLORS.primary, large = false }) {
  return (
    <div
      style={{
        background:    color + "12",
        border:        `2px solid ${color}44`,
        borderRadius:  14,
        padding:       large ? "16px 20px" : "12px 16px",
        textAlign:     "center",
        flex:          1,
      }}
    >
      <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 600, marginBottom: 4 }}>
        {label}
      </div>
      <div
        style={{
          fontSize:   large ? 28 : 22,
          fontWeight: 900,
          color:      color,
          lineHeight: 1,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: large ? 14 : 12, marginLeft: 3, fontWeight: 700 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// --- CalcComponent: 汎用電卓コンポーネント ---
function CalcComponent({
  formulaName,
  inputs,          // [{ label, key, unit, defaultValue, step, min, max }]
  calculate,       // (inputValues) => { results: [{label,value,unit,color}], steps: string[] }
  chartBuilder,    // (inputValues, result) => JSX | null
  accentColor = COLORS.primary,
}) {
  const defaultValues = Object.fromEntries(
    inputs.map((inp) => [inp.key, inp.defaultValue ?? ""])
  );
  const [values, setValues]     = useState(defaultValues);
  const [result, setResult]     = useState(null);
  const [showChart, setShowChart] = useState(false);

  const handleCalc = () => {
    try {
      const parsed = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, parseFloat(v)])
      );
      const valid = Object.values(parsed).every((v) => !isNaN(v));
      if (!valid) { setResult({ error: "すべての値を入力してください" }); return; }
      setResult(calculate(parsed));
    } catch (e) {
      setResult({ error: "計算エラー: " + e.message });
    }
  };

  const handleReset = () => {
    setValues(defaultValues);
    setResult(null);
    setShowChart(false);
  };

  return (
    <div style={{ ...STYLES.card, marginBottom: 12 }}>
      <div style={{ ...STYLES.sectionTitle, color: accentColor }}>
        <Calculator size={17} color={accentColor} /> {formulaName}
      </div>

      {/* 入力フィールド */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {inputs.map((inp) => (
          <div key={inp.key}>
            <label style={STYLES.label}>
              {inp.label}
              {inp.unit && <span style={{ color: COLORS.textMuted }}> ({inp.unit})</span>}
            </label>
            <input
              type="number"
              value={values[inp.key]}
              step={inp.step ?? "any"}
              min={inp.min}
              max={inp.max}
              onChange={(e) =>
                setValues((v) => ({ ...v, [inp.key]: e.target.value }))
              }
              style={STYLES.input}
            />
          </div>
        ))}
      </div>

      {/* ボタン */}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ ...STYLES.btnPrimary, flex: 1, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` }} onClick={handleCalc}>
          計算する
        </button>
        <button style={{ ...STYLES.btnOutline, color: accentColor, borderColor: accentColor }} onClick={handleReset}>
          リセット
        </button>
      </div>

      {/* エラー */}
      {result?.error && (
        <div
          style={{
            marginTop:    10,
            padding:      "8px 12px",
            background:   COLORS.danger + "18",
            border:       `1px solid ${COLORS.danger}44`,
            borderRadius: 10,
            fontSize:     13,
            color:        COLORS.danger,
          }}
        >
          {result.error}
        </div>
      )}

      {/* 結果 */}
      {result && !result.error && (
        <>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {result.results.map((r, i) => (
              <ResultCard
                key={i}
                label={r.label}
                value={r.value}
                unit={r.unit}
                color={r.color || accentColor}
                large={i === 0}
              />
            ))}
          </div>
          <StepDisplay steps={result.steps} />

          {/* グラフ切替 */}
          {chartBuilder && (
            <button
              style={{
                ...STYLES.btnOutline,
                color:       accentColor,
                borderColor: accentColor,
                width:       "100%",
                marginTop:   10,
                fontSize:    13,
              }}
              onClick={() => setShowChart((s) => !s)}
            >
              {showChart ? "グラフを隠す" : "グラフで確認"}
            </button>
          )}
          {showChart && chartBuilder && chartBuilder(
            Object.fromEntries(
              Object.entries(values).map(([k, v]) => [k, parseFloat(v)])
            ),
            result
          )}
        </>
      )}
    </div>
  );
}

// --- FormulaCard: 公式カード ---
function FormulaCard({ name, formula, variables, example, color = COLORS.primary, onOpenCalc }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        ...STYLES.card,
        marginBottom:  10,
        borderLeft:    `4px solid ${color}`,
        cursor:        "pointer",
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.text }}>{name}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={STYLES.badge(color)}>公式</span>
          <ChevronRight
            size={16}
            color={color}
            style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
          />
        </div>
      </div>

      {/* 公式文字列 */}
      <div
        style={{
          marginTop:    8,
          background:   color + "10",
          border:       `1px solid ${color}30`,
          borderRadius: 10,
          padding:      "8px 12px",
          fontFamily:   "monospace",
          fontSize:     14,
          color:        color,
          fontWeight:   700,
          letterSpacing: 0.5,
        }}
      >
        {formula}
      </div>

      {/* 展開部分 */}
      {expanded && (
        <div style={{ marginTop: 10 }}>
          {/* 変数説明 */}
          {variables && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textLight, marginBottom: 6 }}>
                変数の意味
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {variables.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color:      color,
                        minWidth:   40,
                      }}
                    >
                      {v.symbol}
                    </span>
                    <span style={{ color: COLORS.text }}>{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 計算例 */}
          {example && (
            <div
              style={{
                background:   COLORS.secondary + "12",
                border:       `1px solid ${COLORS.secondary}33`,
                borderRadius: 10,
                padding:      "10px 12px",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.secondary, marginBottom: 6 }}>
                計算例
              </div>
              {example.inputs && (
                <div style={{ fontSize: 13, color: COLORS.text, marginBottom: 4 }}>
                  {example.inputs}
                </div>
              )}
              {example.steps && (
                <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>
                  {example.steps}
                </div>
              )}
              {example.output && (
                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.secondary }}>
                  → {example.output}
                </div>
              )}
            </div>
          )}

          {/* 電卓へのリンク */}
          {onOpenCalc && (
            <button
              style={{ ...STYLES.btnSecondary, width: "100%", marginTop: 10, fontSize: 13 }}
              onClick={(e) => { e.stopPropagation(); onOpenCalc(); }}
            >
              <Calculator size={13} style={{ marginRight: 6 }} />
              電卓で計算してみる
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// --- ExamTipCard: 試験頻出ポイントカード ---
function ExamTipCard({ tips, color = COLORS.accent }) {
  return (
    <div
      style={{
        ...STYLES.card,
        borderLeft:   `4px solid ${color}`,
        marginBottom: 12,
      }}
    >
      <div style={{ ...STYLES.sectionTitle, fontSize: 14, color }}>
        <AlertTriangle size={15} color={color} /> 試験頻出ポイント
      </div>
      {tips.map((tip, i) => (
        <div
          key={i}
          style={{
            display:      "flex",
            gap:          8,
            marginBottom: 6,
            alignItems:   "flex-start",
          }}
        >
          <span
            style={{
              minWidth:       20,
              height:         20,
              background:     color,
              color:          "#fff",
              borderRadius:   "50%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       10,
              fontWeight:     800,
              flexShrink:     0,
            }}
          >
            !
          </span>
          <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

// --- SectionTab: タブ内セクション切替 ---
function SectionTab({ sections, activeSection, onSelect, color }) {
  return (
    <div
      style={{
        display:        "flex",
        gap:            6,
        overflowX:      "auto",
        marginBottom:   14,
        paddingBottom:  4,
        scrollbarWidth: "none",
      }}
    >
      {sections.map((sec) => (
        <button
          key={sec.id}
          onClick={() => onSelect(sec.id)}
          style={{
            background:   activeSection === sec.id ? color : "transparent",
            color:        activeSection === sec.id ? "#fff" : COLORS.textLight,
            border:       `1.5px solid ${activeSection === sec.id ? color : COLORS.border}`,
            borderRadius: 20,
            padding:      "6px 14px",
            cursor:       "pointer",
            fontSize:     12,
            fontWeight:   700,
            whiteSpace:   "nowrap",
            transition:   "all 0.18s ease",
            fontFamily:   "'Noto Sans JP', sans-serif",
          }}
        >
          {sec.label}
        </button>
      ))}
    </div>
  );
}

// --- ChartCard: グラフラッパー ---
function ChartCard({ title, height = 200, children, color = COLORS.primary }) {
  return (
    <div style={{ ...STYLES.card, marginBottom: 12 }}>
      {title && (
        <div style={{ ...STYLES.sectionTitle, fontSize: 14, marginBottom: 10 }}>
          <BarChart2 size={15} color={color} /> {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

// --- InfoBox: 解説・定義ボックス ---
function InfoBox({ title, children, color = COLORS.primary }) {
  return (
    <div
      style={{
        background:   color + "0C",
        border:       `1.5px solid ${color}33`,
        borderRadius: 14,
        padding:      "12px 14px",
        marginBottom: 10,
      }}
    >
      {title && (
        <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 6 }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

// --- 公式データ定義 ---
const FORMULA_DATA = {
  // リターン計算
  simpleReturn: {
    name: "単純リターン（保有期間リターン）",
    formula: "R = (期末価格 - 期初価格 + 配当) / 期初価格 × 100",
    variables: [
      { symbol: "R",    meaning: "リターン（%）" },
      { symbol: "期末価格", meaning: "売却時または期末の価格" },
      { symbol: "期初価格", meaning: "購入時または期初の価格" },
      { symbol: "配当",  meaning: "期間中に受け取った配当金" },
    ],
    example: {
      inputs:  "期初100円 → 期末110円、配当2円",
      steps:   "(110 - 100 + 2) / 100 × 100",
      output:  "リターン = 12%",
    },
  },
  annualReturn: {
    name: "年率リターン（複利換算）",
    formula: "年率R = (1 + 保有期間R)^(1/年数) - 1",
    variables: [
      { symbol: "年率R",    meaning: "1年当たりの平均リターン" },
      { symbol: "保有期間R", meaning: "保有期間全体のリターン（小数）" },
      { symbol: "年数",     meaning: "保有年数" },
    ],
    example: {
      inputs:  "3年間で保有期間リターン33.1%",
      steps:   "(1 + 0.331)^(1/3) - 1",
      output:  "年率リターン ≈ 10%",
    },
  },
  geoMean: {
    name: "幾何平均リターン（複利ベース）",
    formula: "Rg = ((1+R1)×(1+R2)×…×(1+Rn))^(1/n) - 1",
    variables: [
      { symbol: "Rg",     meaning: "幾何平均リターン" },
      { symbol: "R1…Rn", meaning: "各期間のリターン（小数）" },
      { symbol: "n",      meaning: "期間数" },
    ],
    example: {
      inputs:  "3年間: +20%, -10%, +15%",
      steps:   "(1.20 × 0.90 × 1.15)^(1/3) - 1",
      output:  "幾何平均 ≈ 7.78%",
    },
  },
  // リスク計算
  stdDev: {
    name: "標準偏差（リスク）",
    formula: "σ = √(Σ(Ri - Ra)² / n)",
    variables: [
      { symbol: "σ",  meaning: "標準偏差（リスク）" },
      { symbol: "Ri", meaning: "各期間のリターン" },
      { symbol: "Ra", meaning: "平均リターン" },
      { symbol: "n",  meaning: "データ数" },
    ],
    example: {
      inputs:  "リターン: 10%, 20%, -5%, 15%（平均10%）",
      steps:   "√((0²+100+225+25)/4) = √87.5",
      output:  "σ ≈ 9.35%",
    },
  },
  correlation: {
    name: "相関係数",
    formula: "ρ(A,B) = Cov(A,B) / (σA × σB)",
    variables: [
      { symbol: "ρ",       meaning: "相関係数（-1 ≤ ρ ≤ 1）" },
      { symbol: "Cov(A,B)", meaning: "2資産の共分散" },
      { symbol: "σA, σB",  meaning: "各資産の標準偏差" },
    ],
    example: {
      inputs:  "Cov=0.006, σA=10%, σB=8%",
      steps:   "0.006 / (0.10 × 0.08)",
      output:  "ρ = 0.75",
    },
  },
  // 現在価値
  pv: {
    name: "現在価値（PV）",
    formula: "PV = FV / (1 + r)^n",
    variables: [
      { symbol: "PV", meaning: "現在価値" },
      { symbol: "FV", meaning: "将来価値（Future Value）" },
      { symbol: "r",  meaning: "割引率（年率）" },
      { symbol: "n",  meaning: "期間（年）" },
    ],
    example: {
      inputs:  "5年後の100万円、割引率3%",
      steps:   "1,000,000 / (1.03)^5",
      output:  "PV ≈ 862,609円",
    },
  },
  // CAPM
  capm: {
    name: "CAPM（資本資産評価モデル）",
    formula: "E(Ri) = Rf + βi × [E(Rm) - Rf]",
    variables: [
      { symbol: "E(Ri)", meaning: "資産iの期待リターン" },
      { symbol: "Rf",    meaning: "リスクフリーレート（無リスク資産利回り）" },
      { symbol: "βi",   meaning: "資産iのベータ値（市場感応度）" },
      { symbol: "E(Rm)", meaning: "市場ポートフォリオの期待リターン" },
    ],
    example: {
      inputs:  "Rf=2%, β=1.2, 市場リターン=8%",
      steps:   "2% + 1.2 × (8% - 2%)",
      output:  "期待リターン = 9.2%",
    },
  },
  // シャープレシオ
  sharpe: {
    name: "シャープレシオ",
    formula: "SR = (Rp - Rf) / σp",
    variables: [
      { symbol: "SR", meaning: "シャープレシオ（高いほど効率的）" },
      { symbol: "Rp", meaning: "ポートフォリオのリターン" },
      { symbol: "Rf", meaning: "リスクフリーレート" },
      { symbol: "σp", meaning: "ポートフォリオの標準偏差" },
    ],
    example: {
      inputs:  "Rp=12%, Rf=2%, σp=15%",
      steps:   "(12% - 2%) / 15%",
      output:  "SR = 0.667",
    },
  },
  // ポートフォリオリスク
  portfolioRisk: {
    name: "2資産ポートフォリオのリスク",
    formula: "σP² = wA²σA² + wB²σB² + 2wA·wB·ρAB·σA·σB",
    variables: [
      { symbol: "σP",       meaning: "ポートフォリオの標準偏差" },
      { symbol: "wA, wB",   meaning: "各資産の投資比率（合計=1）" },
      { symbol: "σA, σB",   meaning: "各資産の標準偏差" },
      { symbol: "ρAB",      meaning: "2資産間の相関係数" },
    ],
    example: {
      inputs:  "wA=60%, σA=15%, wB=40%, σB=10%, ρ=0.3",
      steps:   "√(0.36×0.0225 + 0.16×0.01 + 2×0.6×0.4×0.3×0.15×0.1)",
      output:  "σP ≈ 10.7%",
    },
  },
};

// ============================================================
// フェーズ3: 倫理・基礎データ定義
// ============================================================

// --- FD 7原則 ---
const FD_PRINCIPLES = [
  {
    no: 1,
    title: "方針の策定・公表",
    detail: "顧客本位の業務運営に係る方針を策定・公表し、定期的に見直す。",
    keyword: "方針",
  },
  {
    no: 2,
    title: "顧客の最善の利益の追求",
    detail: "金融事業者は高度の専門性と職業倫理を保持し、顧客の最善の利益を図る行動をとる。",
    keyword: "最善の利益",
  },
  {
    no: 3,
    title: "利益相反の適切な管理",
    detail: "取引における利益相反の可能性について把握・管理し、顧客の利益が不当に害されることを防ぐ。",
    keyword: "利益相反",
  },
  {
    no: 4,
    title: "手数料等の明確化",
    detail: "名目を問わずあらゆる手数料・費用等について、顧客が理解できるよう情報提供する。",
    keyword: "手数料",
  },
  {
    no: 5,
    title: "重要な情報のわかりやすい提供",
    detail: "顧客の資産状況・取引経験・知識・目的等に照らして、重要な情報を分かりやすく提供する。",
    keyword: "情報提供",
  },
  {
    no: 6,
    title: "顧客にふさわしいサービスの提供",
    detail: "顧客の意向・状況等を踏まえ、最適なサービスを提案・提供する（適合性の原則）。",
    keyword: "適合性",
  },
  {
    no: 7,
    title: "従業員への適切な動機づけ",
    detail: "顧客本位の業務運営を促進するため、従業員に対する適切な動機づけの枠組みを整備する。",
    keyword: "動機づけ",
  },
];

// --- KYC（顧客情報収集）項目 ---
const KYC_ITEMS = [
  { icon: "👤", label: "基本属性",   items: ["年齢・性別", "家族構成", "職業・勤務先"] },
  { icon: "💰", label: "財務状況",   items: ["年収・収入源", "資産総額", "負債・ローン", "月々の支出"] },
  { icon: "📊", label: "投資経験",   items: ["投資経験年数", "保有商品種類", "過去の損失経験"] },
  { icon: "🎯", label: "投資目的",   items: ["投資目的（老後・教育等）", "投資期間", "必要流動性"] },
  { icon: "⚖️", label: "リスク許容度", items: ["損失許容額", "心理的耐性", "収入の安定性"] },
  { icon: "📋", label: "税務状況",   items: ["税率区分", "NISA口座有無", "iDeCo加入有無"] },
];

// --- NISA・iDeCoデータ ---
const TAX_ADVANTAGE_DATA = {
  nisa: {
    name: "新NISA（2024年〜）",
    color: COLORS.secondary,
    points: [
      { label: "つみたて投資枠", value: "年120万円" },
      { label: "成長投資枠",   value: "年240万円" },
      { label: "年間合計",     value: "年360万円" },
      { label: "生涯非課税枠", value: "1,800万円" },
      { label: "口座数",       value: "1人1口座" },
      { label: "非課税期間",   value: "無期限" },
      { label: "損益通算",     value: "不可（他口座との損益通算×）" },
    ],
    tips: [
      "つみたて投資枠と成長投資枠は併用可能",
      "生涯枠1,800万円のうち成長投資枠は最大1,200万円",
      "売却すると翌年に枠が復活する",
    ],
  },
  ideco: {
    name: "iDeCo（個人型確定拠出年金）",
    color: COLORS.highlight,
    points: [
      { label: "掛金",       value: "全額所得控除（節税効果大）" },
      { label: "運用益",     value: "非課税" },
      { label: "受取時",     value: "退職所得控除 or 公的年金等控除" },
      { label: "受取開始",   value: "60歳以降" },
      { label: "中途解約",   value: "原則不可（流動性リスク）" },
      { label: "拠出限度",   value: "職業・加入年金制度で異なる" },
    ],
    tips: [
      "自営業者（第1号）：月6.8万円まで",
      "会社員（企業年金なし）：月2.3万円まで",
      "公務員：月1.2万円まで",
    ],
  },
};

// --- 倫理タブ クイズデータ ---
const ETHICS_QUIZZES = {
  A: [
    {
      id: "e-a-1",
      q: "フィデューシャリーデューティーの説明として最も適切なものはどれか？",
      choices: [
        "金融機関が自社の利益を最大化するための義務",
        "顧客の最善の利益を最優先に考えた行動義務（受託者責任）",
        "規制当局への報告義務",
        "株主への利益還元義務",
      ],
      answer: 1,
      explanation: "フィデューシャリー（fiduciary）は「受託者」の意味。顧客から信頼を受けた者が顧客の最善の利益のために行動する義務です。",
      keyword: "フィデューシャリー",
    },
    {
      id: "e-a-2",
      q: "金融庁「顧客本位の業務運営に関する原則」が策定されたのはいつか？",
      choices: ["2010年", "2014年", "2017年", "2020年"],
      answer: 2,
      explanation: "2017年に金融庁が策定。プリンシプルベース（原則主義）のアプローチを採用しています。",
      keyword: "顧客本位原則",
    },
    {
      id: "e-a-3",
      q: "7原則のうち「利益相反の適切な管理」に該当する具体例はどれか？",
      choices: [
        "顧客の年齢に合わせた商品を選ぶこと",
        "販売手数料の高い商品を優先して販売していないか管理すること",
        "顧客に毎月レポートを送ること",
        "投資信託の基準価額を毎日確認すること",
      ],
      answer: 1,
      explanation: "自社の手数料収入と顧客の利益が相反する状況を適切に管理することが「利益相反管理」の典型例です。",
      keyword: "利益相反",
    },
    {
      id: "e-a-4",
      q: "顧客本位の7原則において「手数料等の明確化」に関する正しい記述はどれか？",
      choices: [
        "購入時手数料のみ開示すれば十分",
        "信託報酬は開示不要",
        "名目を問わずあらゆる手数料・費用を顧客が理解できるよう提供する",
        "手数料は競合他社と同水準であれば開示不要",
      ],
      answer: 2,
      explanation: "「名目を問わず」がポイント。購入時手数料・信託報酬・解約手数料など、すべての費用を明確にする必要があります。",
      keyword: "手数料開示",
    },
    {
      id: "e-a-5",
      q: "適合性の原則に照らして不適切な行動はどれか？",
      choices: [
        "リスク許容度が低い顧客に低リスク商品を提案する",
        "退職金を受け取った高齢者に元本保証商品を優先的に紹介する",
        "投資経験がない顧客にハイリスク・ハイリターン商品を積極的に販売する",
        "目標リターンと期間を確認した上で商品を提案する",
      ],
      answer: 2,
      explanation: "投資経験のない顧客にハイリスク商品を販売することは、適合性の原則（顧客の状況に見合った商品提案）に違反します。",
      keyword: "適合性の原則",
    },
    {
      id: "e-a-6",
      q: "KYC（Know Your Customer）の目的として最も適切なものはどれか？",
      choices: [
        "顧客から高い手数料を得るため",
        "顧客の状況・目的・リスク許容度を把握し、適切なサービスを提供するため",
        "マーケティングデータを収集するため",
        "税務当局への報告のため",
      ],
      answer: 1,
      explanation: "KYCは顧客の財務状況・投資目的・リスク許容度などを正確に把握することで、顧客に最適なサービスを提供するためのプロセスです。",
      keyword: "KYC",
    },
    {
      id: "e-a-7",
      q: "7原則の「従業員への適切な動機づけ」の目的として正しいものはどれか？",
      choices: [
        "売上目標を達成するよう従業員を激励すること",
        "顧客本位の業務運営を促進するための報酬体系・評価体制を整備すること",
        "従業員の昇給を保証すること",
        "残業を削減すること",
      ],
      answer: 1,
      explanation: "顧客本位の行動を促すインセンティブ設計（例：販売額ではなく顧客満足度で評価）が「従業員への適切な動機づけ」の趣旨です。",
      keyword: "従業員動機づけ",
    },
    {
      id: "e-a-8",
      q: "フィデューシャリーデューティーとプリンシプルベースアプローチの関係について正しいものはどれか？",
      choices: [
        "金融庁は細かなルールを設けてルールベースで規制している",
        "7原則は法的拘束力があり違反すると罰則がある",
        "7原則は原則主義（プリンシプルベース）で、各社が自主的に遵守状況を公表する",
        "7原則はEUのMiFID IIと全く同じ内容である",
      ],
      answer: 2,
      explanation: "日本の顧客本位原則はプリンシプルベース（原則主義）を採用。各金融事業者が自ら方針を策定・公表し、実践状況を開示します。直接の罰則はありません。",
      keyword: "プリンシプルベース",
    },
  ],

  B: [
    {
      id: "e-b-1",
      q: "ライフプランニングの基本ステップとして正しい順序はどれか？",
      choices: [
        "ゴール設定 → 現状把握 → ギャップ分析 → 解決策提案 → 実行・モニタリング",
        "現状把握 → ゴール設定 → 解決策提案 → ギャップ分析 → 実行・モニタリング",
        "解決策提案 → ゴール設定 → 現状把握 → ギャップ分析 → 実行・モニタリング",
        "ゴール設定 → ギャップ分析 → 現状把握 → 解決策提案 → 実行・モニタリング",
      ],
      answer: 0,
      explanation: "まずゴールを設定し、次に現状を把握し、ギャップを分析してから解決策を提案・実行するのが正しいステップです。",
      keyword: "ライフプランニング",
    },
    {
      id: "e-b-2",
      q: "顧客のリスク許容度を判断する際に考慮すべき要素として不適切なものはどれか？",
      choices: [
        "年齢・投資期間",
        "収入の安定性・資産規模",
        "担当営業員の営業目標",
        "損失が発生した場合の心理的耐性",
      ],
      answer: 2,
      explanation: "リスク許容度は顧客自身の財務状況・心理的耐性・投資期間等で判断します。営業員の目標は顧客のリスク許容度と無関係です。",
      keyword: "リスク許容度",
    },
    {
      id: "e-b-3",
      q: "顧客との信頼関係構築において重要な「三方よし」の考え方として正しいものはどれか？",
      choices: [
        "顧客・金融機関・規制当局の三者が満足すること",
        "顧客・金融機関・社会（第三者）すべてに良い結果をもたらすこと",
        "顧客の利益・売上・コストのバランスをとること",
        "短期・中期・長期の利益を最大化すること",
      ],
      answer: 1,
      explanation: "「三方よし」は近江商人の概念。顧客（買い手）、金融機関（売り手）、社会（世間）すべてにとって良い取引を実現することが真の顧客本位です。",
      keyword: "三方よし",
    },
    {
      id: "e-b-4",
      q: "定期的なポートフォリオのモニタリングが必要な理由として最も適切なものはどれか？",
      choices: [
        "手数料収入を増やすため頻繁に売買するため",
        "当初の資産配分が市場変動でずれた場合にリバランスし、顧客の目標に沿った運用を維持するため",
        "相場が上昇しているときに追加購入するため",
        "毎月新しい金融商品に乗り換えるため",
      ],
      answer: 1,
      explanation: "市場変動によりアセットアロケーションがずれることがあります。定期的なモニタリングとリバランスで、顧客の目標・リスク許容度に沿った運用を継続します。",
      keyword: "モニタリング・リバランス",
    },
    {
      id: "e-b-5",
      q: "顧客との面談において、最初に確認すべき最も重要な事項はどれか？",
      choices: [
        "今月の推奨銘柄",
        "顧客の投資目的・ゴール・期間",
        "自社の手数料体系",
        "市場の見通し",
      ],
      answer: 1,
      explanation: "顧客本位の観点から、まず顧客の「なぜ投資するのか（目的）」「いつまでに（期間）」「いくら必要か（ゴール）」を把握することが最優先です。",
      keyword: "投資目的確認",
    },
  ],

  C: [
    {
      id: "e-c-1",
      q: "新NISA（2024年〜）の年間投資上限額として正しいものはどれか？",
      choices: ["年120万円", "年240万円", "年360万円", "年480万円"],
      answer: 2,
      explanation: "つみたて投資枠120万円＋成長投資枠240万円＝年間360万円。生涯非課税限度額は1,800万円（うち成長投資枠は最大1,200万円）。",
      keyword: "新NISA限度額",
    },
    {
      id: "e-c-2",
      q: "NISA口座での運用損失について正しい記述はどれか？",
      choices: [
        "一般口座・特定口座との損益通算が可能",
        "損失は翌年に繰越控除できる",
        "NISA口座の損失は他の口座との損益通算・繰越控除ができない",
        "損失が出た場合は非課税枠が翌年に追加される",
      ],
      answer: 2,
      explanation: "NISA口座は非課税メリットがある反面、損失が出ても他の課税口座の利益との損益通算や繰越控除はできません。これは頻出ひっかけ問題です。",
      keyword: "NISA損益通算",
      isHikakke: true,
    },
    {
      id: "e-c-3",
      q: "iDeCoの掛金に関する税制優遇として正しいものはどれか？",
      choices: [
        "掛金の50%が税額控除される",
        "掛金の全額が所得控除（小規模企業共済等掛金控除）として適用される",
        "掛金は損金算入できる",
        "掛金の20%が税額控除される",
      ],
      answer: 1,
      explanation: "iDeCoの掛金は全額「小規模企業共済等掛金控除」として所得から控除されます。所得税率が高い人ほど節税効果が大きくなります。",
      keyword: "iDeCo税制優遇",
    },
    {
      id: "e-c-4",
      q: "iDeCoの原則的な受取開始年齢として正しいものはどれか？",
      choices: ["50歳以降", "55歳以降", "60歳以降", "65歳以降"],
      answer: 2,
      explanation: "iDeCoは原則60歳以降に受給開始。なお、60歳時点で加入期間が10年未満の場合は受給開始年齢が遅くなります（最大65歳）。",
      keyword: "iDeCo受給開始",
    },
    {
      id: "e-c-5",
      q: "ESG投資の「S」が意味するものはどれか？",
      choices: ["Security（安全性）", "Sustainability（持続可能性）", "Social（社会）", "Stability（安定性）"],
      answer: 2,
      explanation: "ESGはEnvironment（環境）・Social（社会）・Governance（企業統治）の略。財務情報だけでなく非財務情報を投資判断に組み込む手法です。",
      keyword: "ESG投資",
    },
    {
      id: "e-c-6",
      q: "ESG投資のアプローチのうち「ポジティブスクリーニング」の説明として正しいものはどれか？",
      choices: [
        "ESGスコアの低い企業を投資対象から除外する",
        "ESGスコアの高い優良企業を積極的に投資対象に選ぶ",
        "企業との対話（エンゲージメント）で改善を促す",
        "財務的リターンと社会的インパクトの両方を追求する",
      ],
      answer: 1,
      explanation: "ポジティブスクリーニング（選別投資）：ESGで優秀な企業を積極的に選ぶ。対して、問題企業を除外するのはネガティブスクリーニングです。",
      keyword: "ESGスクリーニング",
    },
    {
      id: "e-c-7",
      q: "資産形成において「老後2,000万円問題」の根拠として用いられた試算条件はどれか？",
      choices: [
        "30年間で月5万円の赤字が生じるという試算",
        "65歳以降30年間で月約5.5万円の赤字が生じるという試算（2019年金融審議会）",
        "現役世代の平均貯蓄額が2,000万円以下であるという統計",
        "株式投資で2,000万円失うリスクがあるという警告",
      ],
      answer: 1,
      explanation: "2019年金融審議会市場ワーキング・グループ報告書で、夫婦2人の老後30年間で約2,000万円が不足するという試算が注目されました（月約5.5万円の赤字×20年=1,300万円、30年=2,000万円）。",
      keyword: "老後2000万円",
    },
    {
      id: "e-c-8",
      q: "新NISAにおいて、非課税枠の再利用（翌年の枠回復）について正しいものはどれか？",
      choices: [
        "売却しても枠は一切回復しない（旧NISAと同じ）",
        "売却した分の取得価額（簿価）に相当する非課税枠が翌年以降に復活する",
        "売却した翌月に枠が回復する",
        "枠の回復は5年に1度",
      ],
      answer: 1,
      explanation: "新NISAの重要な特徴。売却した場合、その商品の取得価額分の非課税枠が翌年に復活します（生涯枠1,800万円の中で何度でも使い直し可能）。",
      keyword: "NISA枠回復",
    },
  ],
};

// --- 資産クラスデータ（②基礎タブ用） ---
const ASSET_CLASS_DATA = [
  { name: "国内債券",   expectedReturn: 0.015, risk: 0.025, color: "#4A90D9", desc: "安定・低リスク" },
  { name: "国内株式",   expectedReturn: 0.045, risk: 0.180, color: "#50C878", desc: "中リターン・中リスク" },
  { name: "外国債券",   expectedReturn: 0.030, risk: 0.120, color: "#FFB347", desc: "中リターン・中リスク" },
  { name: "外国株式",   expectedReturn: 0.055, risk: 0.220, color: "#9B59B6", desc: "高リターン・高リスク" },
  { name: "国内REIT",  expectedReturn: 0.040, risk: 0.175, color: "#E74C3C", desc: "中〜高リターン" },
];

// --- 正規分布データ生成 ---
function generateNormalDist(mean, sigma, points = 80) {
  const data = [];
  const xMin = mean - 4 * sigma;
  const xMax = mean + 4 * sigma;
  for (let i = 0; i <= points; i++) {
    const x = xMin + (i / points) * (xMax - xMin);
    const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
    data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(5)) });
  }
  return data;
}

// --- ②基礎タブ クイズデータ（セクションA・B・C） ---
const BASICS_QUIZZES = {
  A: [
    {
      id: "b-a-1",
      q: "算術平均リターンと幾何平均リターンの使い分けとして正しいものはどれか？",
      choices: [
        "将来のリターン予測には算術平均、過去の実績評価には幾何平均を用いる",
        "将来のリターン予測には幾何平均、過去の実績評価には算術平均を用いる",
        "どちらも同じ値になるので使い分ける必要はない",
        "算術平均は常に幾何平均より小さい",
      ],
      answer: 0,
      explanation: "将来予測（期待リターンの推定）には算術平均、過去の複利ベースの実績評価には幾何平均を用います。算術平均≥幾何平均（等号は全リターンが等しい時のみ）。",
      keyword: "算術平均vs幾何平均",
      isHikakke: true,
    },
    {
      id: "b-a-2",
      q: "期初価格100円・期末価格115円・配当3円のとき、単純リターン（保有期間リターン）はいくらか？",
      choices: ["15%", "18%", "3%", "12%"],
      answer: 1,
      isCalc: true,
      explanation: "(115 - 100 + 3) / 100 × 100 = 18%",
      keyword: "単純リターン計算",
    },
    {
      id: "b-a-3",
      q: "2年間で保有期間リターンが44%だった場合、年率リターン（複利換算）はいくらか？",
      choices: ["22%", "約20%", "約18%", "約16%"],
      answer: 1,
      isCalc: true,
      explanation: "(1 + 0.44)^(1/2) - 1 ≈ 0.2000 = 20%。√1.44 = 1.2より年率約20%。",
      keyword: "年率リターン計算",
    },
    {
      id: "b-a-4",
      q: "3年間のリターンが+20%, -10%, +15%だった場合、幾何平均リターンはいくらか？",
      choices: ["約8.3%", "約7.8%", "約6.5%", "約9.0%"],
      answer: 1,
      isCalc: true,
      explanation: "(1.20 × 0.90 × 1.15)^(1/3) - 1 = (1.2420)^(1/3) - 1 ≈ 7.78%",
      keyword: "幾何平均リターン",
    },
    {
      id: "b-a-5",
      q: "「算術平均は常に幾何平均以上になる」という関係はいつ等号（=）が成立するか？",
      choices: [
        "リターンが常にプラスのとき",
        "すべての期間のリターンが同じ値のとき",
        "投資期間が長いとき",
        "リスク（標準偏差）がゼロのとき",
      ],
      answer: 1,
      explanation: "算術平均≥幾何平均（相加相乗平均の不等式）。等号はすべてのリターンが等しい時（例：毎年10%ずつ）にのみ成立します。",
      keyword: "算術平均≥幾何平均",
    },
    {
      id: "b-a-6",
      q: "年率10%で5年間複利運用した場合、100万円はいくらになるか？",
      choices: ["約150万円", "約161万円", "約155万円", "約170万円"],
      answer: 1,
      isCalc: true,
      explanation: "100万円 × (1.10)^5 = 100万円 × 1.61051 ≈ 161万円",
      keyword: "複利計算",
    },
    {
      id: "b-a-7",
      q: "保有期間リターンの計算式として正しいものはどれか？",
      choices: [
        "（期末価格 + 配当）/ 期初価格",
        "（期末価格 - 期初価格 + 配当）/ 期初価格",
        "（期末価格 - 期初価格）/ 期末価格 + 配当",
        "（期初価格 - 期末価格 + 配当）/ 期初価格",
      ],
      answer: 1,
      explanation: "R = (期末価格 - 期初価格 + 配当) / 期初価格。分母は「期初価格（投資元本）」です。",
      keyword: "保有期間リターン",
    },
    {
      id: "b-a-8",
      q: "リターンの計算において「ドルコスト平均法」で定期積立した場合の平均取得単価はどうなるか？",
      choices: [
        "算術平均取得単価と常に一致する",
        "算術平均取得単価より常に高くなる",
        "算術平均取得単価より低くなる（安く買えるメリット）",
        "算術平均取得単価と同じになる",
      ],
      answer: 2,
      explanation: "一定額を定期購入するドルコスト平均法では、価格が安い時に多く購入できるため、平均取得単価が算術平均より低くなります。",
      keyword: "ドルコスト平均法",
    },
  ],
  B: [
    {
      id: "b-b-1",
      q: "リターンが10%, 20%, -5%, 15%（平均10%）のとき分散はいくらか？",
      choices: ["約75", "約87.5", "約100", "約62.5"],
      answer: 1,
      isCalc: true,
      explanation: "各偏差²: (10-10)²=0, (20-10)²=100, (-5-10)²=225, (15-10)²=25。平均=(0+100+225+25)/4=87.5",
      keyword: "分散計算",
    },
    {
      id: "b-b-2",
      q: "標準偏差（リスク）が大きいほど、投資のリスクはどうなるか？",
      choices: [
        "リスクが小さく安全な投資",
        "リターンが安定していることを示す",
        "リターンのばらつきが大きく、高リスクな投資",
        "期待リターンが高いことを示す",
      ],
      answer: 2,
      explanation: "標準偏差はリターンの「ばらつき」を表します。標準偏差が大きい＝リターンが予想から大きく外れる可能性が高い＝ハイリスクです。",
      keyword: "標準偏差の意味",
    },
    {
      id: "b-b-3",
      q: "相関係数-1の2資産でポートフォリオを組んだ場合の説明として正しいものはどれか？",
      choices: [
        "リスクは2倍になる",
        "リターンはゼロになる",
        "適切な比率で組み合わせるとリスクをゼロにできる（理論上）",
        "相関-1は現実には存在しない",
      ],
      answer: 2,
      explanation: "相関係数-1（完全逆相関）では、一方が上がる時他方が下がるため、適切な比率で組み合わせるとリスクを理論上ゼロにできます。これは試験頻出のひっかけです。",
      keyword: "相関係数-1",
      isHikakke: true,
    },
    {
      id: "b-b-4",
      q: "2資産の相関係数を求める式として正しいものはどれか？",
      choices: [
        "ρ = σA × σB / Cov(A,B)",
        "ρ = Cov(A,B) / (σA × σB)",
        "ρ = (σA + σB) / Cov(A,B)",
        "ρ = Cov(A,B) × σA × σB",
      ],
      answer: 1,
      explanation: "ρ(A,B) = Cov(A,B) / (σA × σB)。相関係数は共分散を両資産の標準偏差の積で割った値で、-1から+1の範囲に正規化されます。",
      keyword: "相関係数の公式",
    },
    {
      id: "b-b-5",
      q: "分散投資の効果が最も大きくなる相関係数の組み合わせはどれか？",
      choices: [
        "ρ = +1",
        "ρ = +0.5",
        "ρ = 0",
        "ρ = -1",
      ],
      answer: 3,
      explanation: "相関係数が低い（または負の）ほど分散効果が大きい。ρ=-1が最大の分散効果（理論上リスクゼロが可能）。ρ=+1では分散効果なし。",
      keyword: "分散効果と相関係数",
    },
    {
      id: "b-b-6",
      q: "シャープレシオの計算式として正しいものはどれか？",
      choices: [
        "SR = Rp / σp",
        "SR = (Rp - Rf) / σp",
        "SR = (Rp - Rf) × σp",
        "SR = σp / (Rp - Rf)",
      ],
      answer: 1,
      explanation: "シャープレシオ = (ポートフォリオのリターン - リスクフリーレート) / 標準偏差。リスク1単位あたりの超過リターンを表します。",
      keyword: "シャープレシオ公式",
    },
    {
      id: "b-b-7",
      q: "ポートフォリオのリターン12%、リスクフリーレート2%、標準偏差15%のとき、シャープレシオはいくらか？",
      choices: ["0.50", "0.67", "0.80", "1.00"],
      answer: 1,
      isCalc: true,
      explanation: "SR = (12% - 2%) / 15% = 10% / 15% = 0.667",
      keyword: "シャープレシオ計算",
    },
    {
      id: "b-b-8",
      q: "「シャープレシオが高い＝必ず良い投資」という考え方について正しいのはどれか？",
      choices: [
        "正しい。シャープレシオが高いほど常に優れた投資である",
        "誤り。シャープレシオは同じリスク水準のポートフォリオ間での比較に意味があり、絶対的な良し悪しは判断できない",
        "正しい。リターンが高ければ必ずシャープレシオも高い",
        "誤り。シャープレシオが高いほど損失が大きい",
      ],
      answer: 1,
      explanation: "シャープレシオは相対的な効率性指標。同水準のリスクを持つポートフォリオの比較に有効ですが、絶対的な良し悪しや異なるリスク水準の比較には注意が必要です。",
      keyword: "シャープレシオの限界",
      isHikakke: true,
    },
  ],
  C: [
    {
      id: "b-c-1",
      q: "現在価値（PV）の計算式として正しいものはどれか？",
      choices: [
        "PV = FV × (1 + r)^n",
        "PV = FV / (1 + r)^n",
        "PV = FV + r × n",
        "PV = FV - r^n",
      ],
      answer: 1,
      explanation: "PV = FV / (1+r)^n。将来価値を割引率(1+r)のn乗で割り引くことで現在価値を求めます。割引率が高い・期間が長いほどPVは小さくなります。",
      keyword: "現在価値公式",
    },
    {
      id: "b-c-2",
      q: "割引率3%、5年後の将来価値100万円の現在価値に最も近いものはどれか？",
      choices: ["86.3万円", "85.0万円", "88.0万円", "90.0万円"],
      answer: 0,
      isCalc: true,
      explanation: "PV = 100万 / (1.03)^5 = 100万 / 1.15927 ≈ 86.26万円",
      keyword: "現在価値計算",
    },
    {
      id: "b-c-3",
      q: "割引率が上昇した場合、現在価値はどうなるか？",
      choices: [
        "現在価値は上昇する",
        "現在価値は変わらない",
        "現在価値は低下する",
        "割引率と現在価値は無関係",
      ],
      answer: 2,
      explanation: "PV = FV / (1+r)^n。割引率rが上昇すると分母が大きくなるため、現在価値は低下します。これは債券価格と金利の逆相関と同じ原理です。",
      keyword: "割引率と現在価値の関係",
    },
    {
      id: "b-c-4",
      q: "正規分布において「平均±2σ」の範囲に含まれる確率はおよそいくらか？",
      choices: ["約68%", "約95%", "約99.7%", "約50%"],
      answer: 1,
      explanation: "正規分布：±1σ≈68%、±2σ≈95%、±3σ≈99.7%（3シグマルール）。ABC試験でよく出題される数値です。",
      keyword: "3シグマルール",
    },
    {
      id: "b-c-5",
      q: "VaR（バリュー・アット・リスク）95%信頼水準の意味として正しいものはどれか？",
      choices: [
        "95%の確率で利益が出ることを保証する",
        "1日のうち95%の確率で損失がゼロであることを示す",
        "95%の信頼水準で、ある期間内の最大損失額を示す（5%の確率でこれを超える損失が発生する可能性）",
        "過去95日間の最大損失額",
      ],
      answer: 2,
      explanation: "VaR（Value at Risk）：95%信頼水準のVaRは「1日（または一定期間）に、5%の確率でVaR以上の損失が発生する可能性がある」という意味です。",
      keyword: "VaR",
    },
    {
      id: "b-c-6",
      q: "アセットアロケーション（資産配分）がリターンに与える影響として、研究（Brinson et al.）で示されたことはどれか？",
      choices: [
        "リターンの約30%はアセットアロケーションで決まる",
        "リターンの約50%はアセットアロケーションで決まる",
        "リターンの約90%はアセットアロケーションで決まる",
        "アセットアロケーションはリターンにほぼ影響しない",
      ],
      answer: 2,
      explanation: "Brinson et al.の研究によると、ポートフォリオリターンの変動の約90%はアセットアロケーション（資産配分）の決定によって説明されるとされています。",
      keyword: "アセットアロケーションの重要性",
    },
    {
      id: "b-c-7",
      q: "「アセットロケーション」の説明として正しいものはどれか？",
      choices: [
        "どの資産クラスに何%配分するかを決めること",
        "どの口座（NISA・iDeCo・課税口座）に、どの資産を配置するかを最適化すること",
        "海外資産を国内資産に変換すること",
        "不動産の所在地を選定すること",
      ],
      answer: 1,
      explanation: "アセットロケーション（≠アセットアロケーション）は口座の使い分け。税効率を高めるために、例えばREIT（分配金課税あり）をNISA・iDeCoに置くなどの戦略です。",
      keyword: "アセットロケーション",
      isHikakke: true,
    },
    {
      id: "b-c-8",
      q: "95%信頼水準のVaRをCAPM的に計算する場合、使用するzスコアはいくらか？",
      choices: ["1.28", "1.645", "1.96", "2.326"],
      answer: 1,
      isCalc: true,
      explanation: "95%信頼水準（片側5%）のzスコアは1.645。VaR = 平均 - 1.645×σ。90%なら1.28、97.5%なら1.96、99%なら2.326です。",
      keyword: "VaR計算・zスコア",
    },
  ],
};

// ============================================================
// フェーズ4: ポートフォリオ・金融商品データ定義
// ============================================================

// --- 効率的フロンティア データ生成 ---
function generateEfficientFrontier(rA, rB, sigA, sigB, steps = 30) {
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const wA = i / steps;
    const wB = 1 - wA;
    // 複数の相関係数で生成
    [-1, -0.5, 0, 0.5, 1].forEach((rho) => {
      const ret = wA * rA + wB * rB;
      const variance = wA * wA * sigA * sigA
        + wB * wB * sigB * sigB
        + 2 * wA * wB * rho * sigA * sigB;
      const sig = Math.sqrt(Math.max(0, variance));
      data.push({ rho, wA: parseFloat(wA.toFixed(2)), ret: parseFloat((ret * 100).toFixed(2)), sig: parseFloat((sig * 100).toFixed(2)) });
    });
  }
  return data;
}

// --- SML（証券市場線）データ生成 ---
function generateSML(rf, rm, betaMin = -0.5, betaMax = 2.5, steps = 30) {
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const beta = betaMin + (i / steps) * (betaMax - betaMin);
    const er = rf + beta * (rm - rf);
    data.push({ beta: parseFloat(beta.toFixed(2)), er: parseFloat((er * 100).toFixed(2)) });
  }
  return data;
}

// --- ③ポートフォリオ理論 クイズデータ ---
const PORTFOLIO_QUIZZES = {
  A: [
    {
      id: "p-a-1",
      q: "2資産ポートフォリオで、相関係数が+1のとき分散効果はどうなるか？",
      choices: [
        "完全にリスクを消去できる",
        "部分的に分散効果がある",
        "分散効果はなく、リスクは加重平均となる",
        "リスクが2倍になる",
      ],
      answer: 2,
      explanation: "相関係数ρ=+1（完全正相関）では分散効果がなく、ポートフォリオのリスクは各資産のリスクの加重平均に等しくなります。",
      keyword: "相関係数+1",
      isHikakke: true,
    },
    {
      id: "p-a-2",
      q: "資産A（リターン8%, リスク15%）と資産B（リターン4%, リスク5%）、相関係数0、配分50:50のポートフォリオリターンはいくらか？",
      choices: ["4%", "6%", "8%", "12%"],
      answer: 1,
      isCalc: true,
      explanation: "ポートフォリオリターン = 0.5×8% + 0.5×4% = 6%。リターンは単純加重平均です。",
      keyword: "PFリターン計算",
    },
    {
      id: "p-a-3",
      q: "資産A（σ=15%）と資産B（σ=10%）を50:50で組み合わせ、相関係数ρ=0のとき、ポートフォリオのリスクはいくらか？",
      choices: ["12.5%", "9.0%", "約9.0%", "5%"],
      answer: 2,
      isCalc: true,
      explanation: "σP = √(0.25×0.0225 + 0.25×0.01 + 0) = √(0.005625+0.0025) = √0.008125 ≈ 9.01%",
      keyword: "PFリスク計算ρ=0",
    },
    {
      id: "p-a-4",
      q: "分散投資によってリスクを低減できない「システマティックリスク」の別名はどれか？",
      choices: [
        "非市場リスク・固有リスク",
        "アンシステマティックリスク",
        "市場リスク・ベータリスク",
        "流動性リスク",
      ],
      answer: 2,
      explanation: "システマティックリスク（市場リスク）：市場全体に影響するリスクで分散投資では消去できない。βで計測。非システマティックリスク（固有リスク）は分散で消去可能。",
      keyword: "システマティックリスク",
    },
    {
      id: "p-a-5",
      q: "2資産ポートフォリオのリスクがゼロになる条件はどれか？",
      choices: [
        "相関係数ρ=0で任意の比率",
        "相関係数ρ=-1で特定の比率（σA×wA = σB×wB）",
        "どちらかの資産のリスクがゼロ",
        "両資産のリターンが等しいとき",
      ],
      answer: 1,
      explanation: "ρ=-1（完全逆相関）で、かつwA×σA = wB×σBという特定の比率でのみポートフォリオリスクがゼロになります。この比率：wA = σB/(σA+σB)。",
      keyword: "PFリスクゼロ条件",
    },
    {
      id: "p-a-6",
      q: "「最小分散ポートフォリオ」の説明として正しいものはどれか？",
      choices: [
        "最も高いリターンを追求するポートフォリオ",
        "シャープレシオが最大となるポートフォリオ",
        "同じリターン水準の中でリスクが最小となるポートフォリオの集合点（最もリスクが低い点）",
        "リスクフリー資産のみで構成されるポートフォリオ",
      ],
      answer: 2,
      explanation: "最小分散ポートフォリオは効率的フロンティア上の最もリスクが低い点。これより低いリターンを受け入れてもリスクは低下しません。",
      keyword: "最小分散ポートフォリオ",
    },
    {
      id: "p-a-7",
      q: "効率的フロンティアの説明として正しいものはどれか？",
      choices: [
        "同じリスクで最大リターン（または同じリターンで最小リスク）のポートフォリオの集合",
        "すべての資産を等分に持つポートフォリオの軌跡",
        "リスクフリー資産と市場ポートフォリオを結ぶ直線",
        "CAPMで計算される理論価格の集合",
      ],
      answer: 0,
      explanation: "効率的フロンティア：同じリスクで最大リターンを実現するポートフォリオの集合。CML（資本市場線）との接点が接点ポートフォリオ（市場PF・最大シャープレシオ）。",
      keyword: "効率的フロンティア",
    },
    {
      id: "p-a-8",
      q: "資産A（σ=20%）と資産B（σ=10%）を相関係数-1で組み合わせ、リスクゼロにするための資産Aの比率はどれか？",
      choices: ["25%", "33%", "50%", "67%"],
      answer: 1,
      isCalc: true,
      explanation: "wA = σB/(σA+σB) = 10/(20+10) = 1/3 ≈ 33%。確認：0.33×20 = 0.67×10 = 6.67%で等しくなる。",
      keyword: "ゼロリスク比率計算",
    },
  ],

  B: [
    {
      id: "p-b-1",
      q: "資本市場線（CML）の説明として正しいものはどれか？",
      choices: [
        "個々の証券の期待リターンとβの関係を示す線",
        "リスクフリー資産と市場ポートフォリオを結ぶ直線（効率的ポートフォリオの集合）",
        "効率的フロンティアと同じもの",
        "借入利率と貸出利率の間にある直線",
      ],
      answer: 1,
      explanation: "CML（Capital Market Line）はリスクフリー資産と市場PFを結ぶ直線。CMLの傾き=シャープレシオ（市場PFの）。対してSMLは個別資産のβとリターンの関係。",
      keyword: "CML vs SML",
    },
    {
      id: "p-b-2",
      q: "接点ポートフォリオ（市場ポートフォリオ）の特徴として正しいものはどれか？",
      choices: [
        "最もリスクが低いポートフォリオ",
        "効率的フロンティアとCMLの接点でシャープレシオが最大",
        "最もリターンが高いポートフォリオ",
        "βが1のポートフォリオ",
      ],
      answer: 1,
      explanation: "接点ポートフォリオは効率的フロンティアとCMLの接点。シャープレシオが最大となるポートフォリオであり、CAPMでは「市場ポートフォリオ」と同義です。",
      keyword: "接点ポートフォリオ",
    },
    {
      id: "p-b-3",
      q: "分散投資を十分に行った場合、最終的に残るリスクはどれか？",
      choices: [
        "非システマティックリスク（固有リスク）",
        "システマティックリスク（市場リスク）",
        "信用リスク",
        "流動性リスク",
      ],
      answer: 1,
      explanation: "多数の資産に分散投資すると非システマティックリスクは消去されますが、市場全体の動きに連動するシステマティックリスク（市場リスク）は残ります。",
      keyword: "分散後のリスク",
    },
    {
      id: "p-b-4",
      q: "理論上、何銘柄程度に分散投資すれば固有リスクの大部分を消去できるとされているか？",
      choices: ["5銘柄以上", "10〜15銘柄以上", "20〜30銘柄以上", "100銘柄以上"],
      answer: 2,
      explanation: "研究によると20〜30銘柄程度の分散投資で非システマティックリスクの大部分を消去できるとされています。それ以上増やしてもリスク低減効果は限定的です。",
      keyword: "分散効果の限界",
    },
  ],

  C: [
    {
      id: "p-c-1",
      q: "CAPMの基本式として正しいものはどれか？",
      choices: [
        "E(Ri) = Rf × βi + E(Rm)",
        "E(Ri) = Rf + βi × [E(Rm) - Rf]",
        "E(Ri) = βi × E(Rm) - Rf",
        "E(Ri) = E(Rm) + βi / Rf",
      ],
      answer: 1,
      explanation: "E(Ri) = Rf + βi × [E(Rm) - Rf]。[E(Rm)-Rf]がマーケット・リスクプレミアム（市場超過リターン）。βが大きいほど期待リターンは高い。",
      keyword: "CAPM公式",
    },
    {
      id: "p-c-2",
      q: "Rf=2%, β=1.5, 市場リターン=8%のとき、CAPMによる期待リターンはいくらか？",
      choices: ["11%", "12%", "13%", "14%"],
      answer: 0,
      isCalc: true,
      explanation: "E(Ri) = 2% + 1.5×(8%-2%) = 2% + 1.5×6% = 2% + 9% = 11%",
      keyword: "CAPM計算",
    },
    {
      id: "p-c-3",
      q: "β=0の資産の期待リターンはCAPMによると何か？",
      choices: [
        "市場ポートフォリオと同じリターン",
        "ゼロ",
        "リスクフリーレート（Rf）",
        "マーケット・リスクプレミアムと等しい",
      ],
      answer: 2,
      explanation: "β=0のとき：E(Ri) = Rf + 0×(Rm-Rf) = Rf。βがゼロ＝市場との相関がない＝市場リスクを負わない＝リスクフリーレートと同じリターンが要求されます。",
      keyword: "β=0の意味",
      isHikakke: true,
    },
    {
      id: "p-c-4",
      q: "CAPMにおいて「非システマティックリスク」に対して追加的なリターンが要求されない理由はどれか？",
      choices: [
        "非システマティックリスクは測定できないから",
        "非システマティックリスクは分散投資で消去できるため、投資家はリスク補償を要求しない",
        "非システマティックリスクは市場全体に影響するから",
        "βは非システマティックリスクを含んでいるから",
      ],
      answer: 1,
      explanation: "CAPMの重要前提：非システマティックリスクは分散投資で消去可能なため、合理的な投資家はこのリスクに対するプレミアムを要求しない。報酬はβ（システマティックリスク）のみに支払われます。",
      keyword: "非システマティックリスク補償なし",
      isHikakke: true,
    },
    {
      id: "p-c-5",
      q: "トレイナーレシオ（Treynor Ratio）の分母として使用するのはどれか？",
      choices: ["標準偏差（σ）", "ベータ（β）", "分散（σ²）", "トラッキングエラー"],
      answer: 1,
      explanation: "トレイナーレシオ = (Rp-Rf)/β。シャープレシオの分母はσ（全リスク）、トレイナーの分母はβ（市場リスクのみ）。完全分散済みPFにはトレイナー、個別評価にはシャープが適切。",
      keyword: "トレイナーレシオ",
    },
    {
      id: "p-c-6",
      q: "ジェンセンのアルファ（α）がプラスの場合、何を意味するか？",
      choices: [
        "ポートフォリオのリスクが市場より低い",
        "ポートフォリオがCAPMの予測リターンを上回るリターンを達成した",
        "ポートフォリオのβが1より大きい",
        "ポートフォリオのシャープレシオが高い",
      ],
      answer: 1,
      explanation: "α = Rp - [Rf + β×(Rm-Rf)]。α>0はCAPMで期待されるリターンを超えた超過リターン（運用の腕前の指標）。α=0はCAPMどおりの成果。",
      keyword: "ジェンセンのアルファ",
    },
    {
      id: "p-c-7",
      q: "情報レシオ（IR）の説明として正しいものはどれか？",
      choices: [
        "リスクフリーレートに対する超過リターンをシステマティックリスクで割ったもの",
        "ベンチマーク超過リターン（アクティブリターン）をトラッキングエラーで割ったもの",
        "ポートフォリオリターンを全リスクで割ったもの",
        "超過リターンをベータで割ったもの",
      ],
      answer: 1,
      explanation: "IR = (Rp - Rb) / TE。Rb: ベンチマークリターン、TE: トラッキングエラー（追跡誤差）。アクティブ運用の効率性を評価する指標です。",
      keyword: "情報レシオ",
    },
    {
      id: "p-c-8",
      q: "Rp=12%, Rf=2%, β=1.2のとき、トレイナーレシオはいくらか？",
      choices: ["約6.67", "約8.33", "約10.00", "約0.83"],
      answer: 1,
      isCalc: true,
      explanation: "TR = (Rp - Rf) / β = (12% - 2%) / 1.2 = 10% / 1.2 ≈ 8.33",
      keyword: "トレイナーレシオ計算",
    },
  ],

  D: [
    {
      id: "p-d-1",
      q: "情報レシオとシャープレシオの違いとして正しいものはどれか？",
      choices: [
        "シャープはリスクフリーレート、情報レシオはベンチマークとの比較",
        "両者は同じ指標",
        "シャープはβ、情報レシオはσを使用する",
        "情報レシオは債券専用指標",
      ],
      answer: 0,
      explanation: "シャープレシオ：リスクフリーレートとの超過リターン÷σ（総合的な効率性）。情報レシオ：ベンチマーク超過リターン÷トラッキングエラー（アクティブ運用の評価）。",
      keyword: "IRvsシャープ",
    },
  ],
};

// --- ④金融商品 クイズデータ ---
const PRODUCTS_QUIZZES = {
  A: [
    {
      id: "pr-a-1",
      q: "PER（株価収益率）の計算式として正しいものはどれか？",
      choices: [
        "PER = EPS / 株価",
        "PER = 株価 / EPS（1株当たり利益）",
        "PER = 純資産 / 株価",
        "PER = 配当 / 株価",
      ],
      answer: 1,
      explanation: "PER = 株価 / EPS（1株当たり純利益）。低いほど株価が割安とされますが、業種比較が重要です。赤字企業にはPERは算出できません。",
      keyword: "PER",
    },
    {
      id: "pr-a-2",
      q: "PBR（株価純資産倍率）が1倍を下回る株式について正しい記述はどれか？",
      choices: [
        "株価が理論上の解散価値を上回っている",
        "株価が理論上の解散価値を下回っており、割安とみなされることがある",
        "企業が赤字であることを示す",
        "配当利回りが高いことを示す",
      ],
      answer: 1,
      explanation: "PBR=株価/BPS（1株当たり純資産）。PBR<1は株価が帳簿上の純資産より安い状態（解散価値以下）。必ずしも買いではなく、構造的問題を抱えているケースも。",
      keyword: "PBR1倍割れ",
      isHikakke: true,
    },
    {
      id: "pr-a-3",
      q: "ROE（自己資本利益率）のデュポン分解として正しいものはどれか？",
      choices: [
        "ROE = 純利益率 × 総資産回転率 × 財務レバレッジ",
        "ROE = 売上高 × 利益率 × 株価",
        "ROE = EPS × PER × 株数",
        "ROE = 配当性向 × 株価 × 利回り",
      ],
      answer: 0,
      explanation: "ROE（デュポン分解）= 純利益率（収益性）× 総資産回転率（効率性）× 財務レバレッジ（安全性の逆）。3要素でROEの源泉を分析できます。",
      keyword: "ROEデュポン分解",
    },
    {
      id: "pr-a-4",
      q: "DDM（配当割引モデル）の定率成長モデルの公式として正しいものはどれか？",
      choices: [
        "P = D1 × (r - g)",
        "P = D1 / (r - g)",
        "P = D1 / (r + g)",
        "P = D1 × r / g",
      ],
      answer: 1,
      explanation: "P = D1 / (r - g)。D1：来期配当、r：割引率（期待リターン）、g：配当成長率。r > g の条件が必要。成長率が割引率に近づくほど理論株価は高くなる。",
      keyword: "DDM定率成長モデル",
    },
    {
      id: "pr-a-5",
      q: "来期配当100円、割引率8%、成長率3%のとき、DDM定率成長モデルによる理論株価はいくらか？",
      choices: ["1,000円", "2,000円", "1,333円", "500円"],
      answer: 1,
      isCalc: true,
      explanation: "P = D1 / (r-g) = 100 / (0.08-0.03) = 100 / 0.05 = 2,000円",
      keyword: "DDM計算",
    },
    {
      id: "pr-a-6",
      q: "グロース株とバリュー株の比較として正しいものはどれか？",
      choices: [
        "グロース株：高PER・高成長期待。バリュー株：低PER・割安",
        "グロース株：低PER・低リスク。バリュー株：高PER・高リスク",
        "グロース株：高配当利回り。バリュー株：無配当",
        "グロース株とバリュー株は同義",
      ],
      answer: 0,
      explanation: "グロース（成長）株：高PER・低配当でも将来の成長期待が高い。バリュー（割安）株：PBRやPERが低く、現在の資産・利益対比で割安な銘柄。",
      keyword: "グロースvsバリュー",
    },
  ],
  B: [
    {
      id: "pr-b-1",
      q: "債券価格と市場金利の関係として正しいものはどれか？",
      choices: [
        "金利上昇 → 債券価格上昇（正の相関）",
        "金利上昇 → 債券価格下落（逆相関）",
        "金利と債券価格は無関係",
        "金利上昇 → 短期債は上昇・長期債は下落",
      ],
      answer: 1,
      explanation: "金利上昇→既存債券の相対的な魅力低下→価格下落（逆相関）。デュレーションが長い債券ほど金利変動の影響が大きい。",
      keyword: "金利と債券価格の逆相関",
    },
    {
      id: "pr-b-2",
      q: "デュレーションの説明として正しいものはどれか？",
      choices: [
        "残存期間と同じ概念",
        "クーポンを含めたキャッシュフローの加重平均残存期間（金利感応度）",
        "債券の信用力を示す指標",
        "年間クーポン収入の合計",
      ],
      answer: 1,
      explanation: "デュレーションはキャッシュフローの加重平均残存期間。残存期間ではない点が頻出ひっかけ。クーポンが低い・残存期間が長いほどデュレーションが長く金利感応度が高い。",
      keyword: "デュレーション≠残存期間",
      isHikakke: true,
    },
    {
      id: "pr-b-3",
      q: "修正デュレーション5年の債券で金利が0.5%上昇した場合、債券価格の変動率はいくらか？",
      choices: ["+2.5%", "-2.5%", "+5.0%", "-0.5%"],
      answer: 1,
      isCalc: true,
      explanation: "ΔP/P ≈ -修正デュレーション × Δr = -5 × 0.005 = -0.025 = -2.5%。符号マイナスに注意（金利上昇→価格下落）。",
      keyword: "修正デュレーション計算",
    },
    {
      id: "pr-b-4",
      q: "YTM（最終利回り・満期利回り）の説明として正しいものはどれか？",
      choices: [
        "クーポンレートと同じ",
        "購入価格に対するクーポン収入の利回り",
        "満期まで保有した場合の年率利回り（クーポン収入＋償還差益/損を含む）",
        "過去1年間の実現利回り",
      ],
      answer: 2,
      explanation: "YTM（Yield to Maturity）：購入から満期まで保有した場合の年率利回り。クーポン収入に加え、購入価格と額面の差（償還差益/損）も含みます。",
      keyword: "YTM（最終利回り）",
    },
  ],
  C: [
    {
      id: "pr-c-1",
      q: "外貨建て資産の円換算リターンの計算式として正しいものはどれか？",
      choices: [
        "R円 = R外貨 + R為替",
        "R円 ≈ R外貨 + R為替（近似式）/ 正確には(1+R外貨)(1+R為替)-1",
        "R円 = R外貨 × R為替",
        "R円 = R外貨 / (1 + R為替)",
      ],
      answer: 1,
      explanation: "正確な式：R円 = (1+R外貨)(1+R為替)-1。小さな値では≈R外貨+R為替で近似可能。円高（R為替<0）は外貨建て資産の円換算リターンを押し下げます。",
      keyword: "為替リターン計算",
    },
    {
      id: "pr-c-2",
      q: "カバー付き金利平価（CIP）の説明として正しいものはどれか？",
      choices: [
        "高金利国通貨は将来必ず上昇する",
        "先渡レートと直物レートの乖離は2国間の金利差を反映する（裁定機会がない状態）",
        "為替ヘッジコストはゼロ",
        "外貨投資は常に国内投資より有利",
      ],
      answer: 1,
      explanation: "CIP：F/S = (1+r国内)/(1+r外国)。先物レートで為替リスクをヘッジすると、金利差が為替コストで相殺され、裁定利益は生じない（ヘッジコスト≒金利差）。",
      keyword: "カバー付き金利平価",
    },
  ],
  D: [
    {
      id: "pr-d-1",
      q: "インデックスファンドとアクティブファンドの比較として正しいものはどれか？",
      choices: [
        "アクティブファンドは常にインデックスを上回るリターンを達成する",
        "インデックスファンドは低コストで市場平均を目指す。長期的にはコスト差がリターン差に影響する",
        "インデックスファンドは市場平均を「超える」ことを目指す",
        "アクティブファンドの信託報酬はインデックスより低い",
      ],
      answer: 1,
      explanation: "インデックス：低コスト・市場平均追跡。アクティブ：高コスト・市場超過リターンを狙うが長期では困難（効率的市場仮説）。コスト差が長期で大きな差になる。",
      keyword: "インデックスvsアクティブ",
      isHikakke: true,
    },
    {
      id: "pr-d-2",
      q: "ETF（上場投資信託）の特徴として正しいものはどれか？",
      choices: [
        "1日1回基準価額で売買する",
        "取引所でリアルタイムに売買でき、信託報酬が一般的に低い",
        "元本保証がある",
        "購入時手数料が必ず必要",
      ],
      answer: 1,
      explanation: "ETFは取引所に上場し株式のようにリアルタイム売買可能。一般的に信託報酬が低く、コスト効率が高い。基準価額ではなく市場価格で取引します。",
      keyword: "ETF",
    },
  ],
  E: [
    {
      id: "pr-e-1",
      q: "REIT（不動産投資信託）の特徴として正しいものはどれか？",
      choices: [
        "個人が直接不動産を購入する投資",
        "不動産に投資する投資信託で、収益の90%超を分配することで法人税が実質非課税になる",
        "元本保証があり安全な投資",
        "株式市場には上場しない",
      ],
      answer: 1,
      explanation: "REIT：多くの投資家から集めた資金で不動産に投資。収益の90%超を分配することで法人段階での課税が実質免除。株式同様に取引所で売買可能（J-REITは東証上場）。",
      keyword: "REIT",
    },
    {
      id: "pr-e-2",
      q: "オルタナティブ投資の主な特徴として正しいものはどれか？",
      choices: [
        "伝統的資産（株・債券）との相関が高く、分散効果は限定的",
        "伝統的資産との相関が低く分散効果が期待できるが、流動性リスクがある",
        "元本保証があり安全性が高い",
        "信託報酬がインデックスファンドより低い",
      ],
      answer: 1,
      explanation: "オルタナティブ投資（REIT・ヘッジファンド・PE・コモディティ等）：伝統的資産との相関が低い→分散効果。ただし流動性リスクや評価の難しさが課題です。",
      keyword: "オルタナティブ投資",
    },
  ],
};

// --- ⑤ケーススタディ データ ---
const CASE_STUDIES = [
  {
    id:       "case01",
    title:    "30代共働き夫婦の資産形成",
    scenario: "山田さん夫婦（夫33歳・妻31歳）。世帯年収800万円。子供2人（3歳・1歳）。住宅ローン残3,000万円。現在の金融資産500万円（定期預金のみ）。老後2,000万円問題が気になっている。",
    tags:     ["教育費", "住宅ローン", "老後資金", "NISA/iDeCo"],
    color:    "#16A085",
    questions: [
      {
        q: "この夫婦に最も適切な資産配分（アセットアロケーション）はどれか？",
        choices: [
          "全額国内株式100%（リターン最大化）",
          "株式60〜70%・債券30〜40%（長期・積立・分散を意識したバランス型）",
          "全額定期預金（安全第一）",
          "全額海外株式（高リターン追求）",
        ],
        answer: 1,
        explanation: "30代・長期投資可能・住宅ローンあり・教育費も考慮すると、ある程度のリスクを取れる。株式中心だが債券も組み入れたバランス型が適切。定期のみは機会損失。",
      },
      {
        q: "NISAとiDeCoの活用として最も適切な考え方はどれか？",
        choices: [
          "iDeCoのみ活用（流動性は無視）",
          "新NISAで積立（流動性確保）＋iDeCoで老後資金（節税）の二本柱",
          "どちらも使わず課税口座で運用",
          "NISAのみ（iDeCoは手続きが面倒）",
        ],
        answer: 1,
        explanation: "新NISAは流動性あり（いつでも引き出し可能）で教育費にも対応可。iDeCoは60歳まで引き出せないが所得控除で節税効果大。二本柱で活用するのが最適。",
      },
      {
        q: "リスク許容度の観点から、株式比率を決める際に最も重要な要因はどれか？",
        choices: [
          "今年の株式市場のパフォーマンス",
          "年齢・投資期間・収入の安定性・住宅ローン等の負債状況",
          "証券会社の担当者のアドバイス",
          "友人の投資実績",
        ],
        answer: 1,
        explanation: "リスク許容度は年齢（投資期間）・収入安定性・負債額・心理的耐性等で決まります。若い・収入安定・長期投資可能なほどリスクを取れます。",
      },
    ],
  },
  {
    id:       "case02",
    title:    "60代定年退職者の資産運用",
    scenario: "鈴木さん（62歳）。退職金2,000万円。公的年金（65歳から月20万円予定）。現在の生活費月30万円。子供は独立済み。インフレが心配。",
    tags:     ["退職金", "取り崩し", "長寿リスク", "インフレリスク"],
    color:    "#8E44AD",
    questions: [
      {
        q: "退職金2,000万円の適切な運用方針はどれか？",
        choices: [
          "全額ハイリスク株式投資（リターン最大化）",
          "全額定期預金（元本保護優先）",
          "生活防衛資金を確保した上で、残りをバランスよく分散投資（取り崩しフェーズに対応）",
          "全額不動産投資",
        ],
        answer: 2,
        explanation: "退職後は「取り崩しフェーズ」。1〜2年分の生活費（流動性確保）＋中リスクの分散投資が基本。長寿リスクを考えると全額定期では30年後の購買力低下（インフレリスク）が問題。",
      },
      {
        q: "65歳から年金20万円/月、生活費30万円/月の場合、不足する月額はいくらか？",
        choices: ["5万円", "10万円", "15万円", "20万円"],
        answer: 1,
        explanation: "30万円（生活費）- 20万円（年金）= 10万円/月の不足。年間120万円。仮に25年間なら3,000万円（インフレ考慮なし）の資産が必要。",
      },
      {
        q: "インフレリスクへの対応として最も適切な行動はどれか？",
        choices: [
          "全額現金で保有する",
          "株式・REIT等の実物資産連動商品を一定割合組み入れる",
          "外貨を大量に保有する",
          "インフレは日本では起こらないので対応不要",
        ],
        answer: 1,
        explanation: "インフレ（物価上昇）は現金・固定利率資産の実質価値を低下させます。株式・REIT・物価連動債等の実物資産連動商品を一定割合組み入れることで対応可能。",
      },
    ],
  },
];

// ============================================================
// プレースホルダータブ（フェーズ5以降で実装）
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
          フェーズ3以降で実装予定
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
