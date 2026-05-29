'use strict';
const { useState, useEffect, useCallback, useRef, useMemo } = React;
const {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} = Recharts;
function makeLucide(name) {
  return function(props) {
    const { size=24, color='currentColor', strokeWidth=2, style, className } = props || {};
    return React.createElement('svg', {
      xmlns:'http://www.w3.org/2000/svg', width:size, height:size,
      viewBox:'0 0 24 24', fill:'none', stroke:color,
      strokeWidth:strokeWidth, strokeLinecap:'round', strokeLinejoin:'round',
      style:style, className:className
    });
  };
}
const Search=makeLucide('Search'), BookOpen=makeLucide('BookOpen'),
  Calculator=makeLucide('Calculator'), BarChart2=makeLucide('BarChart2'),
  Home=makeLucide('Home'), TrendingUp=makeLucide('TrendingUp'),
  PieChart=makeLucide('PieChart'), DollarSign=makeLucide('DollarSign'),
  Shield=makeLucide('Shield'), RefreshCw=makeLucide('RefreshCw'),
  Check=makeLucide('Check'), ChevronRight=makeLucide('ChevronRight'),
  Award=makeLucide('Award'), AlertTriangle=makeLucide('AlertTriangle'),
  Percent=makeLucide('Percent'), Activity=makeLucide('Activity');

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
========================================
💹 ABCコンサルタント試験アプリ - ビルド進捗
========================================
フェーズ1:  基盤・デザインシステム        [✅]
フェーズ2:  計算コンポーネント・公式データ [✅]
フェーズ3:  倫理・基礎データ定義          [✅]
フェーズ4:  PF・金融商品データ            [✅]
フェーズ5:  共通コンポーネント            [✅]
フェーズ6:  ホーム画面                   [✅]
フェーズ7:  ①顧客本位・倫理タブ          [✅]
フェーズ8:  ②資産運用の基礎タブ 前半     [✅]
フェーズ9:  ②資産運用の基礎タブ 後半     [✅]
フェーズ10: ③ポートフォリオ理論タブ      [✅]
フェーズ11: ④金融商品タブ               [✅]
フェーズ12: ⑤ケーススタディタブ          [✅]
フェーズ13: ⑥苦手分析タブ               [✅]
フェーズ14: AI機能（モック）統合         [✅]
フェーズ15: 仕上げ・模擬試験・結合       [✅]
========================================
*/

// ============================================================
// デザイントークン
// ============================================================
const COLORS = {
  primary: "#4A90D9",
  secondary: "#50C878",
  accent: "#FFB347",
  highlight: "#9B59B6",
  danger: "#E74C3C",
  bg: "#FFFFFF",
  text: "#2C3E50",
  cardBg: "#F8FAFE",
  border: "#D5E8F8",
  textLight: "#7F8C8D",
  textMuted: "#BDC3C7"
};
const STYLES = {
  card: {
    background: COLORS.cardBg,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(74,144,217,0.15)",
    padding: 16
  },
  cardLg: {
    background: COLORS.cardBg,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 24,
    boxShadow: "0 4px 16px rgba(74,144,217,0.2)",
    padding: 20
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
    fontFamily: "'Noto Sans JP', sans-serif"
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
    fontFamily: "'Noto Sans JP', sans-serif"
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
    fontFamily: "'Noto Sans JP', sans-serif"
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
    fontFamily: "'Noto Sans JP', sans-serif"
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
    boxSizing: "border-box"
  },
  badge: color => ({
    display: "inline-block",
    background: color + "22",
    color: color,
    borderRadius: 8,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 700
  }),
  sectionTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: COLORS.text,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: 600,
    marginBottom: 4,
    display: "block"
  }
};

// ============================================================
// グローバル状態の初期値
// ============================================================
const INITIAL_PROGRESS = {
  ethics: {
    A: false,
    B: false,
    C: false
  },
  basics: {
    A: false,
    B: false,
    C: false,
    D: false,
    E: false
  },
  portfolio: {
    A: false,
    B: false,
    C: false,
    D: false
  },
  products: {
    A: false,
    B: false,
    C: false,
    D: false,
    E: false
  },
  casestudy: {
    A: false,
    B: false,
    C: false
  },
  analysis: {
    analyzed: false
  }
};

// 教本章別進捗（新規クイズ用: 既存タブで追跡できない章）
const INITIAL_CHAP_PROGRESS = {
  ch1: {
    A: false
  },
  ch2: {
    A: false
  },
  ch6: {
    A: false
  },
  supp2: {
    A: false
  }
};
const INITIAL_STATE = {
  examDate: "",
  progress: INITIAL_PROGRESS,
  chapProgress: INITIAL_CHAP_PROGRESS,
  testHistory: [],
  calcHistory: [],
  reviewStatus: {}
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
      progress: {
        ...INITIAL_PROGRESS,
        ...saved.progress
      },
      chapProgress: {
        ...INITIAL_CHAP_PROGRESS,
        ...saved.chapProgress
      }
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
const TABS = [{
  id: "home",
  label: "ホーム",
  icon: Home,
  color: COLORS.primary
}, {
  id: "ethics",
  label: "①顧客本位",
  icon: Shield,
  color: COLORS.secondary,
  short: "倫理"
}, {
  id: "basics",
  label: "②基礎",
  icon: BookOpen,
  color: COLORS.accent,
  short: "基礎"
}, {
  id: "portfolio",
  label: "③PF理論",
  icon: TrendingUp,
  color: COLORS.highlight,
  short: "PF"
}, {
  id: "products",
  label: "④金融商品",
  icon: DollarSign,
  color: "#E67E22",
  short: "商品"
}, {
  id: "casestudy",
  label: "⑤ケース",
  icon: Activity,
  color: "#16A085",
  short: "ケース"
}, {
  id: "analysis",
  label: "⑥苦手分析",
  icon: BarChart2,
  color: COLORS.danger,
  short: "分析"
}];

// ============================================================
// 教本 章別メタデータ（第1章〜第12章 + 補論2・補論3）
// ============================================================
const CHAPTERS_META = [{
  id: "ch1",
  num: "第1章",
  title: "顧客と信頼関係を築く",
  subtitle: "行動経済学・フィデューシャリー",
  color: "#16A085",
  tabId: "ethics",
  sections: {
    A: "行動経済学"
  }
}, {
  id: "ch2",
  num: "第2章",
  title: "新しい資産運用のあり方",
  subtitle: "ゴールベース・ファンドラップ",
  color: "#4A90D9",
  tabId: "ethics",
  sections: {
    A: "ゴールベース"
  }
}, {
  id: "ch3",
  num: "第3章",
  title: "資産運用と税制",
  subtitle: "NISA・iDeCo・税制優遇",
  color: "#E67E22",
  tabId: "ethics",
  sections: {
    A: "税制・口座"
  }
}, {
  id: "ch4",
  num: "第4章",
  title: "資産運用の基礎",
  subtitle: "リターン・リスク・統計",
  color: "#9B59B6",
  tabId: "basics",
  sections: {
    A: "期待リターン",
    B: "リスク計算"
  }
}, {
  id: "ch5",
  num: "第5章",
  title: "資産形成の実務",
  subtitle: "現在価値・積立・長期投資",
  color: "#3498DB",
  tabId: "basics",
  sections: {
    A: "時間価値",
    B: "積立実務",
    C: "長期戦略"
  }
}, {
  id: "ch6",
  num: "第6章",
  title: "財務諸表の活用",
  subtitle: "PER・PBR・ROE・財務分析",
  color: "#27AE60",
  tabId: "basics",
  sections: {
    A: "財務諸表"
  }
}, {
  id: "ch7",
  num: "第7章",
  title: "ポートフォリオ理論",
  subtitle: "相関係数・分散効果・効率的PF",
  color: "#8E44AD",
  tabId: "portfolio",
  sections: {
    A: "分散効果",
    B: "市場線"
  }
}, {
  id: "ch8",
  num: "第8章",
  title: "CAPM・評価モデル",
  subtitle: "ベータ・シャープ・情報レシオ",
  color: "#C0392B",
  tabId: "portfolio",
  sections: {
    A: "CAPM",
    B: "評価指標"
  }
}, {
  id: "ch9",
  num: "第9章",
  title: "株式投資",
  subtitle: "PER・PBR・配当割引モデル",
  color: "#2ECC71",
  tabId: "products",
  sections: {
    A: "株式評価"
  }
}, {
  id: "ch10",
  num: "第10章",
  title: "債券投資",
  subtitle: "金利・デュレーション・イールド",
  color: "#E74C3C",
  tabId: "products",
  sections: {
    A: "債券分析"
  }
}, {
  id: "ch11",
  num: "第11章",
  title: "外国投資・外国株式",
  subtitle: "為替・外貨建て資産",
  color: "#1ABC9C",
  tabId: "products",
  sections: {
    A: "外国投資"
  }
}, {
  id: "ch12",
  num: "第12章",
  title: "投資信託",
  subtitle: "アクティブ・パッシブ・ESG",
  color: "#F39C12",
  tabId: "products",
  sections: {
    A: "投資信託"
  }
}, {
  id: "supp2",
  num: "補論2",
  title: "デリバティブ取引",
  subtitle: "先物・オプション・スワップ",
  color: "#E74C3C",
  tabId: "products",
  sections: {
    A: "デリバティブ"
  }
}, {
  id: "supp3",
  num: "補論3",
  title: "オルタナティブ投資",
  subtitle: "REIT・ヘッジファンド・不動産",
  color: "#95A5A6",
  tabId: "products",
  sections: {
    A: "オルタナティブ"
  }
}];

// 全章の進捗を統合して返すヘルパー
function computeAllChapProgress(progress, chapProgress) {
  return {
    ch1: {
      A: chapProgress?.ch1?.A ?? false
    },
    ch2: {
      A: chapProgress?.ch2?.A ?? false
    },
    ch3: {
      A: progress.ethics?.C ?? false
    },
    ch4: {
      A: progress.basics?.A ?? false,
      B: progress.basics?.B ?? false
    },
    ch5: {
      A: progress.basics?.C ?? false,
      B: progress.basics?.D ?? false,
      C: progress.basics?.E ?? false
    },
    ch6: {
      A: chapProgress?.ch6?.A ?? false
    },
    ch7: {
      A: progress.portfolio?.A ?? false,
      B: progress.portfolio?.B ?? false
    },
    ch8: {
      A: progress.portfolio?.C ?? false,
      B: progress.portfolio?.D ?? false
    },
    ch9: {
      A: progress.products?.A ?? false
    },
    ch10: {
      A: progress.products?.B ?? false
    },
    ch11: {
      A: progress.products?.C ?? false
    },
    ch12: {
      A: progress.products?.D ?? false
    },
    supp2: {
      A: chapProgress?.supp2?.A ?? false
    },
    supp3: {
      A: progress.products?.E ?? false
    }
  };
}

// ============================================================
// ナビゲーションバー
// ============================================================
function NavigationBar({
  activeTab,
  onTabChange
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#fff",
      borderTop: `2px solid ${COLORS.border}`,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "6px 0 8px",
      zIndex: 1000,
      boxShadow: "0 -4px 16px rgba(74,144,217,0.12)"
    }
  }, TABS.map(tab => {
    const Icon = tab.icon;
    const active = activeTab === tab.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => onTabChange(tab.id),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "4px 6px",
        borderRadius: 10,
        transition: "all 0.18s ease",
        minWidth: 44
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 10,
        background: active ? tab.color + "22" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.18s ease"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 18,
      color: active ? tab.color : COLORS.textMuted
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: active ? 800 : 500,
        color: active ? tab.color : COLORS.textMuted,
        fontFamily: "'Noto Sans JP', sans-serif"
      }
    }, tab.short || tab.label));
  }));
}

// ============================================================
// ページヘッダー
// ============================================================
function PageHeader({
  title,
  subtitle,
  color = COLORS.primary,
  icon: Icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: `linear-gradient(135deg, ${color}18, ${color}08)`,
      border: `1.5px solid ${color}33`,
      borderRadius: 20,
      padding: "16px 20px",
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, Icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: color + "25",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 24,
    color: color
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 800,
      color: COLORS.text,
      fontFamily: "'Noto Sans JP', sans-serif"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textLight,
      marginTop: 4,
      fontFamily: "'Noto Sans JP', sans-serif"
    }
  }, subtitle)));
}

// ============================================================
// フェーズ2: 計算コンポーネント・公式データ
// ============================================================

// --- StepDisplay: 計算ステップ表示 ---
function StepDisplay({
  steps
}) {
  if (!steps || steps.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#F0F8FF",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 12,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.primary,
      marginBottom: 8
    }
  }, "\u8A08\u7B97\u904E\u7A0B"), steps.map((step, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 5,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 22,
      height: 22,
      background: COLORS.primary,
      color: "#fff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 800,
      flexShrink: 0
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.6
    }
  }, step))));
}

// --- ResultCard: 計算結果表示 ---
function ResultCard({
  label,
  value,
  unit = "",
  color = COLORS.primary,
  large = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: color + "12",
      border: `2px solid ${color}44`,
      borderRadius: 14,
      padding: large ? "16px 20px" : "12px 16px",
      textAlign: "center",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      fontWeight: 600,
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: large ? 28 : 22,
      fontWeight: 900,
      color: color,
      lineHeight: 1
    }
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: large ? 14 : 12,
      marginLeft: 3,
      fontWeight: 700
    }
  }, unit)));
}

// --- CalcComponent: 汎用電卓コンポーネント ---
function CalcComponent({
  formulaName,
  inputs,
  // [{ label, key, unit, defaultValue, step, min, max }]
  calculate,
  // (inputValues) => { results: [{label,value,unit,color}], steps: string[] }
  chartBuilder,
  // (inputValues, result) => JSX | null
  accentColor = COLORS.primary
}) {
  const defaultValues = Object.fromEntries(inputs.map(inp => [inp.key, inp.defaultValue ?? ""]));
  const [values, setValues] = useState(defaultValues);
  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const handleCalc = () => {
    try {
      const parsed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, parseFloat(v)]));
      const valid = Object.values(parsed).every(v => !isNaN(v));
      if (!valid) {
        setResult({
          error: "すべての値を入力してください"
        });
        return;
      }
      setResult(calculate(parsed));
    } catch (e) {
      setResult({
        error: "計算エラー: " + e.message
      });
    }
  };
  const handleReset = () => {
    setValues(defaultValues);
    setResult(null);
    setShowChart(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      color: accentColor
    }
  }, /*#__PURE__*/React.createElement(Calculator, {
    size: 17,
    color: accentColor
  }), " ", formulaName), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 12
    }
  }, inputs.map(inp => /*#__PURE__*/React.createElement("div", {
    key: inp.key
  }, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, inp.label, inp.unit && /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.textMuted
    }
  }, " (", inp.unit, ")")), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: values[inp.key],
    step: inp.step ?? "any",
    min: inp.min,
    max: inp.max,
    onChange: e => setValues(v => ({
      ...v,
      [inp.key]: e.target.value
    })),
    style: STYLES.input
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnPrimary,
      flex: 1,
      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`
    },
    onClick: handleCalc
  }, "\u8A08\u7B97\u3059\u308B"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnOutline,
      color: accentColor,
      borderColor: accentColor
    },
    onClick: handleReset
  }, "\u30EA\u30BB\u30C3\u30C8")), result?.error && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "8px 12px",
      background: COLORS.danger + "18",
      border: `1px solid ${COLORS.danger}44`,
      borderRadius: 10,
      fontSize: 13,
      color: COLORS.danger
    }
  }, result.error), result && !result.error && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, result.results.map((r, i) => /*#__PURE__*/React.createElement(ResultCard, {
    key: i,
    label: r.label,
    value: r.value,
    unit: r.unit,
    color: r.color || accentColor,
    large: i === 0
  }))), /*#__PURE__*/React.createElement(StepDisplay, {
    steps: result.steps
  }), chartBuilder && /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnOutline,
      color: accentColor,
      borderColor: accentColor,
      width: "100%",
      marginTop: 10,
      fontSize: 13
    },
    onClick: () => setShowChart(s => !s)
  }, showChart ? "グラフを隠す" : "グラフで確認"), showChart && chartBuilder && chartBuilder(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, parseFloat(v)])), result)));
}

// --- FormulaCard: 公式カード ---
function FormulaCard({
  name,
  formula,
  variables,
  example,
  color = COLORS.primary,
  onOpenCalc
}) {
  const [expanded, setExpanded] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 10,
      borderLeft: `4px solid ${color}`,
      cursor: "pointer"
    },
    onClick: () => setExpanded(e => !e)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: COLORS.text
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(color)
  }, "\u516C\u5F0F"), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 16,
    color: color,
    style: {
      transform: expanded ? "rotate(90deg)" : "none",
      transition: "transform 0.2s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      background: color + "10",
      border: `1px solid ${color}30`,
      borderRadius: 10,
      padding: "8px 12px",
      fontFamily: "monospace",
      fontSize: 14,
      color: color,
      fontWeight: 700,
      letterSpacing: 0.5
    }
  }, formula), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, variables && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.textLight,
      marginBottom: 6
    }
  }, "\u5909\u6570\u306E\u610F\u5473"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, variables.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontWeight: 700,
      color: color,
      minWidth: 40
    }
  }, v.symbol), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.text
    }
  }, v.meaning))))), example && /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.secondary + "12",
      border: `1px solid ${COLORS.secondary}33`,
      borderRadius: 10,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.secondary,
      marginBottom: 6
    }
  }, "\u8A08\u7B97\u4F8B"), example.inputs && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      marginBottom: 4
    }
  }, example.inputs), example.steps && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      marginBottom: 4
    }
  }, example.steps), example.output && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: COLORS.secondary
    }
  }, "\u2192 ", example.output)), onOpenCalc && /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnSecondary,
      width: "100%",
      marginTop: 10,
      fontSize: 13
    },
    onClick: e => {
      e.stopPropagation();
      onOpenCalc();
    }
  }, /*#__PURE__*/React.createElement(Calculator, {
    size: 13,
    style: {
      marginRight: 6
    }
  }), "\u96FB\u5353\u3067\u8A08\u7B97\u3057\u3066\u307F\u308B")));
}

// --- ExamTipCard: 試験頻出ポイントカード ---
function ExamTipCard({
  tips,
  color = COLORS.accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      borderLeft: `4px solid ${color}`,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(AlertTriangle, {
    size: 15,
    color: color
  }), " \u8A66\u9A13\u983B\u51FA\u30DD\u30A4\u30F3\u30C8"), tips.map((tip, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 6,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 20,
      height: 20,
      background: color,
      color: "#fff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      fontWeight: 800,
      flexShrink: 0
    }
  }, "!"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.6
    }
  }, tip))));
}

// --- SectionTab: タブ内セクション切替 ---
function SectionTab({
  sections,
  activeSection,
  onSelect,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      marginBottom: 14,
      paddingBottom: 4,
      scrollbarWidth: "none"
    }
  }, sections.map(sec => /*#__PURE__*/React.createElement("button", {
    key: sec.id,
    onClick: () => onSelect(sec.id),
    style: {
      background: activeSection === sec.id ? color : "transparent",
      color: activeSection === sec.id ? "#fff" : COLORS.textLight,
      border: `1.5px solid ${activeSection === sec.id ? color : COLORS.border}`,
      borderRadius: 20,
      padding: "6px 14px",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "nowrap",
      transition: "all 0.18s ease",
      fontFamily: "'Noto Sans JP', sans-serif"
    }
  }, sec.label)));
}

// --- ChartCard: グラフラッパー ---
function ChartCard({
  title,
  height = 200,
  children,
  color = COLORS.primary
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(BarChart2, {
    size: 15,
    color: color
  }), " ", title), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: height
  }, children));
}

// --- InfoBox: 解説・定義ボックス ---
function InfoBox({
  title,
  children,
  color = COLORS.primary
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: color + "0C",
      border: `1.5px solid ${color}33`,
      borderRadius: 14,
      padding: "12px 14px",
      marginBottom: 10
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color,
      marginBottom: 6
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.7
    }
  }, children));
}

// --- 公式データ定義 ---
const FORMULA_DATA = {
  // リターン計算
  simpleReturn: {
    name: "単純リターン（保有期間リターン）",
    formula: "R = (期末価格 - 期初価格 + 配当) / 期初価格 × 100",
    variables: [{
      symbol: "R",
      meaning: "リターン（%）"
    }, {
      symbol: "期末価格",
      meaning: "売却時または期末の価格"
    }, {
      symbol: "期初価格",
      meaning: "購入時または期初の価格"
    }, {
      symbol: "配当",
      meaning: "期間中に受け取った配当金"
    }],
    example: {
      inputs: "期初100円 → 期末110円、配当2円",
      steps: "(110 - 100 + 2) / 100 × 100",
      output: "リターン = 12%"
    }
  },
  annualReturn: {
    name: "年率リターン（複利換算）",
    formula: "年率R = (1 + 保有期間R)^(1/年数) - 1",
    variables: [{
      symbol: "年率R",
      meaning: "1年当たりの平均リターン"
    }, {
      symbol: "保有期間R",
      meaning: "保有期間全体のリターン（小数）"
    }, {
      symbol: "年数",
      meaning: "保有年数"
    }],
    example: {
      inputs: "3年間で保有期間リターン33.1%",
      steps: "(1 + 0.331)^(1/3) - 1",
      output: "年率リターン ≈ 10%"
    }
  },
  geoMean: {
    name: "幾何平均リターン（複利ベース）",
    formula: "Rg = ((1+R1)×(1+R2)×…×(1+Rn))^(1/n) - 1",
    variables: [{
      symbol: "Rg",
      meaning: "幾何平均リターン"
    }, {
      symbol: "R1…Rn",
      meaning: "各期間のリターン（小数）"
    }, {
      symbol: "n",
      meaning: "期間数"
    }],
    example: {
      inputs: "3年間: +20%, -10%, +15%",
      steps: "(1.20 × 0.90 × 1.15)^(1/3) - 1",
      output: "幾何平均 ≈ 7.78%"
    }
  },
  // リスク計算
  stdDev: {
    name: "標準偏差（リスク）",
    formula: "σ = √(Σ(Ri - Ra)² / n)",
    variables: [{
      symbol: "σ",
      meaning: "標準偏差（リスク）"
    }, {
      symbol: "Ri",
      meaning: "各期間のリターン"
    }, {
      symbol: "Ra",
      meaning: "平均リターン"
    }, {
      symbol: "n",
      meaning: "データ数"
    }],
    example: {
      inputs: "リターン: 10%, 20%, -5%, 15%（平均10%）",
      steps: "√((0²+100+225+25)/4) = √87.5",
      output: "σ ≈ 9.35%"
    }
  },
  correlation: {
    name: "相関係数",
    formula: "ρ(A,B) = Cov(A,B) / (σA × σB)",
    variables: [{
      symbol: "ρ",
      meaning: "相関係数（-1 ≤ ρ ≤ 1）"
    }, {
      symbol: "Cov(A,B)",
      meaning: "2資産の共分散"
    }, {
      symbol: "σA, σB",
      meaning: "各資産の標準偏差"
    }],
    example: {
      inputs: "Cov=0.006, σA=10%, σB=8%",
      steps: "0.006 / (0.10 × 0.08)",
      output: "ρ = 0.75"
    }
  },
  // 現在価値
  pv: {
    name: "現在価値（PV）",
    formula: "PV = FV / (1 + r)^n",
    variables: [{
      symbol: "PV",
      meaning: "現在価値"
    }, {
      symbol: "FV",
      meaning: "将来価値（Future Value）"
    }, {
      symbol: "r",
      meaning: "割引率（年率）"
    }, {
      symbol: "n",
      meaning: "期間（年）"
    }],
    example: {
      inputs: "5年後の100万円、割引率3%",
      steps: "1,000,000 / (1.03)^5",
      output: "PV ≈ 862,609円"
    }
  },
  // CAPM
  capm: {
    name: "CAPM（資本資産評価モデル）",
    formula: "E(Ri) = Rf + βi × [E(Rm) - Rf]",
    variables: [{
      symbol: "E(Ri)",
      meaning: "資産iの期待リターン"
    }, {
      symbol: "Rf",
      meaning: "リスクフリーレート（無リスク資産利回り）"
    }, {
      symbol: "βi",
      meaning: "資産iのベータ値（市場感応度）"
    }, {
      symbol: "E(Rm)",
      meaning: "市場ポートフォリオの期待リターン"
    }],
    example: {
      inputs: "Rf=2%, β=1.2, 市場リターン=8%",
      steps: "2% + 1.2 × (8% - 2%)",
      output: "期待リターン = 9.2%"
    }
  },
  // シャープレシオ
  sharpe: {
    name: "シャープレシオ",
    formula: "SR = (Rp - Rf) / σp",
    variables: [{
      symbol: "SR",
      meaning: "シャープレシオ（高いほど効率的）"
    }, {
      symbol: "Rp",
      meaning: "ポートフォリオのリターン"
    }, {
      symbol: "Rf",
      meaning: "リスクフリーレート"
    }, {
      symbol: "σp",
      meaning: "ポートフォリオの標準偏差"
    }],
    example: {
      inputs: "Rp=12%, Rf=2%, σp=15%",
      steps: "(12% - 2%) / 15%",
      output: "SR = 0.667"
    }
  },
  // ポートフォリオリスク
  portfolioRisk: {
    name: "2資産ポートフォリオのリスク",
    formula: "σP² = wA²σA² + wB²σB² + 2wA·wB·ρAB·σA·σB",
    variables: [{
      symbol: "σP",
      meaning: "ポートフォリオの標準偏差"
    }, {
      symbol: "wA, wB",
      meaning: "各資産の投資比率（合計=1）"
    }, {
      symbol: "σA, σB",
      meaning: "各資産の標準偏差"
    }, {
      symbol: "ρAB",
      meaning: "2資産間の相関係数"
    }],
    example: {
      inputs: "wA=60%, σA=15%, wB=40%, σB=10%, ρ=0.3",
      steps: "√(0.36×0.0225 + 0.16×0.01 + 2×0.6×0.4×0.3×0.15×0.1)",
      output: "σP ≈ 10.7%"
    }
  }
};

// ============================================================
// フェーズ3: 倫理・基礎データ定義
// ============================================================

// --- FD 7原則 ---
const FD_PRINCIPLES = [{
  no: 1,
  title: "方針の策定・公表",
  detail: "顧客本位の業務運営に係る方針を策定・公表し、定期的に見直す。",
  keyword: "方針"
}, {
  no: 2,
  title: "顧客の最善の利益の追求",
  detail: "金融事業者は高度の専門性と職業倫理を保持し、顧客の最善の利益を図る行動をとる。",
  keyword: "最善の利益"
}, {
  no: 3,
  title: "利益相反の適切な管理",
  detail: "取引における利益相反の可能性について把握・管理し、顧客の利益が不当に害されることを防ぐ。",
  keyword: "利益相反"
}, {
  no: 4,
  title: "手数料等の明確化",
  detail: "名目を問わずあらゆる手数料・費用等について、顧客が理解できるよう情報提供する。",
  keyword: "手数料"
}, {
  no: 5,
  title: "重要な情報のわかりやすい提供",
  detail: "顧客の資産状況・取引経験・知識・目的等に照らして、重要な情報を分かりやすく提供する。",
  keyword: "情報提供"
}, {
  no: 6,
  title: "顧客にふさわしいサービスの提供",
  detail: "顧客の意向・状況等を踏まえ、最適なサービスを提案・提供する（適合性の原則）。",
  keyword: "適合性"
}, {
  no: 7,
  title: "従業員への適切な動機づけ",
  detail: "顧客本位の業務運営を促進するため、従業員に対する適切な動機づけの枠組みを整備する。",
  keyword: "動機づけ"
}];

// --- KYC（顧客情報収集）項目 ---
const KYC_ITEMS = [{
  icon: "👤",
  label: "基本属性",
  items: ["年齢・性別", "家族構成", "職業・勤務先"]
}, {
  icon: "💰",
  label: "財務状況",
  items: ["年収・収入源", "資産総額", "負債・ローン", "月々の支出"]
}, {
  icon: "📊",
  label: "投資経験",
  items: ["投資経験年数", "保有商品種類", "過去の損失経験"]
}, {
  icon: "🎯",
  label: "投資目的",
  items: ["投資目的（老後・教育等）", "投資期間", "必要流動性"]
}, {
  icon: "⚖️",
  label: "リスク許容度",
  items: ["損失許容額", "心理的耐性", "収入の安定性"]
}, {
  icon: "📋",
  label: "税務状況",
  items: ["税率区分", "NISA口座有無", "iDeCo加入有無"]
}];

// --- NISA・iDeCoデータ ---
const TAX_ADVANTAGE_DATA = {
  nisa: {
    name: "新NISA（2024年〜）",
    color: COLORS.secondary,
    points: [{
      label: "つみたて投資枠",
      value: "年120万円"
    }, {
      label: "成長投資枠",
      value: "年240万円"
    }, {
      label: "年間合計",
      value: "年360万円"
    }, {
      label: "生涯非課税枠",
      value: "1,800万円"
    }, {
      label: "口座数",
      value: "1人1口座"
    }, {
      label: "非課税期間",
      value: "無期限"
    }, {
      label: "損益通算",
      value: "不可（他口座との損益通算×）"
    }],
    tips: ["つみたて投資枠と成長投資枠は併用可能", "生涯枠1,800万円のうち成長投資枠は最大1,200万円", "売却すると翌年に枠が復活する"]
  },
  ideco: {
    name: "iDeCo（個人型確定拠出年金）",
    color: COLORS.highlight,
    points: [{
      label: "掛金",
      value: "全額所得控除（節税効果大）"
    }, {
      label: "運用益",
      value: "非課税"
    }, {
      label: "受取時",
      value: "退職所得控除 or 公的年金等控除"
    }, {
      label: "受取開始",
      value: "60歳以降"
    }, {
      label: "中途解約",
      value: "原則不可（流動性リスク）"
    }, {
      label: "拠出限度",
      value: "職業・加入年金制度で異なる"
    }],
    tips: ["自営業者（第1号）：月6.8万円まで", "会社員（企業年金なし）：月2.3万円まで", "公務員：月1.2万円まで"]
  }
};

// ============================================================
// 第1章 行動経済学クイズ（CH1_QUIZZES）
// ============================================================
const CH1_QUIZZES = [{
  id: "ch1-beh-1",
  q: "「損失回避バイアス」の説明として最も適切なものはどれか？",
  choices: ["利益を得る喜びより、損失に感じる痛みの方が大きく感じる心理傾向", "損失が生じたときに直ちに損切りする合理的な行動傾向", "リスクを回避して安全資産だけに投資する行動傾向", "過去の損失を取り戻すため積極的にリスクを取る傾向"],
  answer: 0,
  explanation: "損失回避バイアスはKahneman & Tverskyが提唱。同額でも「損失」の痛みは「利益」の喜びの約2倍に感じられる。塩漬け株を売れない心理がその典型。",
  keyword: "損失回避バイアス"
}, {
  id: "ch1-beh-2",
  q: "「ヒューリスティック」の説明として正しいものはどれか？",
  choices: ["複雑な数式を用いて最適解を導く意思決定プロセス", "直感や経験則による、省力化した素早い判断プロセス", "複数の専門家の意見を平均して判断する手法", "統計的手法に基づいた客観的な意思決定方法"],
  answer: 1,
  explanation: "ヒューリスティックとは経験則による省力化された思考プロセス。迅速な判断を可能にするが、系統的な偏り（バイアス）を生みやすい。",
  keyword: "ヒューリスティック"
}, {
  id: "ch1-beh-3",
  q: "「サンクコスト効果（埋没費用の誤謬）」として最も適切な説明はどれか？",
  choices: ["将来の利益を見込んで合理的に投資を続ける行動", "回収できない過去のコストに引きずられ、非合理的な意思決定をしてしまう傾向", "取引コストを最小化するために売買を最適化する行動", "損失が出ている資産を早期に手放す傾向"],
  answer: 1,
  explanation: "サンクコスト（埋没費用）は既に回収できない過去のコスト。合理的には無視すべきだが「もったいない」と感じて損失を出し続けることがある（例：塩漬け株の放置）。",
  keyword: "サンクコスト効果"
}, {
  id: "ch1-beh-4",
  q: "「ナッジ理論」の説明として正しいものはどれか？",
  choices: ["強制・罰則によって人々の行動を望ましい方向に変える政策手法", "税制優遇によって特定の行動を促進する制度設計", "強制せず、選択肢の提示方法や環境設計によって行動を望ましい方向へ誘導する手法", "情報開示を義務付けることで合理的な意思決定を促す規制手法"],
  answer: 2,
  explanation: "ナッジ（nudge＝そっと押す）はThaler & Sunsteinが提唱。自由を制限せずに望ましい行動を促す設計（例：年金の自動加入opt-out）が金融アドバイスに応用されている。",
  keyword: "ナッジ理論"
}, {
  id: "ch1-beh-5",
  q: "「確証バイアス（コンファーメーション・バイアス）」とはどのような心理傾向か？",
  choices: ["自分の信念を裏付ける情報のみ集め、矛盾する情報を無視する傾向", "他人の行動・意見に影響されて自分の判断が歪む傾向", "新しい情報より古い情報を重視する傾向", "確実な情報だけに基づいて意思決定する傾向"],
  answer: 0,
  explanation: "確証バイアスは自分が正しいと思う方向の情報ばかり集め、反証となる情報を見落とす傾向。投資では「この株はいずれ上がる」と思い込み不都合な情報を無視することが典型例。",
  keyword: "確証バイアス"
}, {
  id: "ch1-beh-6",
  q: "「アンカリング効果」の説明として正しいものはどれか？",
  choices: ["長期投資において基準価額を固定して運用する手法", "最初に提示された数値・情報（アンカー）が後の判断に過度に影響を与える傾向", "投資判断を特定の時点に固定して変えないようにする傾向", "リスクを分散するために投資先を多様化する原則"],
  answer: 1,
  explanation: "アンカリングとは最初に見た数値が後の判断の「基準点（アンカー）」になる現象。「株価が以前1万円だったから今の5000円は安い」という歪んだ判断がその典型。",
  keyword: "アンカリング効果"
}, {
  id: "ch1-beh-7",
  q: "「現状維持バイアス（ステータスクオ・バイアス）」の説明として最も適切なものはどれか？",
  choices: ["現在の投資ポートフォリオが最適であるという合理的な判断", "市場の現状を維持するための規制当局の介入方針", "新しい情報が出ても変化を避け、現在の状態を維持しようとする心理的傾向", "インデックス投資によって市場平均を維持しようとする投資戦略"],
  answer: 2,
  explanation: "現状維持バイアスは変化を嫌う心理傾向。年金の自動加入制度（opt-out）はこのバイアスを活用したナッジの代表例。放置型の非合理的投資行動の一因となる。",
  keyword: "現状維持バイアス"
}, {
  id: "ch1-beh-8",
  q: "「メンタルアカウンティング（心理的会計）」の説明として正しいものはどれか？",
  choices: ["企業の財務会計を心理学的観点から分析する手法", "同じ金額でも出所や用途によって価値を異なって感じ、別々に管理する心理傾向", "将来の収入を現在価値に割り引いて考える合理的な意思決定プロセス", "投資の損益を月次でメンタルヘルス的に管理する手法"],
  answer: 1,
  explanation: "メンタルアカウンティング（Thaler提唱）とはお金を「ボーナス口座」「生活費口座」などに心理的に仕分けする傾向。同額でも臨時収入の方が使いやすく感じるのはこのため。",
  keyword: "メンタルアカウンティング"
}, {
  id: "ch1-beh-9",
  q: "「過信バイアス（オーバーコンフィデンス）」とはどのような傾向か？",
  choices: ["リスクを適切に評価できず、常に安全側に偏る傾向", "過去の実績だけに基づいて将来を予測する傾向", "自分の能力・予測精度・知識を実際よりも過大評価する傾向", "専門家の意見を過度に信頼する傾向"],
  answer: 2,
  explanation: "過信バイアスは個人投資家に最も多く見られるバイアスの一つ。「自分は市場平均を上回れる」と思い込み、過度な売買・集中投資につながりやすい。",
  keyword: "過信バイアス"
}, {
  id: "ch1-beh-10",
  q: "「後知恵バイアス（ヒンドサイト・バイアス）」の説明として正しいものはどれか？",
  choices: ["過去の失敗を忘れて同じ投資を繰り返す傾向", "事後的に「そうなると分かっていた」と思い込み、予測精度を過大評価する傾向", "将来の市場変動を正確に予測できるという確信", "過去データを後から解析して投資判断を改善する手法"],
  answer: 1,
  explanation: "後知恵バイアスとは「あのとき分かっていた」と事後的に思い込む傾向。過去の運用結果の自己評価が歪み、過信バイアスをさらに強化する可能性がある。",
  keyword: "後知恵バイアス"
}];

// ============================================================
// 第2章 ゴールベース資産管理クイズ（CH2_QUIZZES）
// ============================================================
const CH2_QUIZZES = [{
  id: "ch2-gb-1",
  q: "「ゴールベース資産管理」の説明として最も適切なものはどれか？",
  choices: ["市場ベンチマークの上回りを目標とした運用アプローチ", "顧客ごとのライフゴール（人生の目標）の実現を中心に据えた資産管理アプローチ", "リターン最大化を唯一の目的として運用する手法", "短期的な資産増加を目指す積極的な運用手法"],
  answer: 1,
  explanation: "ゴールベース資産管理（Goal-Based Investing）は「老後資金確保」「教育資金準備」などの具体的なライフゴールを基準に資産配分や運用計画を立てるアプローチ。",
  keyword: "ゴールベース資産管理"
}, {
  id: "ch2-gb-2",
  q: "ゴールベース資産管理の基本プロセスとして正しい順序はどれか？",
  choices: ["リスク評価 → ゴール設定 → 運用開始 → 定期報告", "ゴール設定 → 実現シナリオ設定 → 投資の選択・実行 → 継続的レビュー", "市場分析 → ポートフォリオ構築 → ゴール設定 → 成果評価", "KYC（顧客把握） → 投資信託選択 → 購入 → 保有"],
  answer: 1,
  explanation: "ゴールベースのプロセスは①ゴール設定→②実現シナリオ設定（優先順位付け）→③投資選択・実行→④継続的レビューの4ステップ。継続的なレビューが特に重要。",
  keyword: "ゴールベースプロセス"
}, {
  id: "ch2-gb-3",
  q: "「ファンドラップ」の説明として正しいものはどれか？",
  choices: ["一つの投資信託を長期保有する「買いっぱなし」型の投資サービス", "複数の投資信託を組み合わせ、運用から報告まで一括して提供する投資一任サービス", "投資家が自分でファンドを選ぶセルフ型の資産運用プラットフォーム", "外国為替を活用した高リターン型の特定金融商品"],
  answer: 1,
  explanation: "ファンドラップは複数の投資信託をラップ（包み込む）した投資一任サービス。運用プロセス全体を金融機関に委任でき、ゴールベース管理の実践ツールとして拡大している。",
  keyword: "ファンドラップ"
}, {
  id: "ch2-gb-4",
  q: "ゴールベース管理における「ライフステージ」の考え方として正しいものはどれか？",
  choices: ["すべてのライフステージで同一の積極的な運用戦略を取ることが望ましい", "現役期は資産の積立・成長を重視し、退職後は取崩し・安定を重視する運用に移行する", "退職期こそリスク資産の比率を高めて資産を増やすべき期間である", "ライフステージに関わらず市場環境だけに基づいて資産配分を変更する"],
  answer: 1,
  explanation: "現役期（蓄積期）は長期・積立・分散で資産を積み上げ、退職後（取崩し期）は資産の取崩しペースと安定運用を重視する。コアとサテライトに分けた設計が重要。",
  keyword: "ライフステージ別管理"
}, {
  id: "ch2-gb-5",
  q: "ゴール設定において「必達ゴール（need）」と「理想ゴール（want）」を区別する理由はどれか？",
  choices: ["税制上の優遇を最大化するため", "運用コストを削減するため", "ゴールによってリスク許容度と最適な運用戦略が異なるため", "金融機関の手数料収入を最大化するため"],
  answer: 2,
  explanation: "「必達ゴール」（老後の生活費など）は資産不足が許されないので低リスク運用が適切。「理想ゴール」（豪華旅行など）は未達でも致命的でないのでリスクを取れる。",
  keyword: "ゴール優先順位付け"
}, {
  id: "ch2-gb-6",
  q: "「継続的レビュー」がゴールベース資産管理で重要な理由として最も適切なものはどれか？",
  choices: ["金融機関が手数料を定期的に徴収するために必要な手続きだから", "税務申告のために年次の取引確認が法律で義務付けられているから", "ライフイベントや市場環境の変化に応じてゴールや投資計画を見直すため", "投資信託の基準価額を月次で確認するための定期作業だから"],
  answer: 2,
  explanation: "ゴールベース管理は一度設定すれば終わりではない。結婚・出産・転職などのライフイベントや市場変化に応じてゴールの優先順位・実現シナリオ・資産配分を継続的に見直す。",
  keyword: "継続的レビュー"
}, {
  id: "ch2-gb-7",
  q: "「投資一任サービス」の説明として正しいものはどれか？",
  choices: ["顧客が金融機関に対し、すべての金融取引の代行を委任するサービス", "金融機関が顧客の同意なく自由に投資判断を行えるサービス", "事前に合意した運用方針に基づき、金融機関が個別の投資判断を委任されるサービス", "ロボアドバイザーが完全自動で資産を運用するAIサービス"],
  answer: 2,
  explanation: "投資一任サービスは事前に合意した方針（投資政策書）の範囲内で、金融機関（投資顧問）が顧客に代わって具体的な売買判断を行う。ファンドラップはその代表的な形態。",
  keyword: "投資一任サービス"
}, {
  id: "ch2-gb-8",
  q: "「長期・積立・分散」投資の説明として最も正しいものはどれか？",
  choices: ["短期間で大きな利益を得るための投機的な投資手法", "時間・銘柄・地域・資産クラスを分散させながら長期的に積み立て続けることでリスクを低減する投資手法", "長期間保有することで元本が必ず増える投資手法", "分散投資によってリスクをゼロにできる投資手法"],
  answer: 1,
  explanation: "「長期・積立・分散」は金融庁も推奨する資産形成の基本方針。ドルコスト平均法による積立効果、時間分散・地域分散・アセットクラス分散によるリスク低減が期待される。",
  keyword: "長期積立分散投資"
}];

// ============================================================
// 第6章 財務諸表クイズ（CH6_QUIZZES）
// ============================================================
const CH6_QUIZZES = [{
  id: "ch6-fs-1",
  q: "貸借対照表（B/S）が示すものとして正しいものはどれか？",
  choices: ["一定期間の収益・費用・利益の流れ", "特定時点における資産・負債・純資産の残高", "一定期間の現金の収支", "株主資本の変動の履歴"],
  answer: 1,
  explanation: "貸借対照表（Balance Sheet）は特定時点（決算日）の財政状態を示す。「資産 = 負債 + 純資産」という会計等式が常に成り立つ。",
  keyword: "貸借対照表"
}, {
  id: "ch6-fs-2",
  q: "損益計算書（P/L）で最初に表示される利益の段階はどれか？",
  choices: ["経常利益", "売上総利益（粗利益）", "営業利益", "当期純利益"],
  answer: 1,
  explanation: "P/Lの利益段階：①売上総利益→②営業利益→③経常利益→④税引前当期純利益→⑤当期純利益の順。売上高から売上原価を引いた「売上総利益（粗利益）」が最初。",
  keyword: "損益計算書"
}, {
  id: "ch6-fs-3",
  q: "ROE（自己資本利益率）の計算式として正しいものはどれか？",
  choices: ["当期純利益 ÷ 自己資本 × 100", "当期純利益 ÷ 総資産 × 100", "営業利益 ÷ 自己資本 × 100", "売上総利益 ÷ 自己資本 × 100"],
  answer: 0,
  explanation: "ROE（Return on Equity）= 当期純利益 ÷ 自己資本 × 100。株主から見た投資効率を示す。日本企業の目標水準として10%以上が目安とされる。",
  keyword: "ROE",
  isCalc: true
}, {
  id: "ch6-fs-4",
  q: "ROA（総資産利益率）の計算式として正しいものはどれか？",
  choices: ["当期純利益 ÷ 自己資本 × 100", "営業利益 ÷ 自己資本 × 100", "当期純利益（または営業利益）÷ 総資産 × 100", "売上高 ÷ 総資産 × 100"],
  answer: 2,
  explanation: "ROA（Return on Assets）= 純利益÷総資産×100。経営者が総資産をどれだけ効率的に活用して利益を生んだかを示す。ROE < ROAの場合、負債活用の効果がない。",
  keyword: "ROA",
  isCalc: true
}, {
  id: "ch6-fs-5",
  q: "PBR（株価純資産倍率）が1倍未満の状態が示すこととして正しいものはどれか？",
  choices: ["株価が1株当たり純資産（BPS）を下回っており、理論上は割安", "株価が過大評価されている", "企業の収益性が業界平均より高い", "株主還元が積極的である"],
  answer: 0,
  explanation: "PBR = 株価 ÷ BPS（1株当たり純資産）。PBR < 1は株価が解散価値を下回る状態。理論上は割安だが、低PBRが続く場合は事業の将来性に問題がある可能性もある。",
  keyword: "PBR",
  isCalc: true
}, {
  id: "ch6-fs-6",
  q: "流動比率の計算式と、一般的な「健全」水準の組み合わせとして正しいものはどれか？",
  choices: ["流動負債 ÷ 流動資産 × 100、200%以上", "流動資産 ÷ 流動負債 × 100、200%以上", "流動資産 ÷ 固定資産 × 100、100%以上", "固定負債 ÷ 流動資産 × 100、50%以下"],
  answer: 1,
  explanation: "流動比率 = 流動資産 ÷ 流動負債 × 100。短期債務の返済能力を示す安全性指標。一般的に200%以上が「健全」とされるが業種による差が大きい。",
  keyword: "流動比率",
  isCalc: true
}, {
  id: "ch6-fs-7",
  q: "キャッシュフロー計算書における「営業CF」の説明として正しいものはどれか？",
  choices: ["設備投資や有価証券の売買による現金の増減", "借入や社債発行による現金の増減", "本業の事業活動から生じる現金の増減", "配当金の支払いによる現金の減少"],
  answer: 2,
  explanation: "営業CFは本業から生み出すキャッシュを示す。健全企業は営業CFがプラスであることが重要。「黒字倒産」は損益が黒字でも営業CFがマイナスになる状態で起こる。",
  keyword: "営業キャッシュフロー"
}, {
  id: "ch6-fs-8",
  q: "自己資本比率の計算式として正しいものはどれか？",
  choices: ["自己資本 ÷ 負債 × 100", "自己資本 ÷ 総資産 × 100", "純利益 ÷ 自己資本 × 100", "負債 ÷ 総資産 × 100"],
  answer: 1,
  explanation: "自己資本比率 = 自己資本 ÷ 総資産 × 100。企業の財務安全性を示す。一般的に40%以上で「安全」とされるが、業種・規模によって基準が異なる。",
  keyword: "自己資本比率",
  isCalc: true
}, {
  id: "ch6-fs-9",
  q: "配当利回りの計算式として正しいものはどれか？",
  choices: ["1株当たり利益（EPS）÷ 株価 × 100", "1株当たり純資産（BPS）÷ 株価 × 100", "1株当たり年間配当金 ÷ 株価 × 100", "株価 ÷ 1株当たり配当金 × 100"],
  answer: 2,
  explanation: "配当利回り = 1株当たり年間配当金 ÷ 株価 × 100。投資金額に対する配当収益の割合。株価が下落しても利回りが上昇する点に注意（利回り上昇＝割安とは限らない）。",
  keyword: "配当利回り",
  isCalc: true
}, {
  id: "ch6-fs-10",
  q: "デュポン分析（DuPont Analysis）でROEを3分解した式として正しいものはどれか？",
  choices: ["ROE = 売上高純利益率 × 総資産回転率 × 財務レバレッジ", "ROE = 売上高成長率 × 株式回転率 × 配当利回り", "ROE = 営業利益率 × 自己資本回転率 × 流動比率", "ROE = PER × PBR × 配当性向"],
  answer: 0,
  explanation: "デュポン分析：ROE = 純利益率（収益性）× 総資産回転率（効率性）× 財務レバレッジ（安全性の逆）。ROEの改善要因を3分解することで経営課題が特定できる。",
  keyword: "デュポン分析"
}, {
  id: "ch6-fs-11",
  q: "EV/EBITDA倍率の説明として正しいものはどれか？",
  choices: ["時価総額を1株当たり利益で割った株価評価指標", "企業価値（時価総額＋純有利子負債）をEBITDAで割った企業評価指標", "純資産を総資産で割った安全性指標", "営業利益を売上高で割った収益性指標"],
  answer: 1,
  explanation: "EV/EBITDA = 企業価値（EV：時価総額＋有利子負債－現金）÷ EBITDA（利払・税・償却前利益）。国際比較や企業買収価値評価に使われ、国や業種を超えた比較が可能。",
  keyword: "EV/EBITDA"
}, {
  id: "ch6-fs-12",
  q: "インタレスト・カバレッジ・レシオの説明として正しいものはどれか？",
  choices: ["流動資産が流動負債を何倍カバーしているかを示す短期安全性指標", "営業利益（EBIT）が支払利息を何倍カバーしているかを示す安全性指標", "自己資本が有利子負債を何倍カバーしているかを示す財務健全性指標", "売上高が固定費を何倍カバーしているかを示す損益分岐点指標"],
  answer: 1,
  explanation: "インタレスト・カバレッジ・レシオ = 営業利益 ÷ 支払利息。利息支払い能力を示し、1倍を下回ると営業利益で利息を払えない危険な状態。通常3倍以上が望ましい。",
  keyword: "インタレスト・カバレッジ"
}];

// ============================================================
// 補論2 デリバティブ取引クイズ（SUPP2_QUIZZES）
// ============================================================
const SUPP2_QUIZZES = [{
  id: "supp2-d-1",
  q: "デリバティブ（金融派生商品）の説明として正しいものはどれか？",
  choices: ["国債や社債など元本が保証された固定収益商品", "株式・債券・為替などの原資産の価格変動に基づいて価値が決まる金融商品", "投資信託を複数組み合わせたラップ型金融商品", "預金に上乗せ金利が付く仕組預金"],
  answer: 1,
  explanation: "デリバティブ（derivative）は「派生」を意味し、株価・金利・為替・商品価格などの原資産価格から派生して価値が決まる金融商品の総称。ヘッジや投機に活用される。",
  keyword: "デリバティブ"
}, {
  id: "supp2-d-2",
  q: "先物取引の説明として正しいものはどれか？",
  choices: ["将来の特定日に特定価格で原資産を売買することを約束する取引", "原資産を買う権利を売買する取引", "2つのキャッシュフローを交換する取引", "原資産を現時点の価格で即座に売買する取引（現物取引）"],
  answer: 0,
  explanation: "先物（futures）は将来の特定日（満期日）に、あらかじめ合意した価格で売買する契約。買い手・売り手ともに義務が生じる点がオプションと異なる。取引所で標準化されている。",
  keyword: "先物取引"
}, {
  id: "supp2-d-3",
  q: "コール・オプション（call option）の説明として正しいものはどれか？",
  choices: ["特定の原資産を一定価格（行使価格）で売る権利", "特定の原資産の価格変動に連動して損益が決まる義務的な契約", "特定の原資産を一定価格（行使価格）で買う権利", "将来の金利差を受け取る権利"],
  answer: 2,
  explanation: "コール・オプションは原資産を「行使価格で買う権利」。原資産価格が行使価格より高くなれば行使して利益を得る。権利の対価として「プレミアム」を支払う。",
  keyword: "コールオプション"
}, {
  id: "supp2-d-4",
  q: "プット・オプション（put option）の説明として正しいものはどれか？",
  choices: ["特定の原資産を一定価格（行使価格）で買う権利", "特定の原資産を一定価格（行使価格）で売る権利", "将来の決められた日に原資産を売買する義務", "2つの固定・変動金利を交換する権利"],
  answer: 1,
  explanation: "プット・オプションは原資産を「行使価格で売る権利」。原資産価格が行使価格より低くなれば行使して利益を得る。株式ポートフォリオの下落リスクヘッジに活用される。",
  keyword: "プットオプション"
}, {
  id: "supp2-d-5",
  q: "オプション取引における「プレミアム（option premium）」とは何か？",
  choices: ["オプションの利益（行使価格と市場価格の差額）", "オプションの権利を取得するために支払う対価（オプション料）", "オプション取引にかかる取引所手数料", "オプションの満期時に受け取るキャッシュフロー"],
  answer: 1,
  explanation: "プレミアムはオプションの価格であり、権利を買う対価。プレミアムは「本質的価値」（即行使した場合の価値）と「時間的価値」（残存期間に対する期待）で構成される。",
  keyword: "オプションプレミアム"
}, {
  id: "supp2-d-6",
  q: "先物取引とオプション取引の主な違いとして正しいものはどれか？",
  choices: ["先物は売買の義務が生じるが、オプションは権利であり行使は任意", "先物は取引所のみだが、オプションはOTC（店頭）でのみ取引される", "先物は株式のみ対象だが、オプションはあらゆる資産が対象", "先物は短期、オプションは長期の取引にのみ利用される"],
  answer: 0,
  explanation: "先物は売買双方に義務（取引しない自由はない）。オプション買い手は行使するかどうかを選べる。行使しなければプレミアムだけが損失。この「義務と権利の違い」が核心。",
  keyword: "先物とオプションの違い"
}, {
  id: "supp2-d-7",
  q: "金利スワップ（interest rate swap）の最も一般的な形態はどれか？",
  choices: ["日本円と米ドルの元本を交換する取引", "株式の配当と債券の利子を交換する取引", "固定金利の支払いと変動金利の受け取りを交換する取引", "現物株と先物の差額を交換する取引"],
  answer: 2,
  explanation: "金利スワップの典型は「固定金利支払い ↔ 変動金利受け取り」。変動金利の借入れを実質固定化するヘッジや、金利変動を利用した運用戦略に活用される。元本は交換しない。",
  keyword: "金利スワップ"
}, {
  id: "supp2-d-8",
  q: "デリバティブを活用した「ヘッジ取引」の目的として正しいものはどれか？",
  choices: ["レバレッジを利かせて投資リターンを最大化すること", "税金の支払いを将来に繰り延べること", "既存の資産・負債が持つリスクを相殺・軽減すること", "市場平均（ベンチマーク）を上回る超過収益を狙うこと"],
  answer: 2,
  explanation: "ヘッジ取引（hedging）は「生け垣」が語源で、既存ポジションのリスクを反対ポジションで相殺する戦略。為替ヘッジ・金利ヘッジ・株価ヘッジなどがある。",
  keyword: "ヘッジ取引"
}, {
  id: "supp2-d-9",
  q: "原資産価格の上昇によって損失が生じるデリバティブポジションはどれか？",
  choices: ["コール・オプションの買い（ロング・コール）", "プット・オプションの買い（ロング・プット）", "先物の買い（ロング・ポジション）", "コール・オプションの売り（ショート・コール）"],
  answer: 3,
  explanation: "コールオプション売り（ショートコール）は原資産が上昇すると、相手（買い手）が行使してくるため損失が拡大する（理論上無限大）。ヘッジなしの「裸のコール売り」は最もリスクが高い。",
  keyword: "デリバティブポジション"
}, {
  id: "supp2-d-10",
  q: "為替予約（currency forward）の説明として正しいものはどれか？",
  choices: ["外貨を市場の現在レート（スポットレート）で即座に交換する取引", "将来の特定日に特定の為替レートで外貨と円を交換することを約束する取引", "外貨建て資産から受け取る利子をヘッジする金利スワップの一種", "オプション取引を使って為替の下落リスクだけを回避する取引"],
  answer: 1,
  explanation: "為替予約は将来の売買レートを現時点で確定する先渡し取引（OTC先物）。輸出入企業が為替リスクをヘッジするのに活用。確定レートはスポットレートに「スワップコスト」を加味した水準。",
  keyword: "為替予約"
}];

// --- 倫理タブ クイズデータ ---
const ETHICS_QUIZZES = {
  A: [{
    id: "e-a-1",
    q: "フィデューシャリーデューティーの説明として最も適切なものはどれか？",
    choices: ["金融機関が自社の利益を最大化するための義務", "顧客の最善の利益を最優先に考えた行動義務（受託者責任）", "規制当局への報告義務", "株主への利益還元義務"],
    answer: 1,
    explanation: "フィデューシャリー（fiduciary）は「受託者」の意味。顧客から信頼を受けた者が顧客の最善の利益のために行動する義務です。",
    keyword: "フィデューシャリー"
  }, {
    id: "e-a-2",
    q: "金融庁「顧客本位の業務運営に関する原則」が策定されたのはいつか？",
    choices: ["2010年", "2014年", "2017年", "2020年"],
    answer: 2,
    explanation: "2017年に金融庁が策定。プリンシプルベース（原則主義）のアプローチを採用しています。",
    keyword: "顧客本位原則"
  }, {
    id: "e-a-3",
    q: "7原則のうち「利益相反の適切な管理」に該当する具体例はどれか？",
    choices: ["顧客の年齢に合わせた商品を選ぶこと", "販売手数料の高い商品を優先して販売していないか管理すること", "顧客に毎月レポートを送ること", "投資信託の基準価額を毎日確認すること"],
    answer: 1,
    explanation: "自社の手数料収入と顧客の利益が相反する状況を適切に管理することが「利益相反管理」の典型例です。",
    keyword: "利益相反"
  }, {
    id: "e-a-4",
    q: "顧客本位の7原則において「手数料等の明確化」に関する正しい記述はどれか？",
    choices: ["購入時手数料のみ開示すれば十分", "信託報酬は開示不要", "名目を問わずあらゆる手数料・費用を顧客が理解できるよう提供する", "手数料は競合他社と同水準であれば開示不要"],
    answer: 2,
    explanation: "「名目を問わず」がポイント。購入時手数料・信託報酬・解約手数料など、すべての費用を明確にする必要があります。",
    keyword: "手数料開示"
  }, {
    id: "e-a-5",
    q: "適合性の原則に照らして不適切な行動はどれか？",
    choices: ["リスク許容度が低い顧客に低リスク商品を提案する", "退職金を受け取った高齢者に元本保証商品を優先的に紹介する", "投資経験がない顧客にハイリスク・ハイリターン商品を積極的に販売する", "目標リターンと期間を確認した上で商品を提案する"],
    answer: 2,
    explanation: "投資経験のない顧客にハイリスク商品を販売することは、適合性の原則（顧客の状況に見合った商品提案）に違反します。",
    keyword: "適合性の原則"
  }, {
    id: "e-a-6",
    q: "KYC（Know Your Customer）の目的として最も適切なものはどれか？",
    choices: ["顧客から高い手数料を得るため", "顧客の状況・目的・リスク許容度を把握し、適切なサービスを提供するため", "マーケティングデータを収集するため", "税務当局への報告のため"],
    answer: 1,
    explanation: "KYCは顧客の財務状況・投資目的・リスク許容度などを正確に把握することで、顧客に最適なサービスを提供するためのプロセスです。",
    keyword: "KYC"
  }, {
    id: "e-a-7",
    q: "7原則の「従業員への適切な動機づけ」の目的として正しいものはどれか？",
    choices: ["売上目標を達成するよう従業員を激励すること", "顧客本位の業務運営を促進するための報酬体系・評価体制を整備すること", "従業員の昇給を保証すること", "残業を削減すること"],
    answer: 1,
    explanation: "顧客本位の行動を促すインセンティブ設計（例：販売額ではなく顧客満足度で評価）が「従業員への適切な動機づけ」の趣旨です。",
    keyword: "従業員動機づけ"
  }, {
    id: "e-a-8",
    q: "フィデューシャリーデューティーとプリンシプルベースアプローチの関係について正しいものはどれか？",
    choices: ["金融庁は細かなルールを設けてルールベースで規制している", "7原則は法的拘束力があり違反すると罰則がある", "7原則は原則主義（プリンシプルベース）で、各社が自主的に遵守状況を公表する", "7原則はEUのMiFID IIと全く同じ内容である"],
    answer: 2,
    explanation: "日本の顧客本位原則はプリンシプルベース（原則主義）を採用。各金融事業者が自ら方針を策定・公表し、実践状況を開示します。直接の罰則はありません。",
    keyword: "プリンシプルベース"
  }],
  B: [{
    id: "e-b-1",
    q: "ライフプランニングの基本ステップとして正しい順序はどれか？",
    choices: ["ゴール設定 → 現状把握 → ギャップ分析 → 解決策提案 → 実行・モニタリング", "現状把握 → ゴール設定 → 解決策提案 → ギャップ分析 → 実行・モニタリング", "解決策提案 → ゴール設定 → 現状把握 → ギャップ分析 → 実行・モニタリング", "ゴール設定 → ギャップ分析 → 現状把握 → 解決策提案 → 実行・モニタリング"],
    answer: 0,
    explanation: "まずゴールを設定し、次に現状を把握し、ギャップを分析してから解決策を提案・実行するのが正しいステップです。",
    keyword: "ライフプランニング"
  }, {
    id: "e-b-2",
    q: "顧客のリスク許容度を判断する際に考慮すべき要素として不適切なものはどれか？",
    choices: ["年齢・投資期間", "収入の安定性・資産規模", "担当営業員の営業目標", "損失が発生した場合の心理的耐性"],
    answer: 2,
    explanation: "リスク許容度は顧客自身の財務状況・心理的耐性・投資期間等で判断します。営業員の目標は顧客のリスク許容度と無関係です。",
    keyword: "リスク許容度"
  }, {
    id: "e-b-3",
    q: "顧客との信頼関係構築において重要な「三方よし」の考え方として正しいものはどれか？",
    choices: ["顧客・金融機関・規制当局の三者が満足すること", "顧客・金融機関・社会（第三者）すべてに良い結果をもたらすこと", "顧客の利益・売上・コストのバランスをとること", "短期・中期・長期の利益を最大化すること"],
    answer: 1,
    explanation: "「三方よし」は近江商人の概念。顧客（買い手）、金融機関（売り手）、社会（世間）すべてにとって良い取引を実現することが真の顧客本位です。",
    keyword: "三方よし"
  }, {
    id: "e-b-4",
    q: "定期的なポートフォリオのモニタリングが必要な理由として最も適切なものはどれか？",
    choices: ["手数料収入を増やすため頻繁に売買するため", "当初の資産配分が市場変動でずれた場合にリバランスし、顧客の目標に沿った運用を維持するため", "相場が上昇しているときに追加購入するため", "毎月新しい金融商品に乗り換えるため"],
    answer: 1,
    explanation: "市場変動によりアセットアロケーションがずれることがあります。定期的なモニタリングとリバランスで、顧客の目標・リスク許容度に沿った運用を継続します。",
    keyword: "モニタリング・リバランス"
  }, {
    id: "e-b-5",
    q: "顧客との面談において、最初に確認すべき最も重要な事項はどれか？",
    choices: ["今月の推奨銘柄", "顧客の投資目的・ゴール・期間", "自社の手数料体系", "市場の見通し"],
    answer: 1,
    explanation: "顧客本位の観点から、まず顧客の「なぜ投資するのか（目的）」「いつまでに（期間）」「いくら必要か（ゴール）」を把握することが最優先です。",
    keyword: "投資目的確認"
  }],
  C: [{
    id: "e-c-1",
    q: "新NISA（2024年〜）の年間投資上限額として正しいものはどれか？",
    choices: ["年120万円", "年240万円", "年360万円", "年480万円"],
    answer: 2,
    explanation: "つみたて投資枠120万円＋成長投資枠240万円＝年間360万円。生涯非課税限度額は1,800万円（うち成長投資枠は最大1,200万円）。",
    keyword: "新NISA限度額"
  }, {
    id: "e-c-2",
    q: "NISA口座での運用損失について正しい記述はどれか？",
    choices: ["一般口座・特定口座との損益通算が可能", "損失は翌年に繰越控除できる", "NISA口座の損失は他の口座との損益通算・繰越控除ができない", "損失が出た場合は非課税枠が翌年に追加される"],
    answer: 2,
    explanation: "NISA口座は非課税メリットがある反面、損失が出ても他の課税口座の利益との損益通算や繰越控除はできません。これは頻出ひっかけ問題です。",
    keyword: "NISA損益通算",
    isHikakke: true
  }, {
    id: "e-c-3",
    q: "iDeCoの掛金に関する税制優遇として正しいものはどれか？",
    choices: ["掛金の50%が税額控除される", "掛金の全額が所得控除（小規模企業共済等掛金控除）として適用される", "掛金は損金算入できる", "掛金の20%が税額控除される"],
    answer: 1,
    explanation: "iDeCoの掛金は全額「小規模企業共済等掛金控除」として所得から控除されます。所得税率が高い人ほど節税効果が大きくなります。",
    keyword: "iDeCo税制優遇"
  }, {
    id: "e-c-4",
    q: "iDeCoの原則的な受取開始年齢として正しいものはどれか？",
    choices: ["50歳以降", "55歳以降", "60歳以降", "65歳以降"],
    answer: 2,
    explanation: "iDeCoは原則60歳以降に受給開始。なお、60歳時点で加入期間が10年未満の場合は受給開始年齢が遅くなります（最大65歳）。",
    keyword: "iDeCo受給開始"
  }, {
    id: "e-c-5",
    q: "ESG投資の「S」が意味するものはどれか？",
    choices: ["Security（安全性）", "Sustainability（持続可能性）", "Social（社会）", "Stability（安定性）"],
    answer: 2,
    explanation: "ESGはEnvironment（環境）・Social（社会）・Governance（企業統治）の略。財務情報だけでなく非財務情報を投資判断に組み込む手法です。",
    keyword: "ESG投資"
  }, {
    id: "e-c-6",
    q: "ESG投資のアプローチのうち「ポジティブスクリーニング」の説明として正しいものはどれか？",
    choices: ["ESGスコアの低い企業を投資対象から除外する", "ESGスコアの高い優良企業を積極的に投資対象に選ぶ", "企業との対話（エンゲージメント）で改善を促す", "財務的リターンと社会的インパクトの両方を追求する"],
    answer: 1,
    explanation: "ポジティブスクリーニング（選別投資）：ESGで優秀な企業を積極的に選ぶ。対して、問題企業を除外するのはネガティブスクリーニングです。",
    keyword: "ESGスクリーニング"
  }, {
    id: "e-c-7",
    q: "資産形成において「老後2,000万円問題」の根拠として用いられた試算条件はどれか？",
    choices: ["30年間で月5万円の赤字が生じるという試算", "65歳以降30年間で月約5.5万円の赤字が生じるという試算（2019年金融審議会）", "現役世代の平均貯蓄額が2,000万円以下であるという統計", "株式投資で2,000万円失うリスクがあるという警告"],
    answer: 1,
    explanation: "2019年金融審議会市場ワーキング・グループ報告書で、夫婦2人の老後30年間で約2,000万円が不足するという試算が注目されました（月約5.5万円の赤字×20年=1,300万円、30年=2,000万円）。",
    keyword: "老後2000万円"
  }, {
    id: "e-c-8",
    q: "新NISAにおいて、非課税枠の再利用（翌年の枠回復）について正しいものはどれか？",
    choices: ["売却しても枠は一切回復しない（旧NISAと同じ）", "売却した分の取得価額（簿価）に相当する非課税枠が翌年以降に復活する", "売却した翌月に枠が回復する", "枠の回復は5年に1度"],
    answer: 1,
    explanation: "新NISAの重要な特徴。売却した場合、その商品の取得価額分の非課税枠が翌年に復活します（生涯枠1,800万円の中で何度でも使い直し可能）。",
    keyword: "NISA枠回復"
  }]
};

// --- 資産クラスデータ（②基礎タブ用） ---
const ASSET_CLASS_DATA = [{
  name: "国内債券",
  expectedReturn: 0.015,
  risk: 0.025,
  color: "#4A90D9",
  desc: "安定・低リスク"
}, {
  name: "国内株式",
  expectedReturn: 0.045,
  risk: 0.180,
  color: "#50C878",
  desc: "中リターン・中リスク"
}, {
  name: "外国債券",
  expectedReturn: 0.030,
  risk: 0.120,
  color: "#FFB347",
  desc: "中リターン・中リスク"
}, {
  name: "外国株式",
  expectedReturn: 0.055,
  risk: 0.220,
  color: "#9B59B6",
  desc: "高リターン・高リスク"
}, {
  name: "国内REIT",
  expectedReturn: 0.040,
  risk: 0.175,
  color: "#E74C3C",
  desc: "中〜高リターン"
}];

// --- 正規分布データ生成 ---
function generateNormalDist(mean, sigma, points = 80) {
  const data = [];
  const xMin = mean - 4 * sigma;
  const xMax = mean + 4 * sigma;
  for (let i = 0; i <= points; i++) {
    const x = xMin + i / points * (xMax - xMin);
    const y = 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
    data.push({
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(5))
    });
  }
  return data;
}

// --- ②基礎タブ クイズデータ（セクションA・B・C） ---
const BASICS_QUIZZES = {
  A: [{
    id: "b-a-1",
    q: "算術平均リターンと幾何平均リターンの使い分けとして正しいものはどれか？",
    choices: ["将来のリターン予測には算術平均、過去の実績評価には幾何平均を用いる", "将来のリターン予測には幾何平均、過去の実績評価には算術平均を用いる", "どちらも同じ値になるので使い分ける必要はない", "算術平均は常に幾何平均より小さい"],
    answer: 0,
    explanation: "将来予測（期待リターンの推定）には算術平均、過去の複利ベースの実績評価には幾何平均を用います。算術平均≥幾何平均（等号は全リターンが等しい時のみ）。",
    keyword: "算術平均vs幾何平均",
    isHikakke: true
  }, {
    id: "b-a-2",
    q: "期初価格100円・期末価格115円・配当3円のとき、単純リターン（保有期間リターン）はいくらか？",
    choices: ["15%", "18%", "3%", "12%"],
    answer: 1,
    isCalc: true,
    explanation: "(115 - 100 + 3) / 100 × 100 = 18%",
    keyword: "単純リターン計算"
  }, {
    id: "b-a-3",
    q: "2年間で保有期間リターンが44%だった場合、年率リターン（複利換算）はいくらか？",
    choices: ["22%", "約20%", "約18%", "約16%"],
    answer: 1,
    isCalc: true,
    explanation: "(1 + 0.44)^(1/2) - 1 ≈ 0.2000 = 20%。√1.44 = 1.2より年率約20%。",
    keyword: "年率リターン計算"
  }, {
    id: "b-a-4",
    q: "3年間のリターンが+20%, -10%, +15%だった場合、幾何平均リターンはいくらか？",
    choices: ["約8.3%", "約7.8%", "約6.5%", "約9.0%"],
    answer: 1,
    isCalc: true,
    explanation: "(1.20 × 0.90 × 1.15)^(1/3) - 1 = (1.2420)^(1/3) - 1 ≈ 7.78%",
    keyword: "幾何平均リターン"
  }, {
    id: "b-a-5",
    q: "「算術平均は常に幾何平均以上になる」という関係はいつ等号（=）が成立するか？",
    choices: ["リターンが常にプラスのとき", "すべての期間のリターンが同じ値のとき", "投資期間が長いとき", "リスク（標準偏差）がゼロのとき"],
    answer: 1,
    explanation: "算術平均≥幾何平均（相加相乗平均の不等式）。等号はすべてのリターンが等しい時（例：毎年10%ずつ）にのみ成立します。",
    keyword: "算術平均≥幾何平均"
  }, {
    id: "b-a-6",
    q: "年率10%で5年間複利運用した場合、100万円はいくらになるか？",
    choices: ["約150万円", "約161万円", "約155万円", "約170万円"],
    answer: 1,
    isCalc: true,
    explanation: "100万円 × (1.10)^5 = 100万円 × 1.61051 ≈ 161万円",
    keyword: "複利計算"
  }, {
    id: "b-a-7",
    q: "保有期間リターンの計算式として正しいものはどれか？",
    choices: ["（期末価格 + 配当）/ 期初価格", "（期末価格 - 期初価格 + 配当）/ 期初価格", "（期末価格 - 期初価格）/ 期末価格 + 配当", "（期初価格 - 期末価格 + 配当）/ 期初価格"],
    answer: 1,
    explanation: "R = (期末価格 - 期初価格 + 配当) / 期初価格。分母は「期初価格（投資元本）」です。",
    keyword: "保有期間リターン"
  }, {
    id: "b-a-8",
    q: "リターンの計算において「ドルコスト平均法」で定期積立した場合の平均取得単価はどうなるか？",
    choices: ["算術平均取得単価と常に一致する", "算術平均取得単価より常に高くなる", "算術平均取得単価より低くなる（安く買えるメリット）", "算術平均取得単価と同じになる"],
    answer: 2,
    explanation: "一定額を定期購入するドルコスト平均法では、価格が安い時に多く購入できるため、平均取得単価が算術平均より低くなります。",
    keyword: "ドルコスト平均法"
  }],
  B: [{
    id: "b-b-1",
    q: "リターンが10%, 20%, -5%, 15%（平均10%）のとき分散はいくらか？",
    choices: ["約75", "約87.5", "約100", "約62.5"],
    answer: 1,
    isCalc: true,
    explanation: "各偏差²: (10-10)²=0, (20-10)²=100, (-5-10)²=225, (15-10)²=25。平均=(0+100+225+25)/4=87.5",
    keyword: "分散計算"
  }, {
    id: "b-b-2",
    q: "標準偏差（リスク）が大きいほど、投資のリスクはどうなるか？",
    choices: ["リスクが小さく安全な投資", "リターンが安定していることを示す", "リターンのばらつきが大きく、高リスクな投資", "期待リターンが高いことを示す"],
    answer: 2,
    explanation: "標準偏差はリターンの「ばらつき」を表します。標準偏差が大きい＝リターンが予想から大きく外れる可能性が高い＝ハイリスクです。",
    keyword: "標準偏差の意味"
  }, {
    id: "b-b-3",
    q: "相関係数-1の2資産でポートフォリオを組んだ場合の説明として正しいものはどれか？",
    choices: ["リスクは2倍になる", "リターンはゼロになる", "適切な比率で組み合わせるとリスクをゼロにできる（理論上）", "相関-1は現実には存在しない"],
    answer: 2,
    explanation: "相関係数-1（完全逆相関）では、一方が上がる時他方が下がるため、適切な比率で組み合わせるとリスクを理論上ゼロにできます。これは試験頻出のひっかけです。",
    keyword: "相関係数-1",
    isHikakke: true
  }, {
    id: "b-b-4",
    q: "2資産の相関係数を求める式として正しいものはどれか？",
    choices: ["ρ = σA × σB / Cov(A,B)", "ρ = Cov(A,B) / (σA × σB)", "ρ = (σA + σB) / Cov(A,B)", "ρ = Cov(A,B) × σA × σB"],
    answer: 1,
    explanation: "ρ(A,B) = Cov(A,B) / (σA × σB)。相関係数は共分散を両資産の標準偏差の積で割った値で、-1から+1の範囲に正規化されます。",
    keyword: "相関係数の公式"
  }, {
    id: "b-b-5",
    q: "分散投資の効果が最も大きくなる相関係数の組み合わせはどれか？",
    choices: ["ρ = +1", "ρ = +0.5", "ρ = 0", "ρ = -1"],
    answer: 3,
    explanation: "相関係数が低い（または負の）ほど分散効果が大きい。ρ=-1が最大の分散効果（理論上リスクゼロが可能）。ρ=+1では分散効果なし。",
    keyword: "分散効果と相関係数"
  }, {
    id: "b-b-6",
    q: "シャープレシオの計算式として正しいものはどれか？",
    choices: ["SR = Rp / σp", "SR = (Rp - Rf) / σp", "SR = (Rp - Rf) × σp", "SR = σp / (Rp - Rf)"],
    answer: 1,
    explanation: "シャープレシオ = (ポートフォリオのリターン - リスクフリーレート) / 標準偏差。リスク1単位あたりの超過リターンを表します。",
    keyword: "シャープレシオ公式"
  }, {
    id: "b-b-7",
    q: "ポートフォリオのリターン12%、リスクフリーレート2%、標準偏差15%のとき、シャープレシオはいくらか？",
    choices: ["0.50", "0.67", "0.80", "1.00"],
    answer: 1,
    isCalc: true,
    explanation: "SR = (12% - 2%) / 15% = 10% / 15% = 0.667",
    keyword: "シャープレシオ計算"
  }, {
    id: "b-b-8",
    q: "「シャープレシオが高い＝必ず良い投資」という考え方について正しいのはどれか？",
    choices: ["正しい。シャープレシオが高いほど常に優れた投資である", "誤り。シャープレシオは同じリスク水準のポートフォリオ間での比較に意味があり、絶対的な良し悪しは判断できない", "正しい。リターンが高ければ必ずシャープレシオも高い", "誤り。シャープレシオが高いほど損失が大きい"],
    answer: 1,
    explanation: "シャープレシオは相対的な効率性指標。同水準のリスクを持つポートフォリオの比較に有効ですが、絶対的な良し悪しや異なるリスク水準の比較には注意が必要です。",
    keyword: "シャープレシオの限界",
    isHikakke: true
  }],
  C: [{
    id: "b-c-1",
    q: "現在価値（PV）の計算式として正しいものはどれか？",
    choices: ["PV = FV × (1 + r)^n", "PV = FV / (1 + r)^n", "PV = FV + r × n", "PV = FV - r^n"],
    answer: 1,
    explanation: "PV = FV / (1+r)^n。将来価値を割引率(1+r)のn乗で割り引くことで現在価値を求めます。割引率が高い・期間が長いほどPVは小さくなります。",
    keyword: "現在価値公式"
  }, {
    id: "b-c-2",
    q: "割引率3%、5年後の将来価値100万円の現在価値に最も近いものはどれか？",
    choices: ["86.3万円", "85.0万円", "88.0万円", "90.0万円"],
    answer: 0,
    isCalc: true,
    explanation: "PV = 100万 / (1.03)^5 = 100万 / 1.15927 ≈ 86.26万円",
    keyword: "現在価値計算"
  }, {
    id: "b-c-3",
    q: "割引率が上昇した場合、現在価値はどうなるか？",
    choices: ["現在価値は上昇する", "現在価値は変わらない", "現在価値は低下する", "割引率と現在価値は無関係"],
    answer: 2,
    explanation: "PV = FV / (1+r)^n。割引率rが上昇すると分母が大きくなるため、現在価値は低下します。これは債券価格と金利の逆相関と同じ原理です。",
    keyword: "割引率と現在価値の関係"
  }, {
    id: "b-c-4",
    q: "正規分布において「平均±2σ」の範囲に含まれる確率はおよそいくらか？",
    choices: ["約68%", "約95%", "約99.7%", "約50%"],
    answer: 1,
    explanation: "正規分布：±1σ≈68%、±2σ≈95%、±3σ≈99.7%（3シグマルール）。ABC試験でよく出題される数値です。",
    keyword: "3シグマルール"
  }, {
    id: "b-c-5",
    q: "VaR（バリュー・アット・リスク）95%信頼水準の意味として正しいものはどれか？",
    choices: ["95%の確率で利益が出ることを保証する", "1日のうち95%の確率で損失がゼロであることを示す", "95%の信頼水準で、ある期間内の最大損失額を示す（5%の確率でこれを超える損失が発生する可能性）", "過去95日間の最大損失額"],
    answer: 2,
    explanation: "VaR（Value at Risk）：95%信頼水準のVaRは「1日（または一定期間）に、5%の確率でVaR以上の損失が発生する可能性がある」という意味です。",
    keyword: "VaR"
  }, {
    id: "b-c-6",
    q: "アセットアロケーション（資産配分）がリターンに与える影響として、研究（Brinson et al.）で示されたことはどれか？",
    choices: ["リターンの約30%はアセットアロケーションで決まる", "リターンの約50%はアセットアロケーションで決まる", "リターンの約90%はアセットアロケーションで決まる", "アセットアロケーションはリターンにほぼ影響しない"],
    answer: 2,
    explanation: "Brinson et al.の研究によると、ポートフォリオリターンの変動の約90%はアセットアロケーション（資産配分）の決定によって説明されるとされています。",
    keyword: "アセットアロケーションの重要性"
  }, {
    id: "b-c-7",
    q: "「アセットロケーション」の説明として正しいものはどれか？",
    choices: ["どの資産クラスに何%配分するかを決めること", "どの口座（NISA・iDeCo・課税口座）に、どの資産を配置するかを最適化すること", "海外資産を国内資産に変換すること", "不動産の所在地を選定すること"],
    answer: 1,
    explanation: "アセットロケーション（≠アセットアロケーション）は口座の使い分け。税効率を高めるために、例えばREIT（分配金課税あり）をNISA・iDeCoに置くなどの戦略です。",
    keyword: "アセットロケーション",
    isHikakke: true
  }, {
    id: "b-c-8",
    q: "95%信頼水準のVaRをCAPM的に計算する場合、使用するzスコアはいくらか？",
    choices: ["1.28", "1.645", "1.96", "2.326"],
    answer: 1,
    isCalc: true,
    explanation: "95%信頼水準（片側5%）のzスコアは1.645。VaR = 平均 - 1.645×σ。90%なら1.28、97.5%なら1.96、99%なら2.326です。",
    keyword: "VaR計算・zスコア"
  }]
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
    [-1, -0.5, 0, 0.5, 1].forEach(rho => {
      const ret = wA * rA + wB * rB;
      const variance = wA * wA * sigA * sigA + wB * wB * sigB * sigB + 2 * wA * wB * rho * sigA * sigB;
      const sig = Math.sqrt(Math.max(0, variance));
      data.push({
        rho,
        wA: parseFloat(wA.toFixed(2)),
        ret: parseFloat((ret * 100).toFixed(2)),
        sig: parseFloat((sig * 100).toFixed(2))
      });
    });
  }
  return data;
}

// --- SML（証券市場線）データ生成 ---
function generateSML(rf, rm, betaMin = -0.5, betaMax = 2.5, steps = 30) {
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const beta = betaMin + i / steps * (betaMax - betaMin);
    const er = rf + beta * (rm - rf);
    data.push({
      beta: parseFloat(beta.toFixed(2)),
      er: parseFloat((er * 100).toFixed(2))
    });
  }
  return data;
}

// --- ③ポートフォリオ理論 クイズデータ ---
const PORTFOLIO_QUIZZES = {
  A: [{
    id: "p-a-1",
    q: "2資産ポートフォリオで、相関係数が+1のとき分散効果はどうなるか？",
    choices: ["完全にリスクを消去できる", "部分的に分散効果がある", "分散効果はなく、リスクは加重平均となる", "リスクが2倍になる"],
    answer: 2,
    explanation: "相関係数ρ=+1（完全正相関）では分散効果がなく、ポートフォリオのリスクは各資産のリスクの加重平均に等しくなります。",
    keyword: "相関係数+1",
    isHikakke: true
  }, {
    id: "p-a-2",
    q: "資産A（リターン8%, リスク15%）と資産B（リターン4%, リスク5%）、相関係数0、配分50:50のポートフォリオリターンはいくらか？",
    choices: ["4%", "6%", "8%", "12%"],
    answer: 1,
    isCalc: true,
    explanation: "ポートフォリオリターン = 0.5×8% + 0.5×4% = 6%。リターンは単純加重平均です。",
    keyword: "PFリターン計算"
  }, {
    id: "p-a-3",
    q: "資産A（σ=15%）と資産B（σ=10%）を50:50で組み合わせ、相関係数ρ=0のとき、ポートフォリオのリスクはいくらか？",
    choices: ["12.5%", "9.0%", "約9.0%", "5%"],
    answer: 2,
    isCalc: true,
    explanation: "σP = √(0.25×0.0225 + 0.25×0.01 + 0) = √(0.005625+0.0025) = √0.008125 ≈ 9.01%",
    keyword: "PFリスク計算ρ=0"
  }, {
    id: "p-a-4",
    q: "分散投資によってリスクを低減できない「システマティックリスク」の別名はどれか？",
    choices: ["非市場リスク・固有リスク", "アンシステマティックリスク", "市場リスク・ベータリスク", "流動性リスク"],
    answer: 2,
    explanation: "システマティックリスク（市場リスク）：市場全体に影響するリスクで分散投資では消去できない。βで計測。非システマティックリスク（固有リスク）は分散で消去可能。",
    keyword: "システマティックリスク"
  }, {
    id: "p-a-5",
    q: "2資産ポートフォリオのリスクがゼロになる条件はどれか？",
    choices: ["相関係数ρ=0で任意の比率", "相関係数ρ=-1で特定の比率（σA×wA = σB×wB）", "どちらかの資産のリスクがゼロ", "両資産のリターンが等しいとき"],
    answer: 1,
    explanation: "ρ=-1（完全逆相関）で、かつwA×σA = wB×σBという特定の比率でのみポートフォリオリスクがゼロになります。この比率：wA = σB/(σA+σB)。",
    keyword: "PFリスクゼロ条件"
  }, {
    id: "p-a-6",
    q: "「最小分散ポートフォリオ」の説明として正しいものはどれか？",
    choices: ["最も高いリターンを追求するポートフォリオ", "シャープレシオが最大となるポートフォリオ", "同じリターン水準の中でリスクが最小となるポートフォリオの集合点（最もリスクが低い点）", "リスクフリー資産のみで構成されるポートフォリオ"],
    answer: 2,
    explanation: "最小分散ポートフォリオは効率的フロンティア上の最もリスクが低い点。これより低いリターンを受け入れてもリスクは低下しません。",
    keyword: "最小分散ポートフォリオ"
  }, {
    id: "p-a-7",
    q: "効率的フロンティアの説明として正しいものはどれか？",
    choices: ["同じリスクで最大リターン（または同じリターンで最小リスク）のポートフォリオの集合", "すべての資産を等分に持つポートフォリオの軌跡", "リスクフリー資産と市場ポートフォリオを結ぶ直線", "CAPMで計算される理論価格の集合"],
    answer: 0,
    explanation: "効率的フロンティア：同じリスクで最大リターンを実現するポートフォリオの集合。CML（資本市場線）との接点が接点ポートフォリオ（市場PF・最大シャープレシオ）。",
    keyword: "効率的フロンティア"
  }, {
    id: "p-a-8",
    q: "資産A（σ=20%）と資産B（σ=10%）を相関係数-1で組み合わせ、リスクゼロにするための資産Aの比率はどれか？",
    choices: ["25%", "33%", "50%", "67%"],
    answer: 1,
    isCalc: true,
    explanation: "wA = σB/(σA+σB) = 10/(20+10) = 1/3 ≈ 33%。確認：0.33×20 = 0.67×10 = 6.67%で等しくなる。",
    keyword: "ゼロリスク比率計算"
  }],
  B: [{
    id: "p-b-1",
    q: "資本市場線（CML）の説明として正しいものはどれか？",
    choices: ["個々の証券の期待リターンとβの関係を示す線", "リスクフリー資産と市場ポートフォリオを結ぶ直線（効率的ポートフォリオの集合）", "効率的フロンティアと同じもの", "借入利率と貸出利率の間にある直線"],
    answer: 1,
    explanation: "CML（Capital Market Line）はリスクフリー資産と市場PFを結ぶ直線。CMLの傾き=シャープレシオ（市場PFの）。対してSMLは個別資産のβとリターンの関係。",
    keyword: "CML vs SML"
  }, {
    id: "p-b-2",
    q: "接点ポートフォリオ（市場ポートフォリオ）の特徴として正しいものはどれか？",
    choices: ["最もリスクが低いポートフォリオ", "効率的フロンティアとCMLの接点でシャープレシオが最大", "最もリターンが高いポートフォリオ", "βが1のポートフォリオ"],
    answer: 1,
    explanation: "接点ポートフォリオは効率的フロンティアとCMLの接点。シャープレシオが最大となるポートフォリオであり、CAPMでは「市場ポートフォリオ」と同義です。",
    keyword: "接点ポートフォリオ"
  }, {
    id: "p-b-3",
    q: "分散投資を十分に行った場合、最終的に残るリスクはどれか？",
    choices: ["非システマティックリスク（固有リスク）", "システマティックリスク（市場リスク）", "信用リスク", "流動性リスク"],
    answer: 1,
    explanation: "多数の資産に分散投資すると非システマティックリスクは消去されますが、市場全体の動きに連動するシステマティックリスク（市場リスク）は残ります。",
    keyword: "分散後のリスク"
  }, {
    id: "p-b-4",
    q: "理論上、何銘柄程度に分散投資すれば固有リスクの大部分を消去できるとされているか？",
    choices: ["5銘柄以上", "10〜15銘柄以上", "20〜30銘柄以上", "100銘柄以上"],
    answer: 2,
    explanation: "研究によると20〜30銘柄程度の分散投資で非システマティックリスクの大部分を消去できるとされています。それ以上増やしてもリスク低減効果は限定的です。",
    keyword: "分散効果の限界"
  }],
  C: [{
    id: "p-c-1",
    q: "CAPMの基本式として正しいものはどれか？",
    choices: ["E(Ri) = Rf × βi + E(Rm)", "E(Ri) = Rf + βi × [E(Rm) - Rf]", "E(Ri) = βi × E(Rm) - Rf", "E(Ri) = E(Rm) + βi / Rf"],
    answer: 1,
    explanation: "E(Ri) = Rf + βi × [E(Rm) - Rf]。[E(Rm)-Rf]がマーケット・リスクプレミアム（市場超過リターン）。βが大きいほど期待リターンは高い。",
    keyword: "CAPM公式"
  }, {
    id: "p-c-2",
    q: "Rf=2%, β=1.5, 市場リターン=8%のとき、CAPMによる期待リターンはいくらか？",
    choices: ["11%", "12%", "13%", "14%"],
    answer: 0,
    isCalc: true,
    explanation: "E(Ri) = 2% + 1.5×(8%-2%) = 2% + 1.5×6% = 2% + 9% = 11%",
    keyword: "CAPM計算"
  }, {
    id: "p-c-3",
    q: "β=0の資産の期待リターンはCAPMによると何か？",
    choices: ["市場ポートフォリオと同じリターン", "ゼロ", "リスクフリーレート（Rf）", "マーケット・リスクプレミアムと等しい"],
    answer: 2,
    explanation: "β=0のとき：E(Ri) = Rf + 0×(Rm-Rf) = Rf。βがゼロ＝市場との相関がない＝市場リスクを負わない＝リスクフリーレートと同じリターンが要求されます。",
    keyword: "β=0の意味",
    isHikakke: true
  }, {
    id: "p-c-4",
    q: "CAPMにおいて「非システマティックリスク」に対して追加的なリターンが要求されない理由はどれか？",
    choices: ["非システマティックリスクは測定できないから", "非システマティックリスクは分散投資で消去できるため、投資家はリスク補償を要求しない", "非システマティックリスクは市場全体に影響するから", "βは非システマティックリスクを含んでいるから"],
    answer: 1,
    explanation: "CAPMの重要前提：非システマティックリスクは分散投資で消去可能なため、合理的な投資家はこのリスクに対するプレミアムを要求しない。報酬はβ（システマティックリスク）のみに支払われます。",
    keyword: "非システマティックリスク補償なし",
    isHikakke: true
  }, {
    id: "p-c-5",
    q: "トレイナーレシオ（Treynor Ratio）の分母として使用するのはどれか？",
    choices: ["標準偏差（σ）", "ベータ（β）", "分散（σ²）", "トラッキングエラー"],
    answer: 1,
    explanation: "トレイナーレシオ = (Rp-Rf)/β。シャープレシオの分母はσ（全リスク）、トレイナーの分母はβ（市場リスクのみ）。完全分散済みPFにはトレイナー、個別評価にはシャープが適切。",
    keyword: "トレイナーレシオ"
  }, {
    id: "p-c-6",
    q: "ジェンセンのアルファ（α）がプラスの場合、何を意味するか？",
    choices: ["ポートフォリオのリスクが市場より低い", "ポートフォリオがCAPMの予測リターンを上回るリターンを達成した", "ポートフォリオのβが1より大きい", "ポートフォリオのシャープレシオが高い"],
    answer: 1,
    explanation: "α = Rp - [Rf + β×(Rm-Rf)]。α>0はCAPMで期待されるリターンを超えた超過リターン（運用の腕前の指標）。α=0はCAPMどおりの成果。",
    keyword: "ジェンセンのアルファ"
  }, {
    id: "p-c-7",
    q: "情報レシオ（IR）の説明として正しいものはどれか？",
    choices: ["リスクフリーレートに対する超過リターンをシステマティックリスクで割ったもの", "ベンチマーク超過リターン（アクティブリターン）をトラッキングエラーで割ったもの", "ポートフォリオリターンを全リスクで割ったもの", "超過リターンをベータで割ったもの"],
    answer: 1,
    explanation: "IR = (Rp - Rb) / TE。Rb: ベンチマークリターン、TE: トラッキングエラー（追跡誤差）。アクティブ運用の効率性を評価する指標です。",
    keyword: "情報レシオ"
  }, {
    id: "p-c-8",
    q: "Rp=12%, Rf=2%, β=1.2のとき、トレイナーレシオはいくらか？",
    choices: ["約6.67", "約8.33", "約10.00", "約0.83"],
    answer: 1,
    isCalc: true,
    explanation: "TR = (Rp - Rf) / β = (12% - 2%) / 1.2 = 10% / 1.2 ≈ 8.33",
    keyword: "トレイナーレシオ計算"
  }],
  D: [{
    id: "p-d-1",
    q: "情報レシオとシャープレシオの違いとして正しいものはどれか？",
    choices: ["シャープはリスクフリーレート、情報レシオはベンチマークとの比較", "両者は同じ指標", "シャープはβ、情報レシオはσを使用する", "情報レシオは債券専用指標"],
    answer: 0,
    explanation: "シャープレシオ：リスクフリーレートとの超過リターン÷σ（総合的な効率性）。情報レシオ：ベンチマーク超過リターン÷トラッキングエラー（アクティブ運用の評価）。",
    keyword: "IRvsシャープ"
  }, {
    id: "p-d-2",
    q: "シャープレシオの計算式として正しいものはどれか？",
    choices: ["(Rp - Rf) / β", "(Rp - Rb) / TE", "(Rp - Rf) / σp", "Rp / σp"],
    answer: 2,
    explanation: "シャープレシオ = (ポートフォリオリターン - 無リスク資産リターン) / ポートフォリオの標準偏差。1単位のリスクに対し無リスク超過リターンがどれだけあるかを示す。",
    keyword: "シャープレシオ計算",
    isCalc: true
  }, {
    id: "p-d-3",
    q: "トレイナーレシオとシャープレシオの主な違いはどれか？",
    choices: ["トレイナーは総リスク（σ）、シャープは市場リスク（β）を分母に使う", "トレイナーは市場リスク（β）、シャープは総リスク（σ）を分母に使う", "両者は全く同じ指標", "トレイナーはベンチマーク比較、シャープは絶対的評価"],
    answer: 1,
    explanation: "シャープレシオ：超過リターン÷σ（総リスク）→分散投資していない投資家向け。トレイナーレシオ：超過リターン÷β（市場リスク）→完全分散した投資家向けの評価指標。",
    keyword: "トレイナーvsシャープ"
  }, {
    id: "p-d-4",
    q: "ジェンセンのアルファ（α）の説明として正しいものはどれか？",
    choices: ["ポートフォリオのβ値そのもの", "CAPMで予測されるリターンを上回った部分（超過リターン）", "シャープレシオとトレイナーレシオの差", "運用コストを差し引いた実質リターン"],
    answer: 1,
    explanation: "ジェンセンのα = Rp - [Rf + β(Rm - Rf)]。CAPMで説明できるリターンを超えた部分で、ファンドマネジャーのスキルを表す。α>0ならアウトパフォーム。",
    keyword: "ジェンセンのα"
  }, {
    id: "p-d-5",
    q: "情報レシオ（Information Ratio）が高いファンドの特徴として正しいものはどれか？",
    choices: ["ベンチマークに比べてリターンが低い", "トラッキングエラーが大きいほど情報レシオは高くなる", "ベンチマーク超過リターンが高く、かつトラッキングエラーが小さい", "インデックスファンドほど情報レシオが高い"],
    answer: 2,
    explanation: "IR = 超過リターン（アルファ）÷ トラッキングエラー。アクティブ運用の効率性指標。超過リターンが大きくTE（ばらつき）が小さいほどIRは高く、優れたアクティブ運用を示す。",
    keyword: "情報レシオ"
  }]
};

// --- ④金融商品 クイズデータ ---
const PRODUCTS_QUIZZES = {
  A: [{
    id: "pr-a-1",
    q: "PER（株価収益率）の計算式として正しいものはどれか？",
    choices: ["PER = EPS / 株価", "PER = 株価 / EPS（1株当たり利益）", "PER = 純資産 / 株価", "PER = 配当 / 株価"],
    answer: 1,
    explanation: "PER = 株価 / EPS（1株当たり純利益）。低いほど株価が割安とされますが、業種比較が重要です。赤字企業にはPERは算出できません。",
    keyword: "PER"
  }, {
    id: "pr-a-2",
    q: "PBR（株価純資産倍率）が1倍を下回る株式について正しい記述はどれか？",
    choices: ["株価が理論上の解散価値を上回っている", "株価が理論上の解散価値を下回っており、割安とみなされることがある", "企業が赤字であることを示す", "配当利回りが高いことを示す"],
    answer: 1,
    explanation: "PBR=株価/BPS（1株当たり純資産）。PBR<1は株価が帳簿上の純資産より安い状態（解散価値以下）。必ずしも買いではなく、構造的問題を抱えているケースも。",
    keyword: "PBR1倍割れ",
    isHikakke: true
  }, {
    id: "pr-a-3",
    q: "ROE（自己資本利益率）のデュポン分解として正しいものはどれか？",
    choices: ["ROE = 純利益率 × 総資産回転率 × 財務レバレッジ", "ROE = 売上高 × 利益率 × 株価", "ROE = EPS × PER × 株数", "ROE = 配当性向 × 株価 × 利回り"],
    answer: 0,
    explanation: "ROE（デュポン分解）= 純利益率（収益性）× 総資産回転率（効率性）× 財務レバレッジ（安全性の逆）。3要素でROEの源泉を分析できます。",
    keyword: "ROEデュポン分解"
  }, {
    id: "pr-a-4",
    q: "DDM（配当割引モデル）の定率成長モデルの公式として正しいものはどれか？",
    choices: ["P = D1 × (r - g)", "P = D1 / (r - g)", "P = D1 / (r + g)", "P = D1 × r / g"],
    answer: 1,
    explanation: "P = D1 / (r - g)。D1：来期配当、r：割引率（期待リターン）、g：配当成長率。r > g の条件が必要。成長率が割引率に近づくほど理論株価は高くなる。",
    keyword: "DDM定率成長モデル"
  }, {
    id: "pr-a-5",
    q: "来期配当100円、割引率8%、成長率3%のとき、DDM定率成長モデルによる理論株価はいくらか？",
    choices: ["1,000円", "2,000円", "1,333円", "500円"],
    answer: 1,
    isCalc: true,
    explanation: "P = D1 / (r-g) = 100 / (0.08-0.03) = 100 / 0.05 = 2,000円",
    keyword: "DDM計算"
  }, {
    id: "pr-a-6",
    q: "グロース株とバリュー株の比較として正しいものはどれか？",
    choices: ["グロース株：高PER・高成長期待。バリュー株：低PER・割安", "グロース株：低PER・低リスク。バリュー株：高PER・高リスク", "グロース株：高配当利回り。バリュー株：無配当", "グロース株とバリュー株は同義"],
    answer: 0,
    explanation: "グロース（成長）株：高PER・低配当でも将来の成長期待が高い。バリュー（割安）株：PBRやPERが低く、現在の資産・利益対比で割安な銘柄。",
    keyword: "グロースvsバリュー"
  }],
  B: [{
    id: "pr-b-1",
    q: "債券価格と市場金利の関係として正しいものはどれか？",
    choices: ["金利上昇 → 債券価格上昇（正の相関）", "金利上昇 → 債券価格下落（逆相関）", "金利と債券価格は無関係", "金利上昇 → 短期債は上昇・長期債は下落"],
    answer: 1,
    explanation: "金利上昇→既存債券の相対的な魅力低下→価格下落（逆相関）。デュレーションが長い債券ほど金利変動の影響が大きい。",
    keyword: "金利と債券価格の逆相関"
  }, {
    id: "pr-b-2",
    q: "デュレーションの説明として正しいものはどれか？",
    choices: ["残存期間と同じ概念", "クーポンを含めたキャッシュフローの加重平均残存期間（金利感応度）", "債券の信用力を示す指標", "年間クーポン収入の合計"],
    answer: 1,
    explanation: "デュレーションはキャッシュフローの加重平均残存期間。残存期間ではない点が頻出ひっかけ。クーポンが低い・残存期間が長いほどデュレーションが長く金利感応度が高い。",
    keyword: "デュレーション≠残存期間",
    isHikakke: true
  }, {
    id: "pr-b-3",
    q: "修正デュレーション5年の債券で金利が0.5%上昇した場合、債券価格の変動率はいくらか？",
    choices: ["+2.5%", "-2.5%", "+5.0%", "-0.5%"],
    answer: 1,
    isCalc: true,
    explanation: "ΔP/P ≈ -修正デュレーション × Δr = -5 × 0.005 = -0.025 = -2.5%。符号マイナスに注意（金利上昇→価格下落）。",
    keyword: "修正デュレーション計算"
  }, {
    id: "pr-b-4",
    q: "YTM（最終利回り・満期利回り）の説明として正しいものはどれか？",
    choices: ["クーポンレートと同じ", "購入価格に対するクーポン収入の利回り", "満期まで保有した場合の年率利回り（クーポン収入＋償還差益/損を含む）", "過去1年間の実現利回り"],
    answer: 2,
    explanation: "YTM（Yield to Maturity）：購入から満期まで保有した場合の年率利回り。クーポン収入に加え、購入価格と額面の差（償還差益/損）も含みます。",
    keyword: "YTM（最終利回り）"
  }],
  C: [{
    id: "pr-c-1",
    q: "外貨建て資産の円換算リターンの計算式として正しいものはどれか？",
    choices: ["R円 = R外貨 + R為替", "R円 ≈ R外貨 + R為替（近似式）/ 正確には(1+R外貨)(1+R為替)-1", "R円 = R外貨 × R為替", "R円 = R外貨 / (1 + R為替)"],
    answer: 1,
    explanation: "正確な式：R円 = (1+R外貨)(1+R為替)-1。小さな値では≈R外貨+R為替で近似可能。円高（R為替<0）は外貨建て資産の円換算リターンを押し下げます。",
    keyword: "為替リターン計算"
  }, {
    id: "pr-c-2",
    q: "カバー付き金利平価（CIP）の説明として正しいものはどれか？",
    choices: ["高金利国通貨は将来必ず上昇する", "先渡レートと直物レートの乖離は2国間の金利差を反映する（裁定機会がない状態）", "為替ヘッジコストはゼロ", "外貨投資は常に国内投資より有利"],
    answer: 1,
    explanation: "CIP：F/S = (1+r国内)/(1+r外国)。先物レートで為替リスクをヘッジすると、金利差が為替コストで相殺され、裁定利益は生じない（ヘッジコスト≒金利差）。",
    keyword: "カバー付き金利平価"
  }, {
    id: "pr-c-3",
    q: "為替ヘッジあり外国債券と為替ヘッジなし外国債券の比較として正しいものはどれか？",
    choices: ["ヘッジありは為替リスクがなく、ヘッジコスト（金利差相当）がかかる", "ヘッジなしは為替リスクがなく安全", "ヘッジコストはゼロで必ず有利", "どちらも円建てリターンは同じ"],
    answer: 0,
    explanation: "為替ヘッジ：先物予約等で為替リスクを回避。ヘッジコスト≒2国間の短期金利差。円金利＜外国金利の場合、コストがプラスになるケースもある（円安時に顕在化）。",
    keyword: "為替ヘッジコスト"
  }, {
    id: "pr-c-4",
    q: "購買力平価（PPP）説の内容として正しいものはどれか？",
    choices: ["高金利国の通貨は必ず上昇する", "2国間のインフレ率の差が、長期的な為替レートの変動を決める", "為替レートは短期的にPPPに収束する", "購買力平価は貿易財のみに適用される理論"],
    answer: 1,
    explanation: "購買力平価：インフレ率の高い国の通貨は長期的に下落する。例：日本より米国のインフレが2%高ければ、長期的にドルは円に対し年2%程度下落する傾向。長期説明力が高い。",
    keyword: "購買力平価"
  }, {
    id: "pr-c-5",
    q: "外国株式への投資で為替が円高に動いた場合、円ベースのリターンはどうなるか？",
    choices: ["外貨ベースのリターンと同じになる", "外貨ベースのリターンより高くなる", "外貨ベースのリターンより低くなる（為替差損が加わる）", "円高は外国株式に影響しない"],
    answer: 2,
    explanation: "円高（例：1ドル150円→130円）は外貨資産を円換算した際に価値を目減りさせる。R円 ≈ R外貨 + R為替で、円高（R為替<0）分だけ円換算リターンが下がる。",
    keyword: "円高と外貨資産",
    isHikakke: true
  }, {
    id: "pr-c-6",
    q: "アンカバー金利平価（UIP）の内容として正しいものはどれか？",
    choices: ["高金利通貨の先物レートは直物レートより高くなる", "高金利国通貨は将来的に金利差分だけ下落することが期待される（裁定なし条件）", "金利が高い国の通貨は必ず上昇する", "実際の市場でUIPは常に成立している"],
    answer: 1,
    explanation: "UIP：高金利通貨は将来その金利差分だけ下落する（期待値ベース）。CIP（カバー付き）はほぼ成立するが、UIPは短期では成立しないことが多く、キャリートレードの利益の源泉ともなる。",
    keyword: "アンカバー金利平価"
  }],
  D: [{
    id: "pr-d-1",
    q: "インデックスファンドとアクティブファンドの比較として正しいものはどれか？",
    choices: ["アクティブファンドは常にインデックスを上回るリターンを達成する", "インデックスファンドは低コストで市場平均を目指す。長期的にはコスト差がリターン差に影響する", "インデックスファンドは市場平均を「超える」ことを目指す", "アクティブファンドの信託報酬はインデックスより低い"],
    answer: 1,
    explanation: "インデックス：低コスト・市場平均追跡。アクティブ：高コスト・市場超過リターンを狙うが長期では困難（効率的市場仮説）。コスト差が長期で大きな差になる。",
    keyword: "インデックスvsアクティブ",
    isHikakke: true
  }, {
    id: "pr-d-2",
    q: "ETF（上場投資信託）の特徴として正しいものはどれか？",
    choices: ["1日1回基準価額で売買する", "取引所でリアルタイムに売買でき、信託報酬が一般的に低い", "元本保証がある", "購入時手数料が必ず必要"],
    answer: 1,
    explanation: "ETFは取引所に上場し株式のようにリアルタイム売買可能。一般的に信託報酬が低く、コスト効率が高い。基準価額ではなく市場価格で取引します。",
    keyword: "ETF"
  }, {
    id: "pr-d-3",
    q: "ESG投資の「ESG」が表す内容として正しいものはどれか？",
    choices: ["Economy（経済）・Safety（安全）・Growth（成長）", "Environment（環境）・Social（社会）・Governance（ガバナンス）", "Earnings（収益）・Stability（安定性）・Growth（成長）", "Equity（株式）・Securities（証券）・Global（グローバル）"],
    answer: 1,
    explanation: "ESG：環境（気候変動・省エネ）・社会（労働環境・人権）・ガバナンス（企業統治・情報開示）の3要素を考慮した投資。財務情報だけでなく非財務情報も評価する。",
    keyword: "ESG投資"
  }, {
    id: "pr-d-4",
    q: "投資信託の「信託報酬」の説明として正しいものはどれか？",
    choices: ["ファンド購入時に一度だけ支払う手数料", "ファンド売却時に支払う手数料", "保有中に毎日基準価額から差し引かれる管理コスト（年率）", "運用益に対してのみ課される税金"],
    answer: 2,
    explanation: "信託報酬：投資信託を保有している間、継続的にかかるコスト（年率）。毎日基準価額から控除されるため気づきにくいが、長期保有ではリターンへの影響が大きい。インデックスは0.1〜0.2%、アクティブは1〜2%程度。",
    keyword: "信託報酬"
  }, {
    id: "pr-d-5",
    q: "ファンドラップとSMAの説明として正しいものはどれか？",
    choices: ["ファンドラップは複数の投資信託に投資し、SMAは直接株式・債券に投資する一任運用", "ファンドラップとSMAは全く同じサービス", "SMAは投資信託のみに投資する", "ファンドラップは元本保証がある"],
    answer: 0,
    explanation: "ファンドラップ：複数の投資信託を組み合わせて一任運用（コストが二重にかかる点に注意）。SMA（Separately Managed Account）：顧客名義で株式・債券を直接保有する一任運用。より富裕層向け。",
    keyword: "ファンドラップ・SMA"
  }, {
    id: "pr-d-6",
    q: "パッシブ運用（インデックス運用）が長期的に多くのアクティブ運用を上回る主な理由はどれか？",
    choices: ["パッシブ運用は市場を分析し常に最適な銘柄を選択するため", "信託報酬・売買コストの差が長期的に大きな影響を与えるため", "アクティブ運用は規制により市場を上回ることが禁止されているため", "インデックスは下落することがないため"],
    answer: 1,
    explanation: "効率的市場仮説：長期的に市場平均を安定的に上回ることは困難。アクティブは信託報酬1〜2%のコスト劣位がある。複利効果で30年では数十%の差になる。コストは確実にリターンを削る。",
    keyword: "コストと長期リターン"
  }],
  E: [{
    id: "pr-e-1",
    q: "REIT（不動産投資信託）の特徴として正しいものはどれか？",
    choices: ["個人が直接不動産を購入する投資", "不動産に投資する投資信託で、収益の90%超を分配することで法人税が実質非課税になる", "元本保証があり安全な投資", "株式市場には上場しない"],
    answer: 1,
    explanation: "REIT：多くの投資家から集めた資金で不動産に投資。収益の90%超を分配することで法人段階での課税が実質免除。株式同様に取引所で売買可能（J-REITは東証上場）。",
    keyword: "REIT"
  }, {
    id: "pr-e-2",
    q: "オルタナティブ投資の主な特徴として正しいものはどれか？",
    choices: ["伝統的資産（株・債券）との相関が高く、分散効果は限定的", "伝統的資産との相関が低く分散効果が期待できるが、流動性リスクがある", "元本保証があり安全性が高い", "信託報酬がインデックスファンドより低い"],
    answer: 1,
    explanation: "オルタナティブ投資（REIT・ヘッジファンド・PE・コモディティ等）：伝統的資産との相関が低い→分散効果。ただし流動性リスクや評価の難しさが課題です。",
    keyword: "オルタナティブ投資"
  }, {
    id: "pr-e-3",
    q: "ヘッジファンドの特徴として正しいものはどれか？",
    choices: ["公募投資信託と同様に一般投資家向けに広く販売される", "空売りやレバレッジを活用し、市場環境に関わらず絶対リターンを狙う", "元本保証があり安全性が高い", "信託報酬はインデックスファンドと同水準"],
    answer: 1,
    explanation: "ヘッジファンド：空売り・レバレッジ・デリバティブ等を駆使し「絶対収益」を目指す。一般に適格投資家向けで最低投資額が高い。成功報酬（通常20%）＋管理報酬（2%）のコスト構造（2-and-20）が多い。",
    keyword: "ヘッジファンド"
  }, {
    id: "pr-e-4",
    q: "プライベートエクイティ（PE）投資の説明として正しいものはどれか？",
    choices: ["上場株式に投資する一般的な株式ファンド", "非上場企業への投資で、買収・事業改善・売却により収益を狙う", "国債などの安全資産に投資する", "リアルタイムで取引所での売買が可能"],
    answer: 1,
    explanation: "PEファンド：非上場企業をLBO（レバレッジドバイアウト）等で買収し、経営改善後にIPOや売却で利益を得る。運用期間は通常10年程度。流動性は低いが高いリターンを期待。",
    keyword: "プライベートエクイティ"
  }, {
    id: "pr-e-5",
    q: "J-REITの分配金利回りと株式配当利回りの違いとして正しいものはどれか？",
    choices: ["J-REITの分配金利回りは通常株式配当利回りより低い", "J-REITは収益の90%超を分配するため、分配金利回りが高くなりやすい", "J-REITの分配金は非課税", "J-REITは分配金を出す義務がない"],
    answer: 1,
    explanation: "J-REITは導管性要件（収益の90%超分配）を満たすことで法人税実質非課税。そのため多くの収益を分配でき、一般的に株式より分配金利回りが高い傾向。ただし金利上昇局面では価格下落リスクあり。",
    keyword: "J-REIT分配利回り"
  }, {
    id: "pr-e-6",
    q: "コモディティ（商品）投資の特徴として正しいものはどれか？",
    choices: ["株式・債券と相関が高く分散効果は限定的", "インフレヘッジ効果が期待でき、株式・債券との相関が低い場合がある", "元本保証があり安全な投資先", "配当・利子収入が安定的に得られる"],
    answer: 1,
    explanation: "コモディティ（金・原油・穀物等）：実物資産でインフレ時に価値が上がりやすい。金融資産との相関が低く分散効果あり。ただし配当・利子なし。保管・ロールオーバーコストが生じる場合がある。",
    keyword: "コモディティ投資"
  }]
};

// --- ⑤ケーススタディ データ ---
const CASE_STUDIES = [{
  id: "case01",
  title: "30代共働き夫婦の資産形成",
  scenario: "山田さん夫婦（夫33歳・妻31歳）。世帯年収800万円。子供2人（3歳・1歳）。住宅ローン残3,000万円。現在の金融資産500万円（定期預金のみ）。老後2,000万円問題が気になっている。",
  tags: ["教育費", "住宅ローン", "老後資金", "NISA/iDeCo"],
  color: "#16A085",
  questions: [{
    q: "この夫婦に最も適切な資産配分（アセットアロケーション）はどれか？",
    choices: ["全額国内株式100%（リターン最大化）", "株式60〜70%・債券30〜40%（長期・積立・分散を意識したバランス型）", "全額定期預金（安全第一）", "全額海外株式（高リターン追求）"],
    answer: 1,
    explanation: "30代・長期投資可能・住宅ローンあり・教育費も考慮すると、ある程度のリスクを取れる。株式中心だが債券も組み入れたバランス型が適切。定期のみは機会損失。"
  }, {
    q: "NISAとiDeCoの活用として最も適切な考え方はどれか？",
    choices: ["iDeCoのみ活用（流動性は無視）", "新NISAで積立（流動性確保）＋iDeCoで老後資金（節税）の二本柱", "どちらも使わず課税口座で運用", "NISAのみ（iDeCoは手続きが面倒）"],
    answer: 1,
    explanation: "新NISAは流動性あり（いつでも引き出し可能）で教育費にも対応可。iDeCoは60歳まで引き出せないが所得控除で節税効果大。二本柱で活用するのが最適。"
  }, {
    q: "リスク許容度の観点から、株式比率を決める際に最も重要な要因はどれか？",
    choices: ["今年の株式市場のパフォーマンス", "年齢・投資期間・収入の安定性・住宅ローン等の負債状況", "証券会社の担当者のアドバイス", "友人の投資実績"],
    answer: 1,
    explanation: "リスク許容度は年齢（投資期間）・収入安定性・負債額・心理的耐性等で決まります。若い・収入安定・長期投資可能なほどリスクを取れます。"
  }]
}, {
  id: "case02",
  title: "60代定年退職者の資産運用",
  scenario: "鈴木さん（62歳）。退職金2,000万円。公的年金（65歳から月20万円予定）。現在の生活費月30万円。子供は独立済み。インフレが心配。",
  tags: ["退職金", "取り崩し", "長寿リスク", "インフレリスク"],
  color: "#8E44AD",
  questions: [{
    q: "退職金2,000万円の適切な運用方針はどれか？",
    choices: ["全額ハイリスク株式投資（リターン最大化）", "全額定期預金（元本保護優先）", "生活防衛資金を確保した上で、残りをバランスよく分散投資（取り崩しフェーズに対応）", "全額不動産投資"],
    answer: 2,
    explanation: "退職後は「取り崩しフェーズ」。1〜2年分の生活費（流動性確保）＋中リスクの分散投資が基本。長寿リスクを考えると全額定期では30年後の購買力低下（インフレリスク）が問題。"
  }, {
    q: "65歳から年金20万円/月、生活費30万円/月の場合、不足する月額はいくらか？",
    choices: ["5万円", "10万円", "15万円", "20万円"],
    answer: 1,
    explanation: "30万円（生活費）- 20万円（年金）= 10万円/月の不足。年間120万円。仮に25年間なら3,000万円（インフレ考慮なし）の資産が必要。"
  }, {
    q: "インフレリスクへの対応として最も適切な行動はどれか？",
    choices: ["全額現金で保有する", "株式・REIT等の実物資産連動商品を一定割合組み入れる", "外貨を大量に保有する", "インフレは日本では起こらないので対応不要"],
    answer: 1,
    explanation: "インフレ（物価上昇）は現金・固定利率資産の実質価値を低下させます。株式・REIT・物価連動債等の実物資産連動商品を一定割合組み入れることで対応可能。"
  }]
}];

// ============================================================
// フェーズ5: 共通コンポーネント
// ============================================================

// --- QuizComponent: 4択テストコンポーネント ---
function QuizComponent({
  quizzes,
  // 問題配列
  tabId,
  // "ethics" | "ch1" etc.
  sectionId,
  // "A" | "B" etc.
  accentColor,
  state,
  setState,
  progressField = "progress" // "progress" | "chapProgress"
}) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null); // 選択肢インデックス
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]); // {correct, keyword, isCalc}

  const q = quizzes[idx];
  const handleSelect = i => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.answer;
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, {
      correct,
      keyword: q.keyword,
      isCalc: !!q.isCalc
    }]);
  };
  const handleNext = () => {
    if (idx + 1 >= quizzes.length) {
      setFinished(true);
      // 進捗をセクション完了として記録
      const allCorrect = score + (selected === q.answer ? 1 : 0);
      if (allCorrect / quizzes.length >= 0.6) {
        setState(s => ({
          ...s,
          [progressField]: {
            ...s[progressField],
            [tabId]: {
              ...(s[progressField]?.[tabId] ?? {}),
              [sectionId]: true
            }
          },
          testHistory: [...s.testHistory, ...quizzes.map((quiz, qi) => ({
            date: new Date().toISOString(),
            tab: tabId,
            section: sectionId,
            question: quiz.id,
            correct: history[qi]?.correct ?? false,
            keyword: quiz.keyword,
            isCalc: !!quiz.isCalc
          }))]
        }));
      }
      return;
    }
    setIdx(i => i + 1);
    setSelected(null);
    setAnswered(false);
  };
  const handleRetry = () => {
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setHistory([]);
  };

  // 完了画面
  if (finished) {
    const total = quizzes.length;
    const pct = Math.round(score / total * 100);
    const passed = pct >= 60;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 40,
        marginBottom: 8
      }
    }, passed ? "🎉" : "📚"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 900,
        color: passed ? COLORS.secondary : COLORS.accent,
        marginBottom: 4
      }
    }, score, " / ", total, " \u6B63\u89E3"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 900,
        color: accentColor,
        marginBottom: 12
      }
    }, pct, "\u70B9"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.badge(passed ? COLORS.secondary : COLORS.accent),
        fontSize: 14,
        marginBottom: 16
      }
    }, passed ? "セクション完了！" : "もう少し！60点以上でクリア"), history.some(h => !h.correct) && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "left",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: COLORS.danger,
        marginBottom: 8
      }
    }, "\u9593\u9055\u3048\u305F\u554F\u984C\u306E\u30AD\u30FC\u30EF\u30FC\u30C9"), history.map((h, i) => ({
      ...h,
      quiz: quizzes[i]
    })).filter(h => !h.correct).map((h, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: "6px 10px",
        background: COLORS.danger + "10",
        border: `1px solid ${COLORS.danger}33`,
        borderRadius: 8,
        fontSize: 12,
        marginBottom: 4,
        color: COLORS.text
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.danger,
        fontWeight: 700
      }
    }, "\u2717 "), h.keyword, h.quiz.isCalc && /*#__PURE__*/React.createElement("span", {
      style: {
        ...STYLES.badge(COLORS.highlight),
        marginLeft: 6,
        fontSize: 10
      }
    }, "\u8A08\u7B97"), h.quiz.isHikakke && /*#__PURE__*/React.createElement("span", {
      style: {
        ...STYLES.badge(COLORS.accent),
        marginLeft: 4,
        fontSize: 10
      }
    }, "\u3072\u3063\u304B\u3051")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        ...STYLES.btnOutline,
        flex: 1,
        color: accentColor,
        borderColor: accentColor
      },
      onClick: handleRetry
    }, "\u3082\u3046\u4E00\u5EA6"), passed && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: COLORS.secondary + "20",
        border: `1.5px solid ${COLORS.secondary}`,
        borderRadius: 12,
        padding: "8px 0",
        fontSize: 13,
        fontWeight: 700,
        color: COLORS.secondary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Check, {
      size: 14
    }), " \u5B8C\u4E86\u6E08\u307F")));
  }

  // 出題画面
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 8,
      fontSize: 12,
      color: COLORS.textLight
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: accentColor
    }
  }, "\u554F ", idx + 1, " / ", quizzes.length), /*#__PURE__*/React.createElement("span", null, "\u6B63\u89E3 ", score, "\u554F")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: COLORS.border,
      borderRadius: 4,
      marginBottom: 14,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${idx / quizzes.length * 100}%`,
      background: accentColor,
      borderRadius: 4,
      transition: "width 0.3s ease"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, q.isCalc && /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.highlight)
  }, "\u8A08\u7B97\u554F\u984C"), q.isHikakke && /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.accent)
  }, "\u3072\u3063\u304B\u3051\u6CE8\u610F"), /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.textLight)
  }, q.keyword)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: COLORS.text,
      lineHeight: 1.8,
      marginBottom: 14,
      padding: "10px 12px",
      background: accentColor + "08",
      borderRadius: 10,
      border: `1px solid ${accentColor}22`
    }
  }, q.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, q.choices.map((choice, i) => {
    let bg = "#fff";
    let border = `1.5px solid ${COLORS.border}`;
    let color = COLORS.text;
    if (answered) {
      if (i === q.answer) {
        bg = COLORS.secondary + "20";
        border = `2px solid ${COLORS.secondary}`;
        color = COLORS.secondary;
      } else if (i === selected && i !== q.answer) {
        bg = COLORS.danger + "15";
        border = `2px solid ${COLORS.danger}`;
        color = COLORS.danger;
      }
    } else if (selected === i) {
      bg = accentColor + "15";
      border = `2px solid ${accentColor}`;
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => handleSelect(i),
      style: {
        background: bg,
        border,
        borderRadius: 12,
        padding: "10px 14px",
        textAlign: "left",
        cursor: answered ? "default" : "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        transition: "all 0.15s ease",
        fontFamily: "'Noto Sans JP', sans-serif"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 22,
        height: 22,
        borderRadius: "50%",
        background: answered && i === q.answer ? COLORS.secondary : answered && i === selected && i !== q.answer ? COLORS.danger : accentColor + "33",
        color: answered && (i === q.answer || i === selected) ? "#fff" : accentColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        flexShrink: 0
      }
    }, answered && i === q.answer ? "○" : answered && i === selected && i !== q.answer ? "✗" : ["①", "②", "③", "④"][i]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color,
        lineHeight: 1.6
      }
    }, choice));
  })), answered && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "10px 12px",
      background: (selected === q.answer ? COLORS.secondary : COLORS.danger) + "10",
      border: `1px solid ${selected === q.answer ? COLORS.secondary : COLORS.danger}33`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: selected === q.answer ? COLORS.secondary : COLORS.danger,
      marginBottom: 4
    }
  }, selected === q.answer ? "✓ 正解！" : "✗ 不正解"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.7
    }
  }, q.explanation)), answered && /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnPrimary,
      width: "100%",
      marginTop: 12,
      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}BB)`
    },
    onClick: handleNext
  }, idx + 1 >= quizzes.length ? "結果を見る" : "次の問題", /*#__PURE__*/React.createElement(ChevronRight, {
    size: 15,
    style: {
      marginLeft: 4
    }
  })));
}

// --- SectionProgress: セクション完了状態表示 ---
function SectionProgress({
  tabId,
  sections,
  progress,
  color,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 14
    }
  }, sections.map(sec => {
    const done = progress[tabId]?.[sec.id] ?? false;
    return /*#__PURE__*/React.createElement("button", {
      key: sec.id,
      onClick: () => onSelect(sec.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: done ? color + "18" : "#fff",
        border: `1.5px solid ${done ? color : COLORS.border}`,
        borderRadius: 20,
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        color: done ? color : COLORS.textLight,
        transition: "all 0.15s ease"
      }
    }, done ? /*#__PURE__*/React.createElement(Check, {
      size: 12,
      color: color
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 12,
        height: 12,
        borderRadius: "50%",
        border: `1.5px solid ${COLORS.border}`
      }
    }), sec.label);
  }));
}

// --- MiniCalcCard: ホーム画面「今日の計算練習」用 ---
function MiniCalcCard({
  quiz,
  onAnswer
}) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  if (!quiz) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color: COLORS.accent
    }
  }, /*#__PURE__*/React.createElement(Calculator, {
    size: 15,
    color: COLORS.accent
  }), " \u4ECA\u65E5\u306E\u8A08\u7B97\u7DF4\u7FD2"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.badge(COLORS.highlight),
      marginBottom: 8
    }
  }, "\u8A08\u7B97\u554F\u984C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: COLORS.text,
      lineHeight: 1.7,
      marginBottom: 12
    }
  }, quiz.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, quiz.choices.map((c, i) => {
    let bg = "#fff",
      border = `1px solid ${COLORS.border}`,
      color = COLORS.text;
    if (answered) {
      if (i === quiz.answer) {
        bg = COLORS.secondary + "18";
        border = `1.5px solid ${COLORS.secondary}`;
        color = COLORS.secondary;
      } else if (i === selected) {
        bg = COLORS.danger + "12";
        border = `1.5px solid ${COLORS.danger}`;
        color = COLORS.danger;
      }
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => {
        if (answered) return;
        setSelected(i);
        setAnswered(true);
        onAnswer(i === quiz.answer);
      },
      style: {
        background: bg,
        border,
        borderRadius: 10,
        padding: "8px 12px",
        textAlign: "left",
        cursor: answered ? "default" : "pointer",
        fontSize: 13,
        color,
        fontFamily: "'Noto Sans JP', sans-serif"
      }
    }, ["①", "②", "③", "④"][i], " ", c);
  })), answered && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "8px 12px",
      background: COLORS.primary + "0A",
      borderRadius: 8,
      fontSize: 12,
      color: COLORS.text,
      lineHeight: 1.6
    }
  }, quiz.explanation));
}

// --- SearchBar: 全タブ横断検索 ---
const SEARCH_INDEX = [{
  keyword: "フィデューシャリー",
  tab: "ethics",
  section: "A",
  desc: "受託者責任・顧客本位"
}, {
  keyword: "KYC",
  tab: "ethics",
  section: "B",
  desc: "顧客情報収集"
}, {
  keyword: "NISA",
  tab: "ethics",
  section: "C",
  desc: "新NISA・非課税投資"
}, {
  keyword: "iDeCo",
  tab: "ethics",
  section: "C",
  desc: "個人型確定拠出年金"
}, {
  keyword: "ESG",
  tab: "ethics",
  section: "C",
  desc: "環境・社会・ガバナンス投資"
}, {
  keyword: "リターン",
  tab: "basics",
  section: "A",
  desc: "単純・年率・幾何平均リターン"
}, {
  keyword: "標準偏差",
  tab: "basics",
  section: "B",
  desc: "リスク・分散・相関係数"
}, {
  keyword: "シャープレシオ",
  tab: "basics",
  section: "B",
  desc: "リスク調整後リターン"
}, {
  keyword: "現在価値",
  tab: "basics",
  section: "C",
  desc: "PV・FV・割引率"
}, {
  keyword: "VaR",
  tab: "basics",
  section: "C",
  desc: "バリュー・アット・リスク"
}, {
  keyword: "アセットアロケーション",
  tab: "basics",
  section: "E",
  desc: "資産配分の重要性"
}, {
  keyword: "分散効果",
  tab: "portfolio",
  section: "A",
  desc: "相関係数と分散効果"
}, {
  keyword: "効率的フロンティア",
  tab: "portfolio",
  section: "B",
  desc: "最適ポートフォリオ"
}, {
  keyword: "CAPM",
  tab: "portfolio",
  section: "C",
  desc: "資本資産評価モデル"
}, {
  keyword: "ベータ",
  tab: "portfolio",
  section: "C",
  desc: "市場リスク感応度"
}, {
  keyword: "トレイナーレシオ",
  tab: "portfolio",
  section: "D",
  desc: "システマティックリスク調整後リターン"
}, {
  keyword: "ジェンセンのアルファ",
  tab: "portfolio",
  section: "D",
  desc: "超過リターン指標"
}, {
  keyword: "PER",
  tab: "products",
  section: "A",
  desc: "株価収益率"
}, {
  keyword: "DDM",
  tab: "products",
  section: "A",
  desc: "配当割引モデル"
}, {
  keyword: "デュレーション",
  tab: "products",
  section: "B",
  desc: "債券の金利感応度"
}, {
  keyword: "YTM",
  tab: "products",
  section: "B",
  desc: "最終利回り"
}, {
  keyword: "為替",
  tab: "products",
  section: "C",
  desc: "外国証券・為替リスク"
}, {
  keyword: "ETF",
  tab: "products",
  section: "D",
  desc: "上場投資信託"
}, {
  keyword: "REIT",
  tab: "products",
  section: "E",
  desc: "不動産投資信託"
}];
function SearchBar({
  onNavigate
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const handleChange = e => {
    const v = e.target.value;
    setQuery(v);
    if (v.length < 1) {
      setResults([]);
      return;
    }
    const r = SEARCH_INDEX.filter(item => item.keyword.includes(v) || item.desc.includes(v) || item.tab.includes(v)).slice(0, 6);
    setResults(r);
  };
  const tabColor = tabId => TABS.find(t => t.id === tabId)?.color ?? COLORS.primary;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "#fff",
      border: `1.5px solid ${focus ? COLORS.primary : COLORS.border}`,
      borderRadius: 14,
      padding: "9px 14px",
      boxShadow: focus ? `0 0 0 3px ${COLORS.primary}22` : "none",
      transition: "all 0.18s ease"
    }
  }, /*#__PURE__*/React.createElement(Search, {
    size: 16,
    color: focus ? COLORS.primary : COLORS.textMuted
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\u7528\u8A9E\u30FB\u516C\u5F0F\u30FB\u30AD\u30FC\u30EF\u30FC\u30C9\u3067\u691C\u7D22...",
    value: query,
    onChange: handleChange,
    onFocus: () => setFocus(true),
    onBlur: () => setTimeout(() => setFocus(false), 200),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: 14,
      color: COLORS.text,
      background: "transparent",
      fontFamily: "'Noto Sans JP', sans-serif"
    }
  }), query && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setQuery("");
      setResults([]);
    },
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: COLORS.textMuted,
      padding: 0
    }
  }, "\u2715")), results.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "#fff",
      border: `1.5px solid ${COLORS.border}`,
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(74,144,217,0.18)",
      zIndex: 200,
      overflow: "hidden",
      marginTop: 4
    }
  }, results.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onMouseDown: () => {
      onNavigate(r.tab);
      setQuery("");
      setResults([]);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      cursor: "pointer",
      borderBottom: i < results.length - 1 ? `1px solid ${COLORS.border}` : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...STYLES.badge(tabColor(r.tab)),
      fontSize: 11,
      minWidth: 52,
      textAlign: "center"
    }
  }, TABS.find(t => t.id === r.tab)?.short ?? r.tab), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: COLORS.text
    }
  }, r.keyword), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: COLORS.textLight
    }
  }, r.desc))))));
}

// ============================================================
// プレースホルダータブ（フェーズ6以降で実装）
// ============================================================
// ============================================================
// フェーズ7: ①顧客本位・倫理タブ
// ============================================================
const ETHICS_SECTIONS = [{
  id: "A",
  label: "A: FD原則"
}, {
  id: "B",
  label: "B: 信頼関係"
}, {
  id: "C",
  label: "C: 税制"
}, {
  id: "D",
  label: "D: 行動経済学"
}, {
  id: "E",
  label: "E: ゴールベース"
}];
function EthicsTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = COLORS.secondary;

  // D・EセクションはchapProgressから進捗を取得
  const combinedProgress = {
    ...state.progress,
    ethics: {
      ...state.progress.ethics,
      D: state.chapProgress?.ch1?.A ?? false,
      E: state.chapProgress?.ch2?.A ?? false
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u9867\u5BA2\u672C\u4F4D\u30FB\u502B\u7406",
    subtitle: "\u30D5\u30A3\u30C7\u30E5\u30FC\u30B7\u30E3\u30EA\u30FC\u30FB\u7A0E\u5236\u30FB\u884C\u52D5\u7D4C\u6E08\u5B66\u30FB\u30B4\u30FC\u30EB\u30D9\u30FC\u30B9",
    color: color,
    icon: Shield
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: ETHICS_SECTIONS,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "ethics",
    sections: ETHICS_SECTIONS,
    progress: combinedProgress,
    color: color,
    onSelect: setSection
  }), section === "A" && /*#__PURE__*/React.createElement(EthicsSectionA, {
    color: color,
    state: state,
    setState: setState
  }), section === "B" && /*#__PURE__*/React.createElement(EthicsSectionB, {
    color: color,
    state: state,
    setState: setState
  }), section === "C" && /*#__PURE__*/React.createElement(EthicsSectionC, {
    color: color,
    state: state,
    setState: setState
  }), section === "D" && /*#__PURE__*/React.createElement(EthicsSectionD, {
    color: color,
    state: state,
    setState: setState
  }), section === "E" && /*#__PURE__*/React.createElement(EthicsSectionE, {
    color: color,
    state: state,
    setState: setState
  }));
}

// --- セクションA: フィデューシャリーデューティー ---
function EthicsSectionA({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const done = state.progress.ethics?.A;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30D5\u30A3\u30C7\u30E5\u30FC\u30B7\u30E3\u30EA\u30FC\u30C7\u30E5\u30FC\u30C6\u30A3\u30FC\uFF08FD\uFF09\u3068\u306F",
    color: color
  }, "\u300C\u9867\u5BA2\u306E\u6700\u5584\u306E\u5229\u76CA\u3092\u6700\u512A\u5148\u306B\u8003\u3048\u305F\u884C\u52D5\u7FA9\u52D9\u300D\uFF1D\u53D7\u8A17\u8005\u8CAC\u4EFB\u3002", /*#__PURE__*/React.createElement("br", null), "\u91D1\u878D\u5E81\u304C2017\u5E74\u306B\u300C\u9867\u5BA2\u672C\u4F4D\u306E\u696D\u52D9\u904B\u55B6\u306B\u95A2\u3059\u308B\u539F\u5247\u300D\u3092\u7B56\u5B9A\u3002", /*#__PURE__*/React.createElement("br", null), "\u30D7\u30EA\u30F3\u30B7\u30D7\u30EB\u30D9\u30FC\u30B9\uFF08\u539F\u5247\u4E3B\u7FA9\uFF09\u30A2\u30D7\u30ED\u30FC\u30C1\u3092\u63A1\u7528\u3002ABC\u8A66\u9A13\u306E\u6700\u91CD\u8981\u30C6\u30FC\u30DE\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(Award, {
    size: 15,
    color: color
  }), " \u9867\u5BA2\u672C\u4F4D\u306E7\u539F\u5247"), FD_PRINCIPLES.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.no,
    style: {
      display: "flex",
      gap: 10,
      padding: "9px 0",
      borderBottom: p.no < 7 ? `1px solid ${COLORS.border}` : "none",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 26,
      height: 26,
      borderRadius: 8,
      background: color,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 900,
      flexShrink: 0
    }
  }, p.no), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: COLORS.text,
      marginBottom: 2
    }
  }, p.title, /*#__PURE__*/React.createElement("span", {
    style: {
      ...STYLES.badge(color),
      marginLeft: 6,
      fontSize: 10
    }
  }, p.keyword)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      lineHeight: 1.6
    }
  }, p.detail))))), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["フィデューシャリー＝「受託者」の意味（信認義務）", "顧客の利益 > 自社の利益 が大原則", "利益相反：販売手数料の高い商品を優先して勧めること等", "KYC（Know Your Customer）：顧客の状況把握義務", "適合性の原則：顧客のリスク許容度に合った商品提案", "7原則は法的拘束力なし・各社が自主的に遵守（プリンシプルベース）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}CC)`
    },
    onClick: () => setShowQuiz(s => !s)
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), showQuiz && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: ETHICS_QUIZZES.A,
    tabId: "ethics",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションB: 顧客との信頼関係構築 ---
function EthicsSectionB({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const done = state.progress.ethics?.B;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30E9\u30A4\u30D5\u30D7\u30E9\u30F3\u30CB\u30F3\u30B0\u306E\u57FA\u672C\u30B9\u30C6\u30C3\u30D7",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "Step1"), " \u30B4\u30FC\u30EB\u8A2D\u5B9A\uFF08\u3044\u3064\u307E\u3067\u306B\u30FB\u3044\u304F\u3089\u30FB\u4F55\u306E\u305F\u3081\u306B\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Step2"), " \u73FE\u72B6\u628A\u63E1\uFF08\u8CC7\u7523\u30FB\u8CA0\u50B5\u30FB\u53CE\u5165\u30FB\u652F\u51FA\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Step3"), " \u30AE\u30E3\u30C3\u30D7\u5206\u6790", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Step4"), " \u89E3\u6C7A\u7B56\u306E\u63D0\u6848", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Step5"), " \u5B9F\u884C\u30FB\u30E2\u30CB\u30BF\u30EA\u30F3\u30B0"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(Search, {
    size: 15,
    color: color
  }), " KYC\uFF08Know Your Customer\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, KYC_ITEMS.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.label,
    style: {
      background: color + "0C",
      border: `1px solid ${color}22`,
      borderRadius: 12,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      marginBottom: 4
    }
  }, item.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color,
      marginBottom: 5
    }
  }, item.label), item.items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it,
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      lineHeight: 1.5
    }
  }, "\u2022 ", it)))))), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["ライフプランニングは「ゴール設定 → 現状把握」の順序が重要", "リスク許容度は年齢・収入安定性・投資期間・心理的耐性で判断", "定期的なモニタリングとリバランスで目標配分を維持", "顧客との面談で最初に確認すべきは「投資目的・期間・ゴール」"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}CC)`
    },
    onClick: () => setShowQuiz(s => !s)
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（5問）"), showQuiz && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: ETHICS_QUIZZES.B,
    tabId: "ethics",
    sectionId: "B",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションC: 資産形成の新しい潮流 ---
function EthicsSectionC({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeProduct, setActiveProduct] = useState("nisa");
  const done = state.progress.ethics?.C;
  const prod = TAX_ADVANTAGE_DATA[activeProduct];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, ["nisa", "ideco"].map(key => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setActiveProduct(key),
    style: {
      flex: 1,
      background: activeProduct === key ? TAX_ADVANTAGE_DATA[key].color : "transparent",
      color: activeProduct === key ? "#fff" : COLORS.textLight,
      border: `2px solid ${TAX_ADVANTAGE_DATA[key].color}`,
      borderRadius: 12,
      padding: "9px 0",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: 14,
      fontFamily: "'Noto Sans JP', sans-serif",
      transition: "all 0.18s ease"
    }
  }, TAX_ADVANTAGE_DATA[key].name.split("（")[0]))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      borderLeft: `4px solid ${prod.color}`,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: prod.color,
      marginBottom: 10
    }
  }, prod.name), prod.points.map(pt => /*#__PURE__*/React.createElement("div", {
    key: pt.label,
    style: {
      display: "flex",
      gap: 8,
      padding: "5px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.textLight,
      minWidth: 90,
      fontWeight: 600,
      fontSize: 12
    }
  }, pt.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.text,
      fontWeight: pt.label === "損益通算" ? 700 : 400
    }
  }, pt.value))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: prod.color,
      marginBottom: 6
    }
  }, "\u30DD\u30A4\u30F3\u30C8"), prod.tips.map((tip, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 4,
      fontSize: 12,
      color: COLORS.text
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: prod.color,
      fontWeight: 700
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, tip))))), /*#__PURE__*/React.createElement(InfoBox, {
    title: "ESG\u6295\u8CC7\u30FB\u30B5\u30B9\u30C6\u30CA\u30D6\u30EB\u6295\u8CC7",
    color: "#16A085"
  }, /*#__PURE__*/React.createElement("strong", null, "E"), "nvironment\uFF08\u74B0\u5883\uFF09\u30FB", /*#__PURE__*/React.createElement("strong", null, "S"), "ocial\uFF08\u793E\u4F1A\uFF09\u30FB", /*#__PURE__*/React.createElement("strong", null, "G"), "overnance\uFF08\u30AC\u30D0\u30CA\u30F3\u30B9\uFF09", /*#__PURE__*/React.createElement("br", null), "\u975E\u8CA1\u52D9\u60C5\u5831\u3092\u6295\u8CC7\u5224\u65AD\u306B\u7D44\u307F\u8FBC\u3080\u3002\u4E3B\u306A\u30A2\u30D7\u30ED\u30FC\u30C1\uFF1A", /*#__PURE__*/React.createElement("br", null), "\u2460\u30CD\u30AC\u30C6\u30A3\u30D6\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0\uFF08\u554F\u984C\u4F01\u696D\u3092\u9664\u5916\uFF09", /*#__PURE__*/React.createElement("br", null), "\u2461\u30DD\u30B8\u30C6\u30A3\u30D6\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0\uFF08\u512A\u826F\u4F01\u696D\u3092\u9078\u5225\uFF09", /*#__PURE__*/React.createElement("br", null), "\u2462ESG\u30A4\u30F3\u30C6\u30B0\u30EC\u30FC\u30B7\u30E7\u30F3\uFF08\u8CA1\u52D9\u60C5\u5831\u3068\u7D71\u5408\uFF09", /*#__PURE__*/React.createElement("br", null), "\u2463\u30A8\u30F3\u30B2\u30FC\u30B8\u30E1\u30F3\u30C8\uFF08\u4F01\u696D\u3068\u306E\u5BFE\u8A71\u3067\u6539\u5584\u4FC3\u9032\uFF09", /*#__PURE__*/React.createElement("br", null), "\u2464\u30A4\u30F3\u30D1\u30AF\u30C8\u6295\u8CC7\uFF08\u793E\u4F1A\u7684\u6210\u679C\u3068\u8CA1\u52D9\u30EA\u30BF\u30FC\u30F3\u306E\u4E21\u7ACB\uFF09"), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["新NISA：年360万円（つみたて120＋成長240）・生涯1,800万円", "NISA損失は他口座との損益通算・繰越控除ができない（頻出ひっかけ）", "新NISAは売却した翌年に簿価分の枠が復活", "iDeCo掛金は全額所得控除・原則60歳まで引き出し不可", "iDeCoの拠出限度額は職業・加入年金制度で異なる", "ESG：Sは「Social（社会）」。Safety・Stabilityではない"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}CC)`
    },
    onClick: () => setShowQuiz(s => !s)
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), showQuiz && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: ETHICS_QUIZZES.C,
    tabId: "ethics",
    sectionId: "C",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// ============================================================
// フェーズ8: ②資産運用の基礎タブ 前半（セクションA・B）
// ============================================================

// --- 単純リターン電卓 ---
function ReturnCalculatorSection({
  color
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30EA\u30BF\u30FC\u30F3\u306E\u7A2E\u985E\u3068\u4F7F\u3044\u5206\u3051",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u5358\u7D14\u30EA\u30BF\u30FC\u30F3\uFF08\u4FDD\u6709\u671F\u9593\uFF09"), "\uFF1AR = (\u671F\u672B\u4FA1\u683C \u2212 \u671F\u521D\u4FA1\u683C + \u914D\u5F53) / \u671F\u521D\u4FA1\u683C", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u5E74\u7387\u30EA\u30BF\u30FC\u30F3\uFF08\u8907\u5229\u63DB\u7B97\uFF09"), "\uFF1A\u5E74\u7387R = (1 + \u4FDD\u6709\u671F\u9593R)^(1/\u5E74\u6570) \u2212 1", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u7B97\u8853\u5E73\u5747"), "\uFF1A\u5404\u671F\u30EA\u30BF\u30FC\u30F3\u306E\u5358\u7D14\u5E73\u5747 \u2192 \u5C06\u6765\u4E88\u6E2C\u306B\u4F7F\u7528", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u5E7E\u4F55\u5E73\u5747"), "\uFF1A\u8907\u5229\u30D9\u30FC\u30B9\u306E\u5E73\u5747 \u2192 \u904E\u53BB\u5B9F\u7E3E\u8A55\u4FA1\u306B\u4F7F\u7528"), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.simpleReturn, {
    color: color
  })), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.annualReturn, {
    color: color
  })), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.geoMean, {
    color: color
  })), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u5358\u7D14\u30EA\u30BF\u30FC\u30F3\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "期初価格",
      key: "p0",
      unit: "円",
      defaultValue: "100"
    }, {
      label: "期末価格",
      key: "p1",
      unit: "円",
      defaultValue: "115"
    }, {
      label: "配当",
      key: "div",
      unit: "円",
      defaultValue: "3"
    }, {
      label: "保有年数",
      key: "n",
      unit: "年",
      defaultValue: "2"
    }],
    calculate: ({
      p0,
      p1,
      div,
      n
    }) => {
      const hpr = (p1 - p0 + div) / p0;
      const annualR = Math.pow(1 + hpr, 1 / n) - 1;
      return {
        results: [{
          label: "保有期間リターン",
          value: (hpr * 100).toFixed(2),
          unit: "%",
          color
        }, {
          label: "年率リターン（複利）",
          value: (annualR * 100).toFixed(2),
          unit: "%",
          color: COLORS.secondary
        }],
        steps: [`保有期間リターン = (${p1} − ${p0} + ${div}) / ${p0} = ${(hpr * 100).toFixed(2)}%`, `年率リターン = (1 + ${(hpr * 100).toFixed(2)}%)^(1/${n}) − 1 = ${(annualR * 100).toFixed(2)}%`]
      };
    },
    chartBuilder: vals => {
      const p0 = vals.p0,
        div = vals.div,
        n = vals.n;
      const data = Array.from({
        length: 11
      }, (_, i) => {
        const rate = -0.1 + i * 0.04;
        const p1 = p0 * (1 + rate);
        const hpr = (p1 - p0 + div) / p0;
        const ann = Math.pow(1 + hpr, 1 / n) - 1;
        return {
          price: Math.round(p1),
          hpr: parseFloat((hpr * 100).toFixed(1)),
          annual: parseFloat((ann * 100).toFixed(1))
        };
      });
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u671F\u672B\u4FA1\u683C\u5225\u30EA\u30BF\u30FC\u30F3\u6BD4\u8F03",
        color: color,
        height: 180
      }, /*#__PURE__*/React.createElement(LineChart, {
        data: data,
        margin: {
          top: 4,
          right: 8,
          left: -18,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "price",
        tick: {
          fontSize: 10
        },
        label: {
          value: "期末(円)",
          position: "insideRight",
          offset: -4,
          fontSize: 10
        }
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 10
        },
        unit: "%"
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => `${v}%`
      }), /*#__PURE__*/React.createElement(Legend, {
        iconSize: 10,
        wrapperStyle: {
          fontSize: 11
        }
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        y: 0,
        stroke: COLORS.danger,
        strokeDasharray: "3 3"
      }), /*#__PURE__*/React.createElement(Line, {
        type: "monotone",
        dataKey: "hpr",
        name: "\u4FDD\u6709\u671F\u9593R",
        stroke: color,
        strokeWidth: 2,
        dot: false
      }), /*#__PURE__*/React.createElement(Line, {
        type: "monotone",
        dataKey: "annual",
        name: "\u5E74\u7387R",
        stroke: COLORS.secondary,
        strokeWidth: 2,
        dot: false
      })));
    }
  }), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u7B97\u8853\u5E73\u5747 vs \u5E7E\u4F55\u5E73\u5747",
    accentColor: COLORS.highlight,
    inputs: [{
      label: "1期リターン",
      key: "r1",
      unit: "%",
      defaultValue: "20"
    }, {
      label: "2期リターン",
      key: "r2",
      unit: "%",
      defaultValue: "-10"
    }, {
      label: "3期リターン",
      key: "r3",
      unit: "%",
      defaultValue: "15"
    }],
    calculate: ({
      r1,
      r2,
      r3
    }) => {
      const r = [r1, r2, r3].map(v => v / 100);
      const arith = (r1 + r2 + r3) / 3;
      const geo = (Math.pow((1 + r[0]) * (1 + r[1]) * (1 + r[2]), 1 / 3) - 1) * 100;
      return {
        results: [{
          label: "算術平均",
          value: arith.toFixed(2),
          unit: "%",
          color: COLORS.highlight
        }, {
          label: "幾何平均",
          value: geo.toFixed(2),
          unit: "%",
          color: COLORS.secondary
        }],
        steps: [`算術平均 = (${r1} + ${r2} + ${r3}) / 3 = ${arith.toFixed(2)}%`, `幾何平均 = ((1+${r1 / 100})(1+${r2 / 100})(1+${r3 / 100}))^(1/3) − 1 = ${geo.toFixed(2)}%`, `算術平均 ≥ 幾何平均（等号は全リターンが同値のとき）`, `将来予測 → 算術平均 ／ 過去の実績評価 → 幾何平均`]
      };
    }
  }));
}

// --- リスク計算セクション ---
function RiskCalculatorSection({
  color
}) {
  const [sigmaVal, setSigmaVal] = useState(15);
  const [meanVal, setMeanVal] = useState(5);
  const normalData = generateNormalDist(meanVal, sigmaVal);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30EA\u30B9\u30AF\uFF08\u6A19\u6E96\u504F\u5DEE\uFF09\u3068\u306F",
    color: color
  }, "\u30EA\u30B9\u30AF\uFF1D\u30EA\u30BF\u30FC\u30F3\u306E\u300C\u3070\u3089\u3064\u304D\u300D\u3092\u6A19\u6E96\u504F\u5DEE\u3067\u8868\u3059\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u5206\u6563 \u03C3\xB2"), " = \u03A3(Ri \u2212 Ra)\xB2 / n", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u6A19\u6E96\u504F\u5DEE \u03C3"), " = \u221A\u5206\u6563\u3000\uFF08\u03C3\u304C\u5927\u304D\u3044\uFF1D\u9AD8\u30EA\u30B9\u30AF\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u76F8\u95A2\u4FC2\u6570 \u03C1"), " = Cov(A,B) / (\u03C3A \xD7 \u03C3B)\u3000\u22121 \u2264 \u03C1 \u2264 1"), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.stdDev, {
    color: color
  })), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.correlation, {
    color: color
  })), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u6A19\u6E96\u504F\u5DEE\u30FB\u76F8\u95A2\u4FC2\u6570\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "リターン1期(%)",
      key: "r1",
      defaultValue: "10"
    }, {
      label: "リターン2期(%)",
      key: "r2",
      defaultValue: "20"
    }, {
      label: "リターン3期(%)",
      key: "r3",
      defaultValue: "-5"
    }, {
      label: "リターン4期(%)",
      key: "r4",
      defaultValue: "15"
    }],
    calculate: ({
      r1,
      r2,
      r3,
      r4
    }) => {
      const rs = [r1, r2, r3, r4];
      const mean = rs.reduce((s, r) => s + r, 0) / rs.length;
      const variance = rs.reduce((s, r) => s + (r - mean) ** 2, 0) / rs.length;
      const sigma = Math.sqrt(variance);
      return {
        results: [{
          label: "平均リターン",
          value: mean.toFixed(2),
          unit: "%",
          color: COLORS.primary
        }, {
          label: "分散",
          value: variance.toFixed(2),
          unit: "",
          color
        }, {
          label: "標準偏差(σ)",
          value: sigma.toFixed(2),
          unit: "%",
          color: COLORS.danger
        }],
        steps: [`平均 Ra = (${rs.join(" + ")}) / 4 = ${mean.toFixed(2)}%`, `偏差² の合計 = ${rs.map(r => `(${r}−${mean.toFixed(1)})²`).join(" + ")}`, `分散 = ${variance.toFixed(2)}`, `標準偏差 σ = √${variance.toFixed(2)} = ${sigma.toFixed(2)}%`]
      };
    },
    chartBuilder: vals => {
      const rs = [vals.r1, vals.r2, vals.r3, vals.r4];
      const mean = rs.reduce((s, r) => s + r, 0) / rs.length;
      const sigma = Math.sqrt(rs.reduce((s, r) => s + (r - mean) ** 2, 0) / rs.length);
      const distData = generateNormalDist(mean, sigma, 50);
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u30EA\u30BF\u30FC\u30F3\u5206\u5E03\uFF08\u6B63\u898F\u5206\u5E03\u8FD1\u4F3C\uFF09",
        color: color,
        height: 160
      }, /*#__PURE__*/React.createElement(AreaChart, {
        data: distData,
        margin: {
          top: 4,
          right: 8,
          left: -24,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "x",
        tick: {
          fontSize: 9
        },
        unit: "%"
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 9
        }
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => v.toFixed(4),
        labelFormatter: l => `${l}%`
      }), /*#__PURE__*/React.createElement(Area, {
        type: "monotone",
        dataKey: "y",
        stroke: color,
        fill: color + "33",
        dot: false
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        x: mean,
        stroke: COLORS.primary,
        strokeDasharray: "3 3",
        label: {
          value: "μ",
          position: "top",
          fontSize: 10
        }
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        x: mean + sigma,
        stroke: COLORS.danger,
        strokeDasharray: "2 2",
        label: {
          value: "+σ",
          position: "top",
          fontSize: 9
        }
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        x: mean - sigma,
        stroke: COLORS.danger,
        strokeDasharray: "2 2",
        label: {
          value: "-σ",
          position: "top",
          fontSize: 9
        }
      })));
    }
  }), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "2\u8CC7\u7523\u306E\u76F8\u95A2\u4FC2\u6570\u8A08\u7B97\u6A5F",
    accentColor: COLORS.highlight,
    inputs: [{
      label: "資産Aリターン1(%)",
      key: "a1",
      defaultValue: "10"
    }, {
      label: "資産Bリターン1(%)",
      key: "b1",
      defaultValue: "5"
    }, {
      label: "資産Aリターン2(%)",
      key: "a2",
      defaultValue: "20"
    }, {
      label: "資産Bリターン2(%)",
      key: "b2",
      defaultValue: "-5"
    }, {
      label: "資産Aリターン3(%)",
      key: "a3",
      defaultValue: "-5"
    }, {
      label: "資産Bリターン3(%)",
      key: "b3",
      defaultValue: "15"
    }],
    calculate: ({
      a1,
      a2,
      a3,
      b1,
      b2,
      b3
    }) => {
      const as = [a1, a2, a3],
        bs = [b1, b2, b3];
      const ma = as.reduce((s, v) => s + v, 0) / 3;
      const mb = bs.reduce((s, v) => s + v, 0) / 3;
      const sigA = Math.sqrt(as.reduce((s, v) => s + (v - ma) ** 2, 0) / 3);
      const sigB = Math.sqrt(bs.reduce((s, v) => s + (v - mb) ** 2, 0) / 3);
      const cov = as.reduce((s, v, i) => s + (v - ma) * (bs[i] - mb), 0) / 3;
      const rho = sigA > 0 && sigB > 0 ? cov / (sigA * sigB) : 0;
      return {
        results: [{
          label: "σA",
          value: sigA.toFixed(2),
          unit: "%",
          color: COLORS.primary
        }, {
          label: "σB",
          value: sigB.toFixed(2),
          unit: "%",
          color: COLORS.secondary
        }, {
          label: "共分散",
          value: cov.toFixed(2),
          unit: "",
          color: COLORS.accent
        }, {
          label: "相関係数 ρ",
          value: rho.toFixed(3),
          unit: "",
          color: COLORS.highlight
        }],
        steps: [`平均: Ra=${ma.toFixed(1)}%, Rb=${mb.toFixed(1)}%`, `σA = ${sigA.toFixed(2)}%、σB = ${sigB.toFixed(2)}%`, `Cov(A,B) = ${cov.toFixed(2)}`, `ρ = ${cov.toFixed(2)} / (${sigA.toFixed(2)} × ${sigB.toFixed(2)}) = ${rho.toFixed(3)}`]
      };
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(Activity, {
    size: 15,
    color: color
  }), " \u6B63\u898F\u5206\u5E03\uFF08\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, "\u5E73\u5747\u30EA\u30BF\u30FC\u30F3 \u03BC: ", meanVal, "%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-10",
    max: "20",
    value: meanVal,
    onChange: e => setMeanVal(Number(e.target.value)),
    style: {
      width: "100%"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, "\u6A19\u6E96\u504F\u5DEE \u03C3: ", sigmaVal, "%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "40",
    value: sigmaVal,
    onChange: e => setSigmaVal(Number(e.target.value)),
    style: {
      width: "100%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8,
      flexWrap: "wrap"
    }
  }, [{
    label: `±1σ ≈ 68%`,
    lo: meanVal - sigmaVal,
    hi: meanVal + sigmaVal
  }, {
    label: `±2σ ≈ 95%`,
    lo: meanVal - 2 * sigmaVal,
    hi: meanVal + 2 * sigmaVal
  }].map(band => /*#__PURE__*/React.createElement("span", {
    key: band.label,
    style: STYLES.badge(color)
  }, band.label, "\uFF08", band.lo.toFixed(1), "\u301C", band.hi.toFixed(1), "%\uFF09"))), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 160
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: normalData,
    margin: {
      top: 4,
      right: 8,
      left: -24,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "x",
    tick: {
      fontSize: 9
    },
    unit: "%"
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fontSize: 9
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => v.toFixed(4),
    labelFormatter: l => `${l}%`
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "y",
    stroke: color,
    fill: color + "30",
    dot: false
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: meanVal,
    stroke: COLORS.primary,
    strokeWidth: 2,
    label: {
      value: "μ",
      position: "insideTopRight",
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: meanVal + sigmaVal,
    stroke: COLORS.danger,
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: meanVal - sigmaVal,
    stroke: COLORS.danger,
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: meanVal + 2 * sigmaVal,
    stroke: COLORS.accent,
    strokeDasharray: "2 2"
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: meanVal - 2 * sigmaVal,
    stroke: COLORS.accent,
    strokeDasharray: "2 2"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      marginTop: 4,
      textAlign: "center"
    }
  }, "\u8D64\u7DDA: \xB11\u03C3\uFF0868%\uFF09\u3000\u6A59\u7DDA: \xB12\u03C3\uFF0895%\uFF09\u3000VaR95% = \u03BC \u2212 1.645\u03C3 = ", (meanVal - 1.645 * sigmaVal).toFixed(1), "%")), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["標準偏差が大きい ＝ リターンのばらつきが大きい ＝ ハイリスク", "±1σ: 68%、±2σ: 95%、±3σ: 99.7%（3シグマルール）", "相関係数ρ=-1：リスクをゼロにできる（理論上）", "ρ=+1：分散効果なし、リスクは加重平均に等しい", "シャープレシオ高い＝必ず良い投資ではない（比較対象による）"]
  }));
}

// --- ②基礎タブ（前半）本体 ---
const BASICS_SECTIONS_AB = [{
  id: "A",
  label: "A: リターン計算"
}, {
  id: "B",
  label: "B: リスク計算"
}];
function BasicsFrontTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = COLORS.accent;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u8CC7\u7523\u904B\u7528\u306E\u57FA\u790E",
    subtitle: "\u30EA\u30BF\u30FC\u30F3\u30FB\u30EA\u30B9\u30AF\u30FB\u73FE\u5728\u4FA1\u5024\u30FB\u7D71\u8A08\u5B66",
    color: color,
    icon: BookOpen
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: BASICS_SECTIONS_AB,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "basics",
    sections: BASICS_SECTIONS_AB,
    progress: state.progress,
    color: color,
    onSelect: setSection
  }), section === "A" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ReturnCalculatorSection, {
    color: color
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(state.progress.basics?.A ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginTop: 4,
      marginBottom: 12,
      background: state.progress.basics?.A ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, #E8922A)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizOpenBasicsA: !s._quizOpenBasicsA
    }))
  }, state.progress.basics?.A ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizOpenBasicsA && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: BASICS_QUIZZES.A,
    tabId: "basics",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState
  })), section === "B" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RiskCalculatorSection, {
    color: color
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(state.progress.basics?.B ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginTop: 4,
      marginBottom: 12,
      background: state.progress.basics?.B ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, #E8922A)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizOpenBasicsB: !s._quizOpenBasicsB
    }))
  }, state.progress.basics?.B ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizOpenBasicsB && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: BASICS_QUIZZES.B,
    tabId: "basics",
    sectionId: "B",
    accentColor: color,
    state: state,
    setState: setState
  })));
}

// ============================================================
// セクションD: 行動経済学（第1章）
// ============================================================
function EthicsSectionD({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const done = state.chapProgress?.ch1?.A ?? false;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u884C\u52D5\u7D4C\u6E08\u5B66\u3068\u306F",
    color: color
  }, "\u4EBA\u9593\u304C\u5E38\u306B\u5408\u7406\u7684\u306B\u884C\u52D5\u3059\u308B\u3068\u306F\u9650\u3089\u306A\u3044\u3053\u3068\u3092\u524D\u63D0\u306B\u3001\u5FC3\u7406\u30FB\u611F\u60C5\u30FB\u8A8D\u77E5\u306E\u30D0\u30A4\u30A2\u30B9\u304C \u610F\u601D\u6C7A\u5B9A\u306B\u4E0E\u3048\u308B\u5F71\u97FF\u3092\u7814\u7A76\u3059\u308B\u5B66\u554F\u3002ABC\u8A66\u9A13\u306E\u7B2C1\u7AE0\u3067\u91CD\u8981\u30C6\u30FC\u30DE\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4E3B\u8981\u306A\u6982\u5FF5\uFF1A"), "\u640D\u5931\u56DE\u907F\u30D0\u30A4\u30A2\u30B9\uFF0F\u30D2\u30E5\u30FC\u30EA\u30B9\u30C6\u30A3\u30C3\u30AF\uFF0F\u30B5\u30F3\u30AF\u30B3\u30B9\u30C8\u52B9\u679C\uFF0F \u30CA\u30C3\u30B8\u7406\u8AD6\uFF0F\u78BA\u8A3C\u30D0\u30A4\u30A2\u30B9\uFF0F\u30A2\u30F3\u30AB\u30EA\u30F3\u30B0\u52B9\u679C\uFF0F\u73FE\u72B6\u7DAD\u6301\u30D0\u30A4\u30A2\u30B9"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 13,
      color,
      marginBottom: 10
    }
  }, "\u4E3B\u8981\u30D0\u30A4\u30A2\u30B9\u65E9\u898B\u8868"), [{
    name: "損失回避バイアス",
    desc: "損失の痛み＞利益の喜び（約2倍）"
  }, {
    name: "ヒューリスティック",
    desc: "直感・経験則による省力化判断"
  }, {
    name: "サンクコスト効果",
    desc: "回収不能コストに引きずられる"
  }, {
    name: "ナッジ理論",
    desc: "強制せず望ましい行動へ誘導"
  }, {
    name: "確証バイアス",
    desc: "自説を裏付ける情報だけ集める"
  }, {
    name: "アンカリング効果",
    desc: "最初の情報が判断の基準になる"
  }, {
    name: "現状維持バイアス",
    desc: "変化を嫌い現状を維持しようとする"
  }, {
    name: "メンタルアカウンティング",
    desc: "お金を心理的に別々に管理する"
  }, {
    name: "過信バイアス",
    desc: "自分の能力を過大評価する"
  }, {
    name: "後知恵バイアス",
    desc: "事後的に「分かっていた」と思い込む"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.name,
    style: {
      display: "flex",
      gap: 8,
      padding: "7px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 6,
      height: 6,
      borderRadius: "50%",
      background: color,
      marginTop: 6,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: COLORS.text
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: COLORS.textLight
    }
  }, " \u2014 ", item.desc))))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      textAlign: "center",
      background: COLORS.secondary + "12",
      border: `2px solid ${COLORS.secondary}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      marginBottom: 4
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: COLORS.secondary
    }
  }, "\u30BB\u30AF\u30B7\u30E7\u30F3D \u5B8C\u4E86\uFF01")) : showQuiz ? /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: CH1_QUIZZES,
    tabId: "ch1",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState,
    progressField: "chapProgress"
  }) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowQuiz(true),
    style: {
      ...STYLES.btnPrimary,
      width: "100%"
    }
  }, "\u884C\u52D5\u7D4C\u6E08\u5B66 \u78BA\u8A8D\u30C6\u30B9\u30C8\uFF0810\u554F\uFF09\u3092\u958B\u59CB"));
}

// ============================================================
// セクションE: ゴールベース資産管理（第2章）
// ============================================================
function EthicsSectionE({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const done = state.chapProgress?.ch2?.A ?? false;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30B4\u30FC\u30EB\u30D9\u30FC\u30B9\u8CC7\u7523\u7BA1\u7406\u3068\u306F",
    color: color
  }, "\u9867\u5BA2\u306E\u300C\u8001\u5F8C\u8CC7\u91D1\u78BA\u4FDD\u300D\u300C\u6559\u80B2\u8CC7\u91D1\u6E96\u5099\u300D\u306A\u3069\u306E\u5177\u4F53\u7684\u306A\u30E9\u30A4\u30D5\u30B4\u30FC\u30EB\u3092\u4E2D\u5FC3\u306B \u8CC7\u7523\u914D\u5206\u3084\u904B\u7528\u8A08\u753B\u3092\u7ACB\u3066\u308B\u30A2\u30D7\u30ED\u30FC\u30C1\u3002ABC\u8A66\u9A13\u306E\u7B2C2\u7AE0\u306E\u6838\u5FC3\u30C6\u30FC\u30DE\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30D7\u30ED\u30BB\u30B9\uFF1A"), "\u2460\u30B4\u30FC\u30EB\u8A2D\u5B9A \u2192 \u2461\u5B9F\u73FE\u30B7\u30CA\u30EA\u30AA\u8A2D\u5B9A\uFF08\u512A\u5148\u9806\u4F4D\u4ED8\u3051\uFF09\u2192 \u2462\u6295\u8CC7\u306E\u9078\u629E\u30FB\u5B9F\u884C \u2192 \u2463\u7D99\u7D9A\u7684\u30EC\u30D3\u30E5\u30FC"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 13,
      color,
      marginBottom: 10
    }
  }, "\u91CD\u8981\u30AD\u30FC\u30EF\u30FC\u30C9"), [{
    name: "ファンドラップ",
    desc: "複数の投信を一括管理する投資一任サービス"
  }, {
    name: "投資一任サービス",
    desc: "事前合意の方針で金融機関が売買判断を代行"
  }, {
    name: "必達ゴール（need）",
    desc: "老後生活費など必ず達成すべき目標→低リスク運用"
  }, {
    name: "理想ゴール（want）",
    desc: "豪華旅行など未達でも致命的でない目標→リスクOK"
  }, {
    name: "継続的レビュー",
    desc: "ライフイベントや市場変化に応じた計画見直し"
  }, {
    name: "長期・積立・分散",
    desc: "金融庁推奨の資産形成基本方針"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.name,
    style: {
      display: "flex",
      gap: 8,
      padding: "7px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 6,
      height: 6,
      borderRadius: "50%",
      background: color,
      marginTop: 6,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: COLORS.text
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: COLORS.textLight
    }
  }, " \u2014 ", item.desc))))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      textAlign: "center",
      background: COLORS.secondary + "12",
      border: `2px solid ${COLORS.secondary}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      marginBottom: 4
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: COLORS.secondary
    }
  }, "\u30BB\u30AF\u30B7\u30E7\u30F3E \u5B8C\u4E86\uFF01")) : showQuiz ? /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: CH2_QUIZZES,
    tabId: "ch2",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState,
    progressField: "chapProgress"
  }) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowQuiz(true),
    style: {
      ...STYLES.btnPrimary,
      width: "100%"
    }
  }, "\u30B4\u30FC\u30EB\u30D9\u30FC\u30B9 \u78BA\u8A8D\u30C6\u30B9\u30C8\uFF088\u554F\uFF09\u3092\u958B\u59CB"));
}

// ============================================================
// フェーズ9: ②資産運用の基礎タブ 後半（セクションC・D・E）
// ============================================================

// 前半(A/B)と後半(C/D/E)を切り替えるルータータブ
const ALL_BASICS_SECTIONS = [{
  id: "A",
  label: "A: リターン"
}, {
  id: "B",
  label: "B: リスク"
}, {
  id: "C",
  label: "C: 現在価値"
}, {
  id: "D",
  label: "D: 統計"
}, {
  id: "E",
  label: "E: 資産配分"
}, {
  id: "F",
  label: "F: 財務諸表"
}];
function BasicsTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = COLORS.accent;

  // F セクションは chapProgress で追跡
  const combinedProgress = {
    ...state.progress,
    basics: {
      ...state.progress.basics,
      F: state.chapProgress?.ch6?.A ?? false
    }
  };
  const renderSection = () => {
    switch (section) {
      case "A":
        return /*#__PURE__*/React.createElement(ReturnCalculatorSection, {
          color: color
        });
      case "B":
        return /*#__PURE__*/React.createElement(RiskCalculatorSection, {
          color: color
        });
      case "C":
        return /*#__PURE__*/React.createElement(PVSection, {
          color: color
        });
      case "D":
        return /*#__PURE__*/React.createElement(StatsSection, {
          color: color
        });
      case "E":
        return /*#__PURE__*/React.createElement(AssetAllocationSection, {
          color: color
        });
      case "F":
        return /*#__PURE__*/React.createElement(BasicsSectionF, {
          color: color,
          state: state,
          setState: setState
        });
      default:
        return null;
    }
  };
  const quizMap = {
    A: BASICS_QUIZZES.A,
    B: BASICS_QUIZZES.B,
    C: BASICS_QUIZZES.C,
    D: BASICS_QUIZZES.C,
    E: BASICS_QUIZZES.C
  };
  const quizKey = `_quizOpenBasics${section}`;
  const done = section === "F" ? state.chapProgress?.ch6?.A ?? false : state.progress.basics?.[section];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u8CC7\u7523\u904B\u7528\u306E\u57FA\u790E",
    subtitle: "\u30EA\u30BF\u30FC\u30F3\u30FB\u30EA\u30B9\u30AF\u30FB\u73FE\u5728\u4FA1\u5024\u30FB\u7D71\u8A08\u30FB\u8CA1\u52D9\u8AF8\u8868",
    color: color,
    icon: BookOpen
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: ALL_BASICS_SECTIONS,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "basics",
    sections: ALL_BASICS_SECTIONS,
    progress: combinedProgress,
    color: color,
    onSelect: setSection
  }), renderSection(), section !== "F" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginTop: 4,
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, #E8922A)`
    },
    onClick: () => setState(s => ({
      ...s,
      [quizKey]: !s[quizKey]
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : `理解度テストを受ける（${quizMap[section]?.length ?? 8}問）`), state[quizKey] && quizMap[section] && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: quizMap[section],
    tabId: "basics",
    sectionId: section,
    accentColor: color,
    state: state,
    setState: setState
  })));
}

// --- セクションF: 財務諸表の活用（第6章）---
function BasicsSectionF({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const done = state.chapProgress?.ch6?.A ?? false;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u8CA1\u52D9\u8AF8\u8868\u306E\u6D3B\u7528",
    color: color
  }, "\u4F01\u696D\u5206\u6790\u30FB\u682A\u5F0F\u8A55\u4FA1\u306E\u57FA\u790E\u3068\u306A\u308B\u8CA1\u52D9\u8AF8\u8868\u306E\u8AAD\u307F\u65B9\u3068\u4E3B\u8981\u6307\u6A19\u3002 ABC\u8A66\u9A13\u3067\u306F\u7B2C6\u7AE0\u3067\u51FA\u984C\u3055\u308C\u308B\u91CD\u8981\u30C6\u30FC\u30DE\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4E3B\u8981\u8CA1\u52D9\u6307\u6A19\uFF1A"), "ROE\uFF08\u53CE\u76CA\u6027\uFF09\uFF0FROA\uFF08\u8CC7\u7523\u52B9\u7387\uFF09\uFF0FPBR\uFF08\u682A\u4FA1\u7D14\u8CC7\u7523\u500D\u7387\uFF09\uFF0F PER\uFF08\u682A\u4FA1\u53CE\u76CA\u7387\uFF09\uFF0F\u6D41\u52D5\u6BD4\u7387\uFF08\u5B89\u5168\u6027\uFF09\uFF0F\u81EA\u5DF1\u8CC7\u672C\u6BD4\u7387"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 13,
      color,
      marginBottom: 10
    }
  }, "\u8CA1\u52D9\u6307\u6A19\u65E9\u898B\u8868"), [{
    name: "ROE",
    formula: "当期純利益 ÷ 自己資本 × 100",
    memo: "株主目線の収益性（目安: 10%以上）"
  }, {
    name: "ROA",
    formula: "純利益（営業利益）÷ 総資産 × 100",
    memo: "資産効率（業種平均と比較）"
  }, {
    name: "PBR",
    formula: "株価 ÷ BPS",
    memo: "1倍未満＝理論上割安"
  }, {
    name: "PER",
    formula: "株価 ÷ EPS",
    memo: "業種平均との比較が重要"
  }, {
    name: "配当利回り",
    formula: "年間配当 ÷ 株価 × 100",
    memo: "高利回り＝必ずしも優良ではない"
  }, {
    name: "流動比率",
    formula: "流動資産 ÷ 流動負債 × 100",
    memo: "200%以上が目安（短期安全性）"
  }, {
    name: "自己資本比率",
    formula: "自己資本 ÷ 総資産 × 100",
    memo: "40%以上が目安（財務健全性）"
  }, {
    name: "デュポン分析",
    formula: "ROE = 純利益率 × 総資産回転率 × レバレッジ",
    memo: "ROEを3要素に分解"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.name,
    style: {
      padding: "7px 0",
      borderBottom: `1px solid ${COLORS.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 12,
      color: COLORS.text
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: COLORS.textLight
    }
  }, item.memo)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontSize: 12,
      color,
      fontWeight: 600
    }
  }, item.formula)))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      textAlign: "center",
      background: COLORS.secondary + "12",
      border: `2px solid ${COLORS.secondary}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      marginBottom: 4
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: COLORS.secondary
    }
  }, "\u30BB\u30AF\u30B7\u30E7\u30F3F \u5B8C\u4E86\uFF01")) : showQuiz ? /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: CH6_QUIZZES,
    tabId: "ch6",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState,
    progressField: "chapProgress"
  }) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowQuiz(true),
    style: {
      ...STYLES.btnPrimary,
      width: "100%",
      background: `linear-gradient(135deg, ${color}, #E8922A)`
    }
  }, "\u8CA1\u52D9\u8AF8\u8868 \u78BA\u8A8D\u30C6\u30B9\u30C8\uFF0812\u554F\uFF09\u3092\u958B\u59CB"));
}

// --- セクションC: 現在価値と割引率 ---
function PVSection({
  color
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u73FE\u5728\u4FA1\u5024\uFF08PV\uFF09\u306E\u8003\u3048\u65B9",
    color: color
  }, "\u300C\u4ECA\u306E1\u4E07\u5186\u306F\u5C06\u6765\u306E1\u4E07\u5186\u3088\u308A\u4FA1\u5024\u304C\u9AD8\u3044\u300D\uFF1D\u6642\u9593\u4FA1\u5024\u306E\u6982\u5FF5\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "PV = FV / (1 + r)^n"), "\u3000\u5272\u5F15\u7387\u304C\u9AD8\u3044\u30FB\u671F\u9593\u304C\u9577\u3044\u307B\u3069PV\u306F\u5C0F\u3055\u304F\u306A\u308B\u3002", /*#__PURE__*/React.createElement("br", null), "NPV\uFF08\u6B63\u5473\u73FE\u5728\u4FA1\u5024\uFF09= \u5C06\u6765CF\u306E\u73FE\u5728\u4FA1\u5024\u5408\u8A08 \u2212 \u521D\u671F\u6295\u8CC7"), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.pv, {
    color: color
  })), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u73FE\u5728\u4FA1\u5024\u30FB\u5C06\u6765\u4FA1\u5024\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "将来価値 FV",
      key: "fv",
      unit: "万円",
      defaultValue: "100"
    }, {
      label: "割引率 r",
      key: "r",
      unit: "%",
      defaultValue: "3"
    }, {
      label: "期間 n",
      key: "n",
      unit: "年",
      defaultValue: "10"
    }],
    calculate: ({
      fv,
      r,
      n
    }) => {
      const rate = r / 100;
      const pv = fv / Math.pow(1 + rate, n);
      const fv2 = fv * Math.pow(1 + rate, n);
      return {
        results: [{
          label: "現在価値（PV）",
          value: pv.toFixed(2),
          unit: "万円",
          color
        }, {
          label: "複利後（FV→）",
          value: fv2.toFixed(2),
          unit: "万円",
          color: COLORS.secondary
        }],
        steps: [`PV = ${fv} / (1 + ${rate})^${n}`, `(1 + ${rate})^${n} = ${Math.pow(1 + rate, n).toFixed(4)}`, `PV = ${fv} / ${Math.pow(1 + rate, n).toFixed(4)} = ${pv.toFixed(2)} 万円`, `（逆方向）FV = ${fv} × (1+${rate})^${n} = ${fv2.toFixed(2)} 万円`]
      };
    },
    chartBuilder: vals => {
      const {
        fv,
        n
      } = vals;
      const rates = [1, 2, 3, 5, 7, 10];
      const data = Array.from({
        length: Math.min(n, 30) + 1
      }, (_, t) => {
        const entry = {
          year: t
        };
        rates.forEach(rp => {
          entry[`${rp}%`] = parseFloat((fv / Math.pow(1 + rp / 100, t)).toFixed(2));
        });
        return entry;
      });
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u5272\u5F15\u7387\u5225\u30FB\u73FE\u5728\u4FA1\u5024\u306E\u63A8\u79FB",
        color: color,
        height: 200
      }, /*#__PURE__*/React.createElement(LineChart, {
        data: data,
        margin: {
          top: 4,
          right: 8,
          left: -10,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "year",
        tick: {
          fontSize: 9
        },
        label: {
          value: "年",
          position: "insideRight",
          offset: -2,
          fontSize: 10
        }
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 9
        },
        unit: "\u4E07"
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => `${v}万円`,
        labelFormatter: l => `${l}年後`
      }), /*#__PURE__*/React.createElement(Legend, {
        iconSize: 10,
        wrapperStyle: {
          fontSize: 10
        }
      }), rates.map((rp, i) => /*#__PURE__*/React.createElement(Line, {
        key: rp,
        type: "monotone",
        dataKey: `${rp}%`,
        name: `r=${rp}%`,
        stroke: [COLORS.primary, COLORS.secondary, color, COLORS.highlight, COLORS.accent, COLORS.danger][i],
        strokeWidth: 1.5,
        dot: false
      }))));
    }
  }), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u8907\u5229\u6210\u9577\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC",
    accentColor: COLORS.secondary,
    inputs: [{
      label: "元本",
      key: "pv0",
      unit: "万円",
      defaultValue: "100"
    }, {
      label: "年率リターン",
      key: "r",
      unit: "%",
      defaultValue: "5"
    }, {
      label: "積立（月）",
      key: "mo",
      unit: "万円",
      defaultValue: "3"
    }, {
      label: "期間",
      key: "n",
      unit: "年",
      defaultValue: "20"
    }],
    calculate: ({
      pv0,
      r,
      mo,
      n
    }) => {
      const rate = r / 100;
      const mRate = rate / 12;
      const months = n * 12;
      // 元本一括の複利
      const lump = pv0 * Math.pow(1 + rate, n);
      // 積立分の将来価値（月複利）
      const accum = mo * (Math.pow(1 + mRate, months) - 1) / mRate;
      const total = lump + accum;
      const invest = pv0 + mo * months;
      return {
        results: [{
          label: "最終資産",
          value: total.toFixed(0),
          unit: "万円",
          color: COLORS.secondary
        }, {
          label: "投資総額",
          value: invest.toFixed(0),
          unit: "万円",
          color: COLORS.textLight
        }, {
          label: "運用益",
          value: (total - invest).toFixed(0),
          unit: "万円",
          color: COLORS.accent
        }],
        steps: [`一括投資分: ${pv0}万円 × (1+${rate})^${n} = ${lump.toFixed(1)}万円`, `積立分: ${mo}万円 × [(1+${mRate.toFixed(5)})^${months} − 1] / ${mRate.toFixed(5)} = ${accum.toFixed(1)}万円`, `合計 = ${lump.toFixed(1)} + ${accum.toFixed(1)} = ${total.toFixed(0)}万円`, `投資総額 = ${pv0} + ${mo}×${months}ヶ月 = ${invest.toFixed(0)}万円`, `運用益 = ${(total - invest).toFixed(0)}万円（${((total / invest - 1) * 100).toFixed(1)}%増）`]
      };
    },
    chartBuilder: vals => {
      const {
        pv0,
        r,
        mo,
        n
      } = vals;
      const rate = r / 100,
        mRate = rate / 12;
      const data = Array.from({
        length: n + 1
      }, (_, yr) => {
        const lump = pv0 * Math.pow(1 + rate, yr);
        const accum = mo * (Math.pow(1 + mRate, yr * 12) - 1) / mRate;
        const inv = pv0 + mo * yr * 12;
        return {
          year: yr,
          資産: parseFloat((lump + accum).toFixed(0)),
          投資額: parseFloat(inv.toFixed(0))
        };
      });
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u8907\u5229\u6210\u9577\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
        color: COLORS.secondary,
        height: 200
      }, /*#__PURE__*/React.createElement(AreaChart, {
        data: data,
        margin: {
          top: 4,
          right: 8,
          left: -10,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "year",
        tick: {
          fontSize: 9
        },
        unit: "\u5E74"
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 9
        },
        unit: "\u4E07"
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => `${v}万円`,
        labelFormatter: l => `${l}年後`
      }), /*#__PURE__*/React.createElement(Legend, {
        iconSize: 10,
        wrapperStyle: {
          fontSize: 10
        }
      }), /*#__PURE__*/React.createElement(Area, {
        type: "monotone",
        dataKey: "\u8CC7\u7523",
        stroke: COLORS.secondary,
        fill: COLORS.secondary + "33",
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement(Area, {
        type: "monotone",
        dataKey: "\u6295\u8CC7\u984D",
        stroke: COLORS.primary,
        fill: COLORS.primary + "18",
        strokeWidth: 1.5
      })));
    }
  }), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["割引率が上昇 → 現在価値は低下（逆相関）。債券価格と金利の関係と同原理", "NPV > 0 → 投資価値あり（将来CF現在価値 > 初期投資）", "複利の力：年5%で20年間運用すると元本は約2.65倍", "ドルコスト平均法：定期定額購入で平均取得単価を算術平均より低く抑える"]
  }));
}

// --- セクションD: 統計学の基礎（VaR・シャープレシオ） ---
function StatsSection({
  color
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "VaR\uFF08\u30D0\u30EA\u30E5\u30FC\u30FB\u30A2\u30C3\u30C8\u30FB\u30EA\u30B9\u30AF\uFF09",
    color: color
  }, "\u4E00\u5B9A\u306E\u4FE1\u983C\u6C34\u6E96\u3067\u4E00\u5B9A\u671F\u9593\u5185\u306B\u767A\u751F\u3057\u3046\u308B\u6700\u5927\u640D\u5931\u984D\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "95%VaR = \u03BC \u2212 1.645\u03C3"), "\u3000\uFF08z\u5024\uFF1A90%\u21921.28\u300199%\u21922.326\uFF09", /*#__PURE__*/React.createElement("br", null), "\u4F8B: \u03BC=5%, \u03C3=15%\u306E\u3068\u304D 95%VaR = 5 \u2212 1.645\xD715 = ", /*#__PURE__*/React.createElement("strong", null, "\u221219.7%")), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.sharpe, {
    color: color
  })), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u30B7\u30E3\u30FC\u30D7\u30EC\u30B7\u30AA\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "ポートフォリオR Rp",
      key: "rp",
      unit: "%",
      defaultValue: "12"
    }, {
      label: "リスクフリーR Rf",
      key: "rf",
      unit: "%",
      defaultValue: "2"
    }, {
      label: "標準偏差 σp",
      key: "sp",
      unit: "%",
      defaultValue: "15"
    }],
    calculate: ({
      rp,
      rf,
      sp
    }) => {
      const sr = (rp - rf) / sp;
      const var95 = rp - 1.645 * sp;
      const var99 = rp - 2.326 * sp;
      return {
        results: [{
          label: "シャープレシオ",
          value: sr.toFixed(3),
          unit: "",
          color
        }, {
          label: "VaR 95%",
          value: var95.toFixed(2),
          unit: "%",
          color: COLORS.danger
        }, {
          label: "VaR 99%",
          value: var99.toFixed(2),
          unit: "%",
          color: COLORS.danger
        }],
        steps: [`SR = (${rp}% − ${rf}%) / ${sp}% = ${((rp - rf) / sp).toFixed(3)}`, `SR > 1.0 なら優良、< 0 なら超過リターンがマイナス`, `95%VaR = ${rp} − 1.645 × ${sp} = ${var95.toFixed(2)}%`, `99%VaR = ${rp} − 2.326 × ${sp} = ${var99.toFixed(2)}%`]
      };
    },
    chartBuilder: vals => {
      const {
        rp,
        rf,
        sp
      } = vals;
      const data = generateNormalDist(rp, sp, 60);
      const var95 = rp - 1.645 * sp;
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u30EA\u30BF\u30FC\u30F3\u5206\u5E03\u3068VaR",
        color: color,
        height: 160
      }, /*#__PURE__*/React.createElement(AreaChart, {
        data: data,
        margin: {
          top: 4,
          right: 8,
          left: -24,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "x",
        tick: {
          fontSize: 9
        },
        unit: "%"
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 9
        }
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => v.toFixed(5),
        labelFormatter: l => `${l}%`
      }), /*#__PURE__*/React.createElement(Area, {
        type: "monotone",
        dataKey: "y",
        stroke: color,
        fill: color + "30",
        dot: false
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        x: var95,
        stroke: COLORS.danger,
        strokeWidth: 2,
        strokeDasharray: "4 2",
        label: {
          value: `VaR95%:${var95.toFixed(1)}%`,
          position: "insideTopLeft",
          fontSize: 9,
          fill: COLORS.danger
        }
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        x: rp,
        stroke: COLORS.primary,
        strokeWidth: 1.5,
        label: {
          value: "μ",
          position: "insideTopRight",
          fontSize: 10,
          fill: COLORS.primary
        }
      })));
    }
  }), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["95%VaR：100日中5日はこの損失を超える（5%の確率で超過）", "シャープレシオ：リスク1単位あたりの超過リターン", "シャープレシオ高い＝必ず優れた投資ではない（比較対象・用途による）", "VaRは最悪シナリオ（テールリスク）を示さない点に注意", "zスコア：±1σ=68%、±1.645σ=90%、±1.96σ=95%（両側）"]
  }));
}

// --- セクションE: アセットアロケーション ---
function AssetAllocationSection({
  color
}) {
  const initWeights = {
    "国内株式": 30,
    "国内債券": 30,
    "外国株式": 20,
    "外国債券": 10,
    "国内REIT": 10
  };
  const [weights, setWeights] = useState(initWeights);
  const totalW = Object.values(weights).reduce((s, v) => s + v, 0);
  const pfRet = ASSET_CLASS_DATA.reduce((s, a) => s + weights[a.name] / 100 * a.expectedReturn, 0);
  // 簡易近似（相関=0.3仮定）
  const pfVar = ASSET_CLASS_DATA.reduce((s, a) => {
    const wi = weights[a.name] / 100;
    return s + wi * wi * a.risk * a.risk;
  }, 0);
  const pfRisk = Math.sqrt(pfVar);
  const pfSR = pfRisk > 0 ? (pfRet - 0.002) / pfRisk : 0;
  const scatterData = ASSET_CLASS_DATA.map(a => ({
    x: parseFloat((a.risk * 100).toFixed(1)),
    y: parseFloat((a.expectedReturn * 100).toFixed(1)),
    name: a.name,
    fill: a.color
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30A2\u30BB\u30C3\u30C8\u30A2\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u91CD\u8981\u6027",
    color: color
  }, "Brinson et al. \u306E\u7814\u7A76\uFF1A\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u30EA\u30BF\u30FC\u30F3\u306E\u5909\u52D5\u306E\u7D0490%\u306F\u8CC7\u7523\u914D\u5206\u3067\u6C7A\u307E\u308B\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30A2\u30BB\u30C3\u30C8\u30A2\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3"), "\uFF1A\u4F55\u306B\u4F55%\u914D\u5206\u3059\u308B\u304B\uFF08\u8CC7\u7523\u30AF\u30E9\u30B9\u306E\u6BD4\u7387\u6C7A\u5B9A\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30A2\u30BB\u30C3\u30C8\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3"), "\uFF1A\u3069\u306E\u53E3\u5EA7\uFF08NISA/iDeCo/\u8AB2\u7A0E\uFF09\u306B\u7F6E\u304F\u304B\uFF08\u7A0E\u52B9\u7387\u5316\uFF09"), /*#__PURE__*/React.createElement(ChartCard, {
    title: "\u8CC7\u7523\u30AF\u30E9\u30B9\u5225 \u30EA\u30B9\u30AF\u30FB\u30EA\u30BF\u30FC\u30F3\u7279\u6027",
    color: color,
    height: 220
  }, /*#__PURE__*/React.createElement(ScatterChart, {
    margin: {
      top: 10,
      right: 20,
      left: -10,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    type: "number",
    dataKey: "x",
    name: "\u30EA\u30B9\u30AF",
    unit: "%",
    tick: {
      fontSize: 10
    },
    label: {
      value: "リスク(%)",
      position: "insideBottom",
      offset: -2,
      fontSize: 11
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    type: "number",
    dataKey: "y",
    name: "\u671F\u5F85\u30EA\u30BF\u30FC\u30F3",
    unit: "%",
    tick: {
      fontSize: 10
    },
    label: {
      value: "期待R(%)",
      angle: -90,
      position: "insideLeft",
      fontSize: 11
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    cursor: {
      strokeDasharray: "3 3"
    },
    content: ({
      payload
    }) => {
      if (!payload?.length) return null;
      const d = payload[0].payload;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700,
          color: d.fill
        }
      }, d.name), /*#__PURE__*/React.createElement("div", null, "\u30EA\u30B9\u30AF: ", d.x, "%\u3000\u30EA\u30BF\u30FC\u30F3: ", d.y, "%"));
    }
  }), scatterData.map(d => /*#__PURE__*/React.createElement(Scatter, {
    key: d.name,
    name: d.name,
    data: [d],
    fill: d.fill
  })), /*#__PURE__*/React.createElement(Scatter, {
    name: "PF\uFF08\u73FE\u5728\uFF09",
    data: [{
      x: parseFloat((pfRisk * 100).toFixed(1)),
      y: parseFloat((pfRet * 100).toFixed(1))
    }],
    fill: COLORS.primary,
    shape: "star"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 12
    }
  }, ASSET_CLASS_DATA.map(a => /*#__PURE__*/React.createElement("span", {
    key: a.name,
    style: {
      ...STYLES.badge(a.color),
      fontSize: 11
    }
  }, a.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      ...STYLES.badge(COLORS.primary),
      fontSize: 11
    }
  }, "\u2605 PF\uFF08\u73FE\u5728\uFF09")), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(PieChart, {
    size: 15,
    color: color
  }), " \u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: COLORS.danger,
      marginBottom: 8
    }
  }, "\u26A0 \u5408\u8A08\u304C100%\u306B\u306A\u308B\u3088\u3046\u8ABF\u6574\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u73FE\u5728: ", totalW, "%\uFF09"), ASSET_CLASS_DATA.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: a.color
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800
    }
  }, weights[a.name], "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: weights[a.name],
    onChange: e => setWeights(w => ({
      ...w,
      [a.name]: Number(e.target.value)
    })),
    style: {
      width: "100%",
      accentColor: a.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: COLORS.textLight
    }
  }, "\u671F\u5F85R: ", (a.expectedReturn * 100).toFixed(1), "%\u3000\u30EA\u30B9\u30AF: ", (a.risk * 100).toFixed(0), "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      flex: 1,
      textAlign: "center",
      padding: "10px 12px",
      minWidth: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES.label
  }, "\u671F\u5F85\u30EA\u30BF\u30FC\u30F3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: COLORS.secondary
    }
  }, (pfRet * 100).toFixed(2), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      flex: 1,
      textAlign: "center",
      padding: "10px 12px",
      minWidth: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES.label
  }, "\u30EA\u30B9\u30AF\uFF08\u8FD1\u4F3C\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: COLORS.danger
    }
  }, (pfRisk * 100).toFixed(2), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      flex: 1,
      textAlign: "center",
      padding: "10px 12px",
      minWidth: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES.label
  }, "\u30B7\u30E3\u30FC\u30D7\u30EC\u30B7\u30AA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: color
    }
  }, pfSR.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: COLORS.textLight,
      marginTop: 6,
      textAlign: "center"
    }
  }, "\u203B\u30EA\u30B9\u30AF\u306F\u8CC7\u7523\u9593\u306E\u76F8\u95A2\u3092\u8003\u616E\u3057\u306A\u3044\u7C21\u6613\u8FD1\u4F3C\u5024\u3067\u3059")), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["アセットアロケーションがリターンの約90%を決定する（Brinson研究）", "アセットロケーション≠アセットアロケーション（口座の使い分け）", "NISA・iDeCoには税効率の低い資産（高分配・REIT等）を優先配置", "年齢とともにリスク資産比率を下げるライフサイクル投資も有効"]
  }));
}

// --- ②基礎タブ（後半）拡張 ---
const BASICS_SECTIONS_CDE = [{
  id: "C",
  label: "C: 現在価値"
}, {
  id: "D",
  label: "D: 統計・VaR"
}, {
  id: "E",
  label: "E: 資産配分"
}];
function BasicsBackTab({
  state,
  setState
}) {
  const [section, setSection] = useState("C");
  const color = COLORS.accent;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u8CC7\u7523\u904B\u7528\u306E\u57FA\u790E\uFF08\u5F8C\u534A\uFF09",
    subtitle: "\u73FE\u5728\u4FA1\u5024\u30FB\u7D71\u8A08\u30FB\u30A2\u30BB\u30C3\u30C8\u30A2\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3",
    color: color,
    icon: BookOpen
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: BASICS_SECTIONS_CDE,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "basics",
    sections: [...BASICS_SECTIONS_CDE],
    progress: state.progress,
    color: color,
    onSelect: setSection
  }), section === "C" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PVSection, {
    color: color
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(state.progress.basics?.C ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginTop: 4,
      marginBottom: 12,
      background: state.progress.basics?.C ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, #E8922A)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizOpenBasicsC: !s._quizOpenBasicsC
    }))
  }, state.progress.basics?.C ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizOpenBasicsC && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: BASICS_QUIZZES.C,
    tabId: "basics",
    sectionId: "C",
    accentColor: color,
    state: state,
    setState: setState
  })), section === "D" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StatsSection, {
    color: color
  }), /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u6B63\u898F\u5206\u5E03\u306E3\u30B7\u30B0\u30DE\u30EB\u30FC\u30EB\uFF08\u5FC5\u9808\u6697\u8A18\uFF09",
    color: COLORS.highlight
  }, /*#__PURE__*/React.createElement("strong", null, "\xB11\u03C3 \u2248 68%"), "\u3000\xB12\u03C3 \u2248 95%\u3000\xB13\u03C3 \u2248 99.7%", /*#__PURE__*/React.createElement("br", null), "VaR\u8A08\u7B97\u306Ez\u30B9\u30B3\u30A2\uFF1A90%\u21921.28\u300095%\u21921.645\u300099%\u21922.326"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(state.progress.basics?.D ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginTop: 4,
      marginBottom: 12,
      background: state.progress.basics?.D ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, #E8922A)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizOpenBasicsD: !s._quizOpenBasicsD
    }))
  }, state.progress.basics?.D ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizOpenBasicsD && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: BASICS_QUIZZES.C,
    tabId: "basics",
    sectionId: "D",
    accentColor: color,
    state: state,
    setState: setState
  })), section === "E" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AssetAllocationSection, {
    color: color
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(state.progress.basics?.E ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginTop: 4,
      marginBottom: 12,
      background: state.progress.basics?.E ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, #E8922A)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizOpenBasicsE: !s._quizOpenBasicsE
    }))
  }, state.progress.basics?.E ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizOpenBasicsE && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: BASICS_QUIZZES.C,
    tabId: "basics",
    sectionId: "E",
    accentColor: color,
    state: state,
    setState: setState
  })));
}

// ============================================================
// フェーズ10: ③ポートフォリオ理論タブ
// ============================================================

// --- セクションA: 分散投資の効果 ---
function PortfolioSectionA({
  color,
  state,
  setState
}) {
  const [rhoSlider, setRhoSlider] = useState(0); // -100〜100 → /100
  const [wASlider, setWASlider] = useState(50);
  const [rA, setRA] = useState(8);
  const [rB, setRB] = useState(4);
  const [sigA, setSigA] = useState(15);
  const [sigB, setSigB] = useState(8);
  const rho = rhoSlider / 100;
  const wA = wASlider / 100;
  const wB = 1 - wA;
  const pfRet = wA * rA + wB * rB;
  const pfVar = wA * wA * sigA * sigA + wB * wB * sigB * sigB + 2 * wA * wB * rho * sigA * sigB;
  const pfRisk = Math.sqrt(Math.max(0, pfVar));

  // 相関係数別の比率-リスク曲線
  const frontierData = (() => {
    const rows = [];
    for (let w = 0; w <= 100; w += 5) {
      const wa = w / 100,
        wb = 1 - wa;
      const ret = wa * rA + wb * rB;
      const entry = {
        wA: w,
        ret: parseFloat(ret.toFixed(2))
      };
      [-1, -0.5, 0, 0.5, 1].forEach(r => {
        const v = wa * wa * sigA * sigA + wb * wb * sigB * sigB + 2 * wa * wb * r * sigA * sigB;
        entry[`ρ=${r}`] = parseFloat(Math.sqrt(Math.max(0, v)).toFixed(2));
      });
      rows.push(entry);
    }
    return rows;
  })();
  const done = state.progress.portfolio?.A;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "2\u8CC7\u7523\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u306E\u30EA\u30B9\u30AF\u516C\u5F0F",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u03C3P\xB2 = wA\xB2\u03C3A\xB2 + wB\xB2\u03C3B\xB2 + 2\xB7wA\xB7wB\xB7\u03C1\xB7\u03C3A\xB7\u03C3B"), /*#__PURE__*/React.createElement("br", null), "\u03C1 = +1\uFF1A\u5206\u6563\u52B9\u679C\u306A\u3057\uFF08\u30EA\u30B9\u30AF\u306F\u52A0\u91CD\u5E73\u5747\uFF09", /*#__PURE__*/React.createElement("br", null), "\u03C1 =  0\uFF1A\u90E8\u5206\u7684\u306A\u5206\u6563\u52B9\u679C", /*#__PURE__*/React.createElement("br", null), "\u03C1 = \u22121\uFF1A\u9069\u5207\u306A\u6BD4\u7387\u3067\u30EA\u30B9\u30AF\u3092\u30BC\u30ED\u306B\u3067\u304D\u308B\uFF08\u7406\u8AD6\u4E0A\uFF09"), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.portfolioRisk, {
    color: color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 15,
    color: color
  }), " \u76F8\u95A2\u4FC2\u6570\u5225\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u30EA\u30B9\u30AF\uFF08\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 12
    }
  }, [{
    label: `σA: ${sigA}%`,
    val: sigA,
    set: setSigA,
    min: 1,
    max: 40
  }, {
    label: `σB: ${sigB}%`,
    val: sigB,
    set: setSigB,
    min: 1,
    max: 40
  }, {
    label: `E(rA): ${rA}%`,
    val: rA,
    set: setRA,
    min: -5,
    max: 20
  }, {
    label: `E(rB): ${rB}%`,
    val: rB,
    set: setRB,
    min: -5,
    max: 20
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label
  }, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, s.label), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: s.min,
    max: s.max,
    value: s.val,
    onChange: e => s.set(Number(e.target.value)),
    style: {
      width: "100%",
      accentColor: color
    }
  })))), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 180
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: frontierData,
    margin: {
      top: 4,
      right: 8,
      left: -20,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "wA",
    tick: {
      fontSize: 9
    },
    label: {
      value: "資産A比率(%)",
      position: "insideBottom",
      offset: -2,
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fontSize: 9
    },
    unit: "%",
    label: {
      value: "PFリスク%",
      angle: -90,
      position: "insideLeft",
      fontSize: 9
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`,
    labelFormatter: l => `資産A比率: ${l}%`
  }), /*#__PURE__*/React.createElement(Legend, {
    iconSize: 10,
    wrapperStyle: {
      fontSize: 10
    }
  }), [["ρ=-1", COLORS.secondary], ["ρ=-0.5", "#2ECC71"], ["ρ=0", COLORS.primary], ["ρ=0.5", COLORS.accent], ["ρ=1", COLORS.danger]].map(([key, clr]) => /*#__PURE__*/React.createElement(Line, {
    key: key,
    type: "monotone",
    dataKey: key,
    name: key,
    stroke: clr,
    strokeWidth: 1.8,
    dot: false
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(Calculator, {
    size: 14,
    color: color
  }), " \u73FE\u5728\u306E\u8A2D\u5B9A\u3067\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u3092\u8A08\u7B97"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, "\u76F8\u95A2\u4FC2\u6570 \u03C1: ", rho.toFixed(2)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: -100,
    max: 100,
    value: rhoSlider,
    onChange: e => setRhoSlider(Number(e.target.value)),
    style: {
      width: "100%",
      accentColor: color
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, "\u8CC7\u7523A\u6BD4\u7387: ", wASlider, "%\uFF08\u8CC7\u7523B: ", 100 - wASlider, "%\uFF09"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 0,
    max: 100,
    step: 5,
    value: wASlider,
    onChange: e => setWASlider(Number(e.target.value)),
    style: {
      width: "100%",
      accentColor: color
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ResultCard, {
    label: "PF\u30EA\u30BF\u30FC\u30F3",
    value: pfRet.toFixed(2),
    unit: "%",
    color: COLORS.secondary
  }), /*#__PURE__*/React.createElement(ResultCard, {
    label: "PF\u30EA\u30B9\u30AF",
    value: pfRisk.toFixed(2),
    unit: "%",
    color: COLORS.danger,
    large: true
  }), /*#__PURE__*/React.createElement(ResultCard, {
    label: "\u03C1",
    value: rho.toFixed(2),
    unit: "",
    color: color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: COLORS.textLight,
      textAlign: "center"
    }
  }, rho <= -0.8 && pfRisk < 1 ? "⚡ ほぼリスクゼロ！完全逆相関に近い状態です" : rho === 1 ? "⚠ ρ=1：分散効果なし" : `ρ=${rho.toFixed(2)}：単純加重平均リスク${(wA * sigA + wB * sigB).toFixed(2)}% → PF${pfRisk.toFixed(2)}%（${(wA * sigA + wB * sigB - pfRisk).toFixed(2)}%削減）`)), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["ρ=−1で特定比率（wA=σB/(σA+σB)）にするとリスクがゼロ", "ρ=+1：分散効果なし、リスクは加重平均に等しい", "20〜30銘柄で非システマティックリスクの大部分を消去可能", "残るのはシステマティックリスク（市場リスク・βで計測）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPFA: !s._quizPFA
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizPFA && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PORTFOLIO_QUIZZES.A,
    tabId: "portfolio",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションB: 効率的フロンティア ---
function PortfolioSectionB({
  color,
  state,
  setState
}) {
  const rf = 0.02;
  const efData = generateEfficientFrontier(0.08, 0.03, 0.18, 0.06, 40).filter(d => d.rho === 0).map(d => ({
    sig: d.sig,
    ret: d.ret,
    sr: parseFloat(((d.ret - rf * 100) / d.sig).toFixed(3))
  }));

  // 最小分散点・接点PF
  const minVar = efData.reduce((m, d) => d.sig < m.sig ? d : m, efData[0]);
  const maxSR = efData.reduce((m, d) => d.sr > m.sr ? d : m, efData[0]);

  // CMLデータ（rf〜接点PFを延長）
  const cmlData = [{
    sig: 0,
    ret: rf * 100
  }, {
    sig: maxSR.sig,
    ret: maxSR.ret
  }, {
    sig: maxSR.sig * 1.8,
    ret: rf * 100 + (maxSR.ret - rf * 100) * 1.8
  }];
  const done = state.progress.portfolio?.B;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u52B9\u7387\u7684\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2\u3068CML",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u52B9\u7387\u7684\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2"), "\uFF1A\u540C\u3058\u30EA\u30B9\u30AF\u3067\u6700\u5927\u30EA\u30BF\u30FC\u30F3\u306E\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u96C6\u5408", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u6700\u5C0F\u5206\u6563\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA"), "\uFF1A\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2\u4E0A\u3067\u30EA\u30B9\u30AF\u6700\u5C0F\u306E\u70B9", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u63A5\u70B9\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA"), "\uFF1ACML\u3068\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2\u306E\u63A5\u70B9 = \u30B7\u30E3\u30FC\u30D7\u30EC\u30B7\u30AA\u6700\u5927", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "CML\uFF08\u8CC7\u672C\u5E02\u5834\u7DDA\uFF09"), "\uFF1A\u30EA\u30B9\u30AF\u30D5\u30EA\u30FC\u8CC7\u7523\u3068\u63A5\u70B9PF\u3092\u7D50\u3076\u76F4\u7DDA"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 15,
    color: color
  }), " \u52B9\u7387\u7684\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2 + CML"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 240
  }, /*#__PURE__*/React.createElement(LineChart, {
    margin: {
      top: 10,
      right: 20,
      left: -10,
      bottom: 10
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    type: "number",
    dataKey: "sig",
    name: "\u30EA\u30B9\u30AF",
    unit: "%",
    tick: {
      fontSize: 9
    },
    domain: [0, 25],
    label: {
      value: "リスク(%)",
      position: "insideBottom",
      offset: -4,
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    type: "number",
    dataKey: "ret",
    name: "\u30EA\u30BF\u30FC\u30F3",
    unit: "%",
    tick: {
      fontSize: 9
    },
    domain: [1, 10],
    label: {
      value: "期待R(%)",
      angle: -90,
      position: "insideLeft",
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`
  }), /*#__PURE__*/React.createElement(Legend, {
    iconSize: 10,
    wrapperStyle: {
      fontSize: 11
    },
    verticalAlign: "top"
  }), /*#__PURE__*/React.createElement(Line, {
    data: efData,
    type: "monotone",
    dataKey: "ret",
    name: "\u52B9\u7387\u7684\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2",
    stroke: color,
    strokeWidth: 2.5,
    dot: false
  }), /*#__PURE__*/React.createElement(Line, {
    data: cmlData,
    type: "linear",
    dataKey: "ret",
    name: "CML\uFF08\u8CC7\u672C\u5E02\u5834\u7DDA\uFF09",
    stroke: COLORS.secondary,
    strokeWidth: 2,
    strokeDasharray: "6 3",
    dot: false
  }), /*#__PURE__*/React.createElement(Line, {
    data: [minVar],
    type: "linear",
    dataKey: "ret",
    name: `最小分散点(σ=${minVar.sig}%)`,
    stroke: COLORS.primary,
    strokeWidth: 0,
    dot: {
      r: 7,
      fill: COLORS.primary
    }
  }), /*#__PURE__*/React.createElement(Line, {
    data: [maxSR],
    type: "linear",
    dataKey: "ret",
    name: `接点PF(SR=${maxSR.sr})`,
    stroke: COLORS.accent,
    strokeWidth: 0,
    dot: {
      r: 7,
      fill: COLORS.accent
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.primary)
  }, "\u25CF \u6700\u5C0F\u5206\u6563: \u03C3=", minVar.sig, "%, R=", minVar.ret, "%"), /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.accent)
  }, "\u25CF \u63A5\u70B9PF: SR=", maxSR.sr, ", R=", maxSR.ret, "%"), /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.secondary)
  }, "--- CML\uFF08Rf=", rf * 100, "%\uFF09"))), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["CMLの傾き = 市場PFのシャープレシオ（最大値）", "接点PFより右のCML上の点 = リスクフリー資産借入+接点PF投資（レバレッジ）", "SML（証券市場線）はCAPMで個別資産のβとリターンを表す別の直線", "効率的フロンティアは凹型（上方に凸）の曲線"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPFB: !s._quizPFB
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（4問）"), state._quizPFB && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PORTFOLIO_QUIZZES.B,
    tabId: "portfolio",
    sectionId: "B",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションC: CAPM ---
function PortfolioSectionC({
  color,
  state,
  setState
}) {
  const [rfSlider, setRfSlider] = useState(2);
  const [rmSlider, setRmSlider] = useState(8);
  const smlData = generateSML(rfSlider / 100, rmSlider / 100);
  const done = state.progress.portfolio?.C;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "CAPM\uFF08\u8CC7\u672C\u8CC7\u7523\u8A55\u4FA1\u30E2\u30C7\u30EB\uFF09",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "E(Ri) = Rf + \u03B2i \xD7 [E(Rm) \u2212 Rf]"), /*#__PURE__*/React.createElement("br", null), "[E(Rm)\u2212Rf]\uFF1A\u30DE\u30FC\u30B1\u30C3\u30C8\u30FB\u30EA\u30B9\u30AF\u30D7\u30EC\u30DF\u30A2\u30E0", /*#__PURE__*/React.createElement("br", null), "\u03B2\uFF1E1\uFF1A\u5E02\u5834\u3088\u308A\u5909\u52D5\u5927\u3000\u03B2=1\uFF1A\u5E02\u5834\u3068\u540C\u3058\u3000\u03B2\uFF1C1\uFF1A\u5909\u52D5\u5C0F\u3000\u03B2=0\uFF1ARf\u3068\u540C\u3058", /*#__PURE__*/React.createElement("br", null), "\u975E\u30B7\u30B9\u30C6\u30DE\u30C6\u30A3\u30C3\u30AF\u30EA\u30B9\u30AF\u306F\u5206\u6563\u6295\u8CC7\u3067\u6D88\u53BB\u3067\u304D\u308B\u305F\u3081\u3001CAPM\u306F\u03B2\u306E\u307F\u3067\u5831\u916C\u3092\u6C7A\u5B9A"), /*#__PURE__*/React.createElement(FormulaCard, _extends({}, FORMULA_DATA.capm, {
    color: color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 15,
    color: color
  }), " SML\uFF08\u8A3C\u5238\u5E02\u5834\u7DDA\uFF09\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, "Rf\uFF08\u30EA\u30B9\u30AF\u30D5\u30EA\u30FC\uFF09: ", rfSlider, "%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 0,
    max: 5,
    step: 0.5,
    value: rfSlider,
    onChange: e => setRfSlider(Number(e.target.value)),
    style: {
      width: "100%",
      accentColor: color
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: STYLES.label
  }, "E(Rm)\uFF08\u5E02\u5834\u30EA\u30BF\u30FC\u30F3\uFF09: ", rmSlider, "%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 4,
    max: 15,
    step: 0.5,
    value: rmSlider,
    onChange: e => setRmSlider(Number(e.target.value)),
    style: {
      width: "100%",
      accentColor: color
    }
  }))), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 200
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: smlData,
    margin: {
      top: 4,
      right: 20,
      left: -10,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "beta",
    tick: {
      fontSize: 9
    },
    label: {
      value: "β（ベータ）",
      position: "insideBottom",
      offset: -4,
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fontSize: 9
    },
    unit: "%",
    label: {
      value: "期待R(%)",
      angle: -90,
      position: "insideLeft",
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`,
    labelFormatter: l => `β=${l}`
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: 0,
    stroke: COLORS.textMuted
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    x: 1,
    stroke: COLORS.primary,
    strokeDasharray: "4 2",
    label: {
      value: "β=1 市場",
      position: "insideTopRight",
      fontSize: 9
    }
  }), /*#__PURE__*/React.createElement(Line, {
    type: "linear",
    dataKey: "er",
    name: "SML",
    stroke: color,
    strokeWidth: 2.5,
    dot: false
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(color)
  }, "Rf=", rfSlider, "%"), /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.primary)
  }, "\u5E02\u5834\u30D7\u30EC\u30DF\u30A2\u30E0=", rmSlider - rfSlider, "%"), /*#__PURE__*/React.createElement("span", {
    style: STYLES.badge(COLORS.secondary)
  }, "\u03B2=1.5 \u2192 E(R)=", (rfSlider + 1.5 * (rmSlider - rfSlider)).toFixed(1), "%"))), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "CAPM\u671F\u5F85\u30EA\u30BF\u30FC\u30F3\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "Rf（無リスク利子率）",
      key: "rf",
      unit: "%",
      defaultValue: "2"
    }, {
      label: "β（ベータ）",
      key: "beta",
      defaultValue: "1.2"
    }, {
      label: "E(Rm)（市場リターン）",
      key: "rm",
      unit: "%",
      defaultValue: "8"
    }],
    calculate: ({
      rf,
      beta,
      rm
    }) => {
      const er = rf + beta * (rm - rf);
      const mrp = rm - rf;
      return {
        results: [{
          label: "期待リターン E(Ri)",
          value: er.toFixed(2),
          unit: "%",
          color
        }, {
          label: "市場プレミアム",
          value: mrp.toFixed(2),
          unit: "%",
          color: COLORS.secondary
        }],
        steps: [`E(Ri) = Rf + β × [E(Rm) − Rf]`, `= ${rf}% + ${beta} × (${rm}% − ${rf}%)`, `= ${rf}% + ${beta} × ${mrp.toFixed(2)}%`, `= ${rf}% + ${(beta * mrp).toFixed(2)}% = ${er.toFixed(2)}%`]
      };
    }
  }), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["β=0：リスクフリーレートと同じ期待リターン（市場リスクなし）", "β<0：市場と逆方向（ゴールドなど）・希少", "非システマティックリスクはβに含まれないため、CAPMは補償しない", "SMLは個別資産（β）、CMLは分散済みPF（σ）の効率性を示す", "αがプラス → CAPMの予測リターンを超えた超過リターン（腕前の証拠）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPFC: !s._quizPFC
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizPFC && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PORTFOLIO_QUIZZES.C,
    tabId: "portfolio",
    sectionId: "C",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションD: パフォーマンス評価指標 ---
function PortfolioSectionD({
  color,
  state,
  setState
}) {
  const done = state.progress.portfolio?.D;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "4\u3064\u306E\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u8A55\u4FA1\u6307\u6A19",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u30B7\u30E3\u30FC\u30D7\u30EC\u30B7\u30AA"), "\uFF1A(Rp\u2212Rf)/\u03C3p\u3000\u5168\u30EA\u30B9\u30AF1\u5358\u4F4D\u3042\u305F\u308A\u306E\u8D85\u904E\u30EA\u30BF\u30FC\u30F3", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30C8\u30EC\u30A4\u30CA\u30FC\u30EC\u30B7\u30AA"), "\uFF1A(Rp\u2212Rf)/\u03B2\u3000\u5E02\u5834\u30EA\u30B9\u30AF1\u5358\u4F4D\u3042\u305F\u308A\u306E\u8D85\u904E\u30EA\u30BF\u30FC\u30F3", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30B8\u30A7\u30F3\u30BB\u30F3\u306E\u03B1"), "\uFF1ARp\u2212[Rf+\u03B2(Rm\u2212Rf)]\u3000CAPM\u3092\u8D85\u3048\u305F\u8D85\u904E\u30EA\u30BF\u30FC\u30F3", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u60C5\u5831\u30EC\u30B7\u30AA(IR)"), "\uFF1A(Rp\u2212Rb)/TE\u3000\u30D9\u30F3\u30C1\u30DE\u30FC\u30AF\u8D85\u904E\u30EA\u30BF\u30FC\u30F3\xF7\u8FFD\u8DE1\u8AA4\u5DEE"), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u6307\u6A19 \u4E00\u62EC\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "ポートフォリオR Rp",
      key: "rp",
      unit: "%",
      defaultValue: "14"
    }, {
      label: "リスクフリーR Rf",
      key: "rf",
      unit: "%",
      defaultValue: "2"
    }, {
      label: "市場リターン Rm",
      key: "rm",
      unit: "%",
      defaultValue: "10"
    }, {
      label: "ベータ β",
      key: "beta",
      defaultValue: "1.3"
    }, {
      label: "標準偏差 σp",
      key: "sigma",
      unit: "%",
      defaultValue: "18"
    }, {
      label: "ベンチマークR Rb",
      key: "rb",
      unit: "%",
      defaultValue: "11"
    }, {
      label: "追跡誤差 TE",
      key: "te",
      unit: "%",
      defaultValue: "4"
    }],
    calculate: ({
      rp,
      rf,
      rm,
      beta,
      sigma,
      rb,
      te
    }) => {
      const sr = (rp - rf) / sigma;
      const tr = (rp - rf) / beta;
      const alpha = rp - (rf + beta * (rm - rf));
      const ir = (rp - rb) / te;
      return {
        results: [{
          label: "シャープレシオ",
          value: sr.toFixed(3),
          unit: "",
          color: COLORS.primary
        }, {
          label: "トレイナーレシオ",
          value: tr.toFixed(3),
          unit: "",
          color
        }, {
          label: "ジェンセンのα",
          value: alpha.toFixed(2),
          unit: "%",
          color: alpha >= 0 ? COLORS.secondary : COLORS.danger
        }, {
          label: "情報レシオ(IR)",
          value: ir.toFixed(3),
          unit: "",
          color: COLORS.accent
        }],
        steps: [`シャープ = (${rp}−${rf}) / ${sigma} = ${sr.toFixed(3)}`, `トレイナー = (${rp}−${rf}) / ${beta} = ${tr.toFixed(3)}`, `CAPM期待R = ${rf}+${beta}×(${rm}−${rf}) = ${(rf + beta * (rm - rf)).toFixed(2)}%`, `ジェンセンα = ${rp} − ${(rf + beta * (rm - rf)).toFixed(2)} = ${alpha.toFixed(2)}%`, `IR = (${rp}−${rb}) / ${te} = ${ir.toFixed(3)}`]
      };
    },
    chartBuilder: vals => {
      const {
        rp,
        rf,
        rm,
        beta,
        sigma,
        rb,
        te
      } = vals;
      const metrics = [{
        name: "シャープ",
        value: parseFloat(((rp - rf) / sigma).toFixed(3))
      }, {
        name: "トレイナー",
        value: parseFloat(((rp - rf) / beta).toFixed(3))
      }, {
        name: "α(%)",
        value: parseFloat((rp - (rf + beta * (rm - rf))).toFixed(2))
      }, {
        name: "IR",
        value: parseFloat(((rp - rb) / te).toFixed(3))
      }];
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u6307\u6A19\u6BD4\u8F03",
        color: color,
        height: 160
      }, /*#__PURE__*/React.createElement(BarChart, {
        data: metrics,
        margin: {
          top: 4,
          right: 8,
          left: -10,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "name",
        tick: {
          fontSize: 11
        }
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 10
        }
      }), /*#__PURE__*/React.createElement(Tooltip, null), /*#__PURE__*/React.createElement(ReferenceLine, {
        y: 0,
        stroke: COLORS.danger
      }), /*#__PURE__*/React.createElement(Bar, {
        dataKey: "value",
        name: "\u5024",
        radius: [4, 4, 0, 0],
        fill: color
      })));
    }
  }), /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30B7\u30E3\u30FC\u30D7 vs \u30C8\u30EC\u30A4\u30CA\u30FC \u2014 \u4F7F\u3044\u5206\u3051",
    color: COLORS.primary
  }, /*#__PURE__*/React.createElement("strong", null, "\u30B7\u30E3\u30FC\u30D7\u30EC\u30B7\u30AA"), "\uFF1A\u5206\u6563\u3055\u308C\u3066\u3044\u306A\u3044PF\u306E\u8A55\u4FA1\u306B\u9069\u5207\uFF08\u03C3=\u5168\u30EA\u30B9\u30AF\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30C8\u30EC\u30A4\u30CA\u30FC\u30EC\u30B7\u30AA"), "\uFF1A\u5B8C\u5168\u306B\u5206\u6563\u6E08\u307FPF\u306E\u8A55\u4FA1\u306B\u9069\u5207\uFF08\u03B2=\u5E02\u5834\u30EA\u30B9\u30AF\u306E\u307F\uFF09", /*#__PURE__*/React.createElement("br", null), "\u2192 \u500B\u5225\u6295\u8CC7\u5BB6\u306EPF\u5168\u4F53\u8A55\u4FA1\u306F\u30B7\u30E3\u30FC\u30D7\u3001\u6295\u8CC7\u4FE1\u8A17\u306A\u3069\u90E8\u5206\u7684\u306B\u4FDD\u6709\u3059\u308B\u5834\u5408\u306F\u30C8\u30EC\u30A4\u30CA\u30FC"), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["ジェンセンのα > 0 → CAPM予測を上回った（運用が優秀）", "情報レシオ > 0.5 → アクティブ運用として優秀", "シャープ: 分母はσ（全リスク）, トレイナー: 分母はβ（市場リスク）", "IR: ベンチマーク超過リターン÷トラッキングエラー"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg, ${COLORS.secondary}, #3DAA60)` : `linear-gradient(135deg, ${color}, ${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPFD: !s._quizPFD
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（8問）"), state._quizPFD && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: [...PORTFOLIO_QUIZZES.C.slice(4), ...PORTFOLIO_QUIZZES.D],
    tabId: "portfolio",
    sectionId: "D",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- ③ポートフォリオ理論タブ本体 ---
const PF_SECTIONS = [{
  id: "A",
  label: "A: 分散効果"
}, {
  id: "B",
  label: "B: 効率的FT"
}, {
  id: "C",
  label: "C: CAPM"
}, {
  id: "D",
  label: "D: 評価指標"
}];
function PortfolioTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = COLORS.highlight;
  const renderSection = () => {
    switch (section) {
      case "A":
        return /*#__PURE__*/React.createElement(PortfolioSectionA, {
          color: color,
          state: state,
          setState: setState
        });
      case "B":
        return /*#__PURE__*/React.createElement(PortfolioSectionB, {
          color: color,
          state: state,
          setState: setState
        });
      case "C":
        return /*#__PURE__*/React.createElement(PortfolioSectionC, {
          color: color,
          state: state,
          setState: setState
        });
      case "D":
        return /*#__PURE__*/React.createElement(PortfolioSectionD, {
          color: color,
          state: state,
          setState: setState
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u7406\u8AD6",
    subtitle: "\u5206\u6563\u6295\u8CC7\u30FB\u52B9\u7387\u7684\u30D5\u30ED\u30F3\u30C6\u30A3\u30A2\u30FBCAPM\u30FB\u8A55\u4FA1\u6307\u6A19",
    color: color,
    icon: TrendingUp
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: PF_SECTIONS,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "portfolio",
    sections: PF_SECTIONS,
    progress: state.progress,
    color: color,
    onSelect: setSection
  }), renderSection());
}

// ============================================================
// フェーズ11: ④金融商品タブ
// ============================================================

// --- セクションA: 株式投資 ---
function ProductsSectionA({
  color,
  state,
  setState
}) {
  const done = state.progress.products?.A;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u682A\u5F0F\u306E\u4E3B\u8981\u8A55\u4FA1\u6307\u6A19",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "PER"), " = \u682A\u4FA1 / EPS\u3000\uFF08\u4F4E\u3044\u307B\u3069\u5272\u5B89\u30FB\u696D\u7A2E\u6BD4\u8F03\u304C\u91CD\u8981\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "PBR"), " = \u682A\u4FA1 / BPS\u3000\uFF081\u500D\u5272\u308C = \u89E3\u6563\u4FA1\u5024\u4EE5\u4E0B\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "ROE"), " = \u7D14\u5229\u76CA / \u81EA\u5DF1\u8CC7\u672C\u3000\uFF08\u30C7\u30E5\u30DD\u30F3: \u7D14\u5229\u76CA\u7387\xD7\u7DCF\u8CC7\u7523\u56DE\u8EE2\u7387\xD7\u8CA1\u52D9\u30EC\u30D0\u30EC\u30C3\u30B8\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "DDM\u5B9A\u7387\u6210\u9577"), "\uFF1AP = D1 / (r \u2212 g)"), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "PER\u30FBPBR\u30FB\u914D\u5F53\u5229\u56DE\u308A\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "株価",
      key: "price",
      unit: "円",
      defaultValue: "2000"
    }, {
      label: "EPS（1株利益）",
      key: "eps",
      unit: "円",
      defaultValue: "150"
    }, {
      label: "BPS（1株純資産）",
      key: "bps",
      unit: "円",
      defaultValue: "1200"
    }, {
      label: "1株配当",
      key: "div",
      unit: "円",
      defaultValue: "40"
    }],
    calculate: ({
      price,
      eps,
      bps,
      div
    }) => {
      const per = eps > 0 ? price / eps : null;
      const pbr = bps > 0 ? price / bps : null;
      const dy = price > 0 ? div / price * 100 : null;
      return {
        results: [{
          label: "PER",
          value: per?.toFixed(1) ?? "−",
          unit: "倍",
          color
        }, {
          label: "PBR",
          value: pbr?.toFixed(2) ?? "−",
          unit: "倍",
          color: COLORS.secondary
        }, {
          label: "配当利回り",
          value: dy?.toFixed(2) ?? "−",
          unit: "%",
          color: COLORS.accent
        }],
        steps: [`PER = ${price} / ${eps} = ${per?.toFixed(1)}倍`, `PBR = ${price} / ${bps} = ${pbr?.toFixed(2)}倍 ${pbr < 1 ? "（解散価値以下）" : ""}`, `配当利回り = ${div} / ${price} × 100 = ${dy?.toFixed(2)}%`]
      };
    }
  }), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "DDM\uFF08\u914D\u5F53\u5272\u5F15\u30E2\u30C7\u30EB\uFF09\u7406\u8AD6\u682A\u4FA1",
    accentColor: COLORS.secondary,
    inputs: [{
      label: "来期配当 D1",
      key: "d1",
      unit: "円",
      defaultValue: "100"
    }, {
      label: "割引率 r",
      key: "r",
      unit: "%",
      defaultValue: "8"
    }, {
      label: "成長率 g",
      key: "g",
      unit: "%",
      defaultValue: "3"
    }],
    calculate: ({
      d1,
      r,
      g
    }) => {
      if (r <= g) return {
        error: "r > g が必要です（割引率 > 成長率）"
      };
      const p = d1 / ((r - g) / 100);
      return {
        results: [{
          label: "理論株価",
          value: p.toFixed(0),
          unit: "円",
          color: COLORS.secondary
        }],
        steps: [`P = D1 / (r − g) = ${d1} / (${r}% − ${g}%)`, `= ${d1} / ${((r - g) / 100).toFixed(2)} = ${p.toFixed(0)}円`, `r−g が小さいほど（成長率が割引率に近いほど）株価は高くなる`]
      };
    },
    chartBuilder: vals => {
      const {
        d1,
        r
      } = vals;
      const data = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(g => ({
        g: `${g}%`,
        price: r > g ? Math.round(d1 / ((r - g) / 100)) : null
      })).filter(d => d.price !== null && d.price < 20000);
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u6210\u9577\u7387 g \u306E\u5909\u5316\u3068\u7406\u8AD6\u682A\u4FA1",
        color: COLORS.secondary,
        height: 160
      }, /*#__PURE__*/React.createElement(BarChart, {
        data: data,
        margin: {
          top: 4,
          right: 8,
          left: -10,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "g",
        tick: {
          fontSize: 10
        }
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 9
        },
        unit: "\u5186"
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => `${v}円`
      }), /*#__PURE__*/React.createElement(Bar, {
        dataKey: "price",
        name: "\u7406\u8AD6\u682A\u4FA1",
        fill: COLORS.secondary,
        radius: [4, 4, 0, 0]
      })));
    }
  }), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["PBR < 1：解散価値以下だが、構造的問題がある場合も", "ROEデュポン分解：純利益率×総資産回転率×財務レバレッジ", "DDM：r > g が必須条件。gがrに近づくほど理論株価は急騰", "グロース株（高PER・高成長期待）vs バリュー株（低PER・割安）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg,${COLORS.secondary},#3DAA60)` : `linear-gradient(135deg,${color},${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPRA: !s._quizPRA
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（6問）"), state._quizPRA && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PRODUCTS_QUIZZES.A,
    tabId: "products",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションB: 債券投資 ---
function ProductsSectionB({
  color,
  state,
  setState
}) {
  const done = state.progress.products?.B;

  // 金利と債券価格の逆相関グラフ
  const bondPriceData = (() => {
    const coupon = 3,
      face = 100,
      n = 10;
    return [1, 2, 3, 4, 5, 6, 7, 8].map(r => {
      const rate = r / 100;
      const pv = coupon * (1 - Math.pow(1 + rate, -n)) / rate + face * Math.pow(1 + rate, -n);
      return {
        rate: `${r}%`,
        price: parseFloat(pv.toFixed(2))
      };
    });
  })();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u50B5\u5238\u306E\u57FA\u672C\u3068\u91D1\u5229\u306E\u9006\u76F8\u95A2",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u50B5\u5238\u4FA1\u683C"), " = \u03A3 \u30AF\u30FC\u30DD\u30F3/(1+r)^t + \u984D\u9762/(1+r)^n", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u91D1\u5229\u2191 \u2192 \u50B5\u5238\u4FA1\u683C\u2193"), "\uFF08\u9006\u76F8\u95A2\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30C7\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3"), "\uFF1A\u30AD\u30E3\u30C3\u30B7\u30E5\u30D5\u30ED\u30FC\u306E\u52A0\u91CD\u5E73\u5747\u6B8B\u5B58\u671F\u9593\uFF08\u2260\u6B8B\u5B58\u671F\u9593\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4FEE\u6B63\u30C7\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3"), "\uFF1A\u0394P/P \u2248 \u2212\u4FEE\u6B63D \xD7 \u0394r"), /*#__PURE__*/React.createElement(ChartCard, {
    title: "\u91D1\u5229\u5909\u5316\u3068\u50B5\u5238\u4FA1\u683C\u306E\u95A2\u4FC2\uFF08\u30AF\u30FC\u30DD\u30F33%\u30FB10\u5E74\u30FB\u984D\u9762100\u5186\uFF09",
    color: color,
    height: 180
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: bondPriceData,
    margin: {
      top: 4,
      right: 20,
      left: -10,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "rate",
    tick: {
      fontSize: 10
    },
    label: {
      value: "市場金利",
      position: "insideBottom",
      offset: -2,
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fontSize: 9
    },
    unit: "\u5186",
    domain: [60, 130]
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}円`
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: 100,
    stroke: COLORS.textMuted,
    strokeDasharray: "3 3",
    label: {
      value: "額面100円",
      position: "insideRight",
      fontSize: 9
    }
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "price",
    name: "\u50B5\u5238\u4FA1\u683C",
    stroke: color,
    strokeWidth: 2.5,
    dot: {
      r: 4,
      fill: color
    }
  }))), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u4FEE\u6B63\u30C7\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3 \u4FA1\u683C\u5909\u52D5\u8A08\u7B97",
    accentColor: color,
    inputs: [{
      label: "修正デュレーション",
      key: "dur",
      unit: "年",
      defaultValue: "7"
    }, {
      label: "金利変化 Δr",
      key: "dr",
      unit: "%",
      defaultValue: "0.5"
    }, {
      label: "債券価格（現在）",
      key: "p0",
      unit: "円",
      defaultValue: "105"
    }],
    calculate: ({
      dur,
      dr,
      p0
    }) => {
      const changeRate = -dur * (dr / 100);
      const newPrice = p0 * (1 + changeRate);
      return {
        results: [{
          label: "価格変化率",
          value: (changeRate * 100).toFixed(3),
          unit: "%",
          color
        }, {
          label: "変化後価格",
          value: newPrice.toFixed(2),
          unit: "円",
          color: COLORS.secondary
        }],
        steps: [`ΔP/P ≈ −修正D × Δr = −${dur} × ${dr / 100} = ${(changeRate * 100).toFixed(3)}%`, `価格変化 = ${p0} × ${(changeRate * 100).toFixed(3)}% = ${(p0 * changeRate).toFixed(2)}円`, `変化後価格 = ${p0} + ${(p0 * changeRate).toFixed(2)} = ${newPrice.toFixed(2)}円`, `デュレーションが長い → 金利変動の影響が大きい`]
      };
    }
  }), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["デュレーション ≠ 残存期間（キャッシュフローの加重平均残存期間）", "クーポン低い・残存期間長い → デュレーション長い → 金利感応度大", "修正デュレーション × 金利変化 = 価格変化率（マイナス符号に注意）", "YTM（最終利回り）はクーポン収入＋償還差益/損を含む年率利回り"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg,${COLORS.secondary},#3DAA60)` : `linear-gradient(135deg,${color},${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPRB: !s._quizPRB
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（4問）"), state._quizPRB && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PRODUCTS_QUIZZES.B,
    tabId: "products",
    sectionId: "B",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションC: 外国証券・為替 ---
function ProductsSectionC({
  color,
  state,
  setState
}) {
  const done = state.progress.products?.C;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u5916\u56FD\u8A3C\u5238\u6295\u8CC7\u3068\u70BA\u66FF\u30EA\u30B9\u30AF",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u5186\u63DB\u7B97\u30EA\u30BF\u30FC\u30F3"), "\uFF1AR\u5186 = (1+R\u5916\u8CA8)(1+R\u70BA\u66FF) \u2212 1 \u2248 R\u5916\u8CA8 + R\u70BA\u66FF", /*#__PURE__*/React.createElement("br", null), "\u5186\u9AD8\uFF08R\u70BA\u66FF < 0\uFF09\u2192 \u5916\u8CA8\u5EFA\u3066\u8CC7\u7523\u306E\u5186\u63DB\u7B97\u30EA\u30BF\u30FC\u30F3\u3092\u62BC\u3057\u4E0B\u3052\u308B", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30AB\u30D0\u30FC\u4ED8\u304DIRP"), "\uFF1AF/S = (1+r\u56FD\u5185)/(1+r\u5916\u56FD)\u3000\u2192 \u30D8\u30C3\u30B8\u30B3\u30B9\u30C8\u2252\u91D1\u5229\u5DEE", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30A2\u30F3\u30AB\u30D0\u30FC\u30C9IRP"), "\uFF1A\u9AD8\u91D1\u5229\u901A\u8CA8\u306F\u5C06\u6765\u7684\u306B\u4E0B\u843D\u3059\u308B\u50BE\u5411"), /*#__PURE__*/React.createElement(CalcComponent, {
    formulaName: "\u5186\u63DB\u7B97\u30EA\u30BF\u30FC\u30F3\u8A08\u7B97\u6A5F",
    accentColor: color,
    inputs: [{
      label: "外貨建てリターン",
      key: "rf",
      unit: "%",
      defaultValue: "8"
    }, {
      label: "為替変動率",
      key: "rex",
      unit: "%",
      defaultValue: "-3"
    }],
    calculate: ({
      rf,
      rex
    }) => {
      const exact = ((1 + rf / 100) * (1 + rex / 100) - 1) * 100;
      const approx = rf + rex;
      return {
        results: [{
          label: "円換算R（正確）",
          value: exact.toFixed(3),
          unit: "%",
          color
        }, {
          label: "近似値",
          value: approx.toFixed(2),
          unit: "%",
          color: COLORS.secondary
        }],
        steps: [`正確：(1 + ${rf / 100})(1 + ${rex / 100}) − 1 = ${exact.toFixed(3)}%`, `近似：${rf}% + (${rex}%) = ${approx.toFixed(2)}%`, `誤差：${(exact - approx).toFixed(3)}%（交差項 R外貨×R為替）`, rex < 0 ? `円高のため外貨建てリターンが目減りしています` : `円安のため外貨建てリターンが上乗せされています`]
      };
    },
    chartBuilder: vals => {
      const {
        rf
      } = vals;
      const data = [-15, -10, -5, 0, 5, 10, 15].map(rex => ({
        rex: `${rex}%`,
        exact: parseFloat(((1 + rf / 100) * (1 + rex / 100) - 1) * 100).toFixed(2)
      }));
      return /*#__PURE__*/React.createElement(ChartCard, {
        title: "\u70BA\u66FF\u5909\u52D5\u3068\u5186\u63DB\u7B97\u30EA\u30BF\u30FC\u30F3",
        color: color,
        height: 150
      }, /*#__PURE__*/React.createElement(BarChart, {
        data: data,
        margin: {
          top: 4,
          right: 8,
          left: -10,
          bottom: 0
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: COLORS.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "rex",
        tick: {
          fontSize: 9
        }
      }), /*#__PURE__*/React.createElement(YAxis, {
        tick: {
          fontSize: 9
        },
        unit: "%"
      }), /*#__PURE__*/React.createElement(Tooltip, {
        formatter: v => `${v}%`
      }), /*#__PURE__*/React.createElement(ReferenceLine, {
        y: 0,
        stroke: COLORS.danger
      }), /*#__PURE__*/React.createElement(Bar, {
        dataKey: "exact",
        name: "\u5186\u63DB\u7B97R",
        radius: [4, 4, 0, 0],
        fill: color
      })));
    }
  }), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["円高（為替マイナス）→ 外貨建て資産の円換算リターン低下", "ヘッジコスト ≒ 国内金利 − 外国金利（カバー付き金利平価）", "高金利通貨は将来下落する傾向（アンカバードIRP）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg,${COLORS.secondary},#3DAA60)` : `linear-gradient(135deg,${color},${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPRC: !s._quizPRC
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（2問）"), state._quizPRC && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PRODUCTS_QUIZZES.C,
    tabId: "products",
    sectionId: "C",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションD: 投資信託 ---
function ProductsSectionD({
  color,
  state,
  setState
}) {
  const done = state.progress.products?.D;
  const costData = [{
    name: "インデックス（低）",
    購入時: 0,
    信託報酬: 0.1,
    留保額: 0
  }, {
    name: "インデックス（中）",
    購入時: 0.5,
    信託報酬: 0.5,
    留保額: 0.1
  }, {
    name: "アクティブ（典型）",
    購入時: 2.0,
    信託報酬: 1.5,
    留保額: 0.3
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u6295\u8CC7\u4FE1\u8A17\u306E\u30B3\u30B9\u30C8\u69CB\u9020",
    color: color
  }, /*#__PURE__*/React.createElement("strong", null, "\u57FA\u6E96\u4FA1\u984D"), " = \u7D14\u8CC7\u7523\u7DCF\u984D / \u53D7\u76CA\u6A29\u7DCF\u53E3\u6570", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u8CFC\u5165\u6642\u624B\u6570\u6599"), "\uFF1A0\u301C3%\u7A0B\u5EA6\uFF08\u30CE\u30FC\u30ED\u30FC\u30C9\u3082\u5897\u52A0\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4FE1\u8A17\u5831\u916C"), "\uFF1A\u5E740.1\u301C2%\u7A0B\u5EA6\uFF08\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u304C\u6709\u5229\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4FE1\u8A17\u8CA1\u7523\u7559\u4FDD\u984D"), "\uFF1A\u89E3\u7D04\u6642\u30B3\u30B9\u30C8\uFF08\u6B8B\u5B58\u6295\u8CC7\u5BB6\u3092\u4FDD\u8B77\uFF09"), /*#__PURE__*/React.createElement(ChartCard, {
    title: "\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9 vs \u30A2\u30AF\u30C6\u30A3\u30D6 \u30B3\u30B9\u30C8\u6BD4\u8F03\uFF08\u5E74\u7387%\uFF09",
    color: color,
    height: 180
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: costData,
    margin: {
      top: 4,
      right: 8,
      left: -10,
      bottom: 40
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "name",
    tick: {
      fontSize: 9
    },
    angle: -12,
    textAnchor: "end"
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fontSize: 9
    },
    unit: "%"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`
  }), /*#__PURE__*/React.createElement(Legend, {
    iconSize: 10,
    wrapperStyle: {
      fontSize: 10
    },
    verticalAlign: "top"
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u8CFC\u5165\u6642",
    stackId: "a",
    fill: COLORS.primary,
    radius: [0, 0, 0, 0]
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u4FE1\u8A17\u5831\u916C",
    stackId: "a",
    fill: color,
    radius: [0, 0, 0, 0]
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u7559\u4FDD\u984D",
    stackId: "a",
    fill: COLORS.accent,
    radius: [4, 4, 0, 0]
  }))), [{
    title: "インデックスファンド",
    color: COLORS.secondary,
    items: ["低コスト（信託報酬0.05〜0.5%）", "市場平均（ベンチマーク）を追跡", "長期的に市場を「超える」ことは目指さない", "効率的市場仮説：市場価格は情報を織り込み済み"]
  }, {
    title: "アクティブファンド",
    color: COLORS.highlight,
    items: ["高コスト（信託報酬1〜2%超）", "市場平均以上のリターンを目指す", "長期では過半数が市場平均に負ける（コスト差が主因）", "運用者の腕前とコストの両方に注目"]
  }, {
    title: "ETF（上場投信）",
    color: COLORS.primary,
    items: ["取引所でリアルタイム売買", "信託報酬が低い傾向（指数連動が多い）", "1日1回基準価額ではなく市場価格で取引", "分配金の取り扱いは商品によって異なる"]
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.title,
    style: {
      ...STYLES.card,
      borderLeft: `4px solid ${item.color}`,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: item.color,
      marginBottom: 6
    }
  }, item.title), item.items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it,
    style: {
      fontSize: 12,
      color: COLORS.text,
      marginBottom: 3,
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: item.color,
      fontWeight: 700
    }
  }, "\u2022"), it)))), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["インデックスファンドは市場平均を「超える」ことは目指さない（頻出ひっかけ）", "長期では過半のアクティブが市場平均以下（コスト差が複利で拡大）", "ETF：1日1回基準価額ではなくリアルタイム市場価格で売買", "信託財産留保額は解約時にかかるコスト（残存投資家保護）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg,${COLORS.secondary},#3DAA60)` : `linear-gradient(135deg,${color},${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPRD: !s._quizPRD
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（2問）"), state._quizPRD && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PRODUCTS_QUIZZES.D,
    tabId: "products",
    sectionId: "D",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションE: オルタナティブ・ESG ---
function ProductsSectionE({
  color,
  state,
  setState
}) {
  const done = state.progress.products?.E;
  const altData = [{
    name: "REIT",
    corr: 0.5,
    ret: 4.0,
    risk: 17.5
  }, {
    name: "ヘッジF",
    corr: 0.3,
    ret: 5.0,
    risk: 12.0
  }, {
    name: "PE",
    corr: 0.4,
    ret: 8.0,
    risk: 20.0
  }, {
    name: "コモディティ",
    corr: 0.1,
    ret: 3.0,
    risk: 18.0
  }, {
    name: "インフラ",
    corr: 0.2,
    ret: 4.5,
    risk: 10.0
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color
    }
  }, /*#__PURE__*/React.createElement(DollarSign, {
    size: 15,
    color: color
  }), " \u30AA\u30EB\u30BF\u30CA\u30C6\u30A3\u30D6\u6295\u8CC7\u306E\u7279\u6027"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      marginBottom: 10
    }
  }, "\u4F1D\u7D71\u7684\u8CC7\u7523\uFF08\u682A\u30FB\u50B5\u5238\uFF09\u3068\u306E\u76F8\u95A2\u4FC2\u6570\uFF08\u4F4E\u3044\u307B\u3069\u5206\u6563\u52B9\u679C\u5927\uFF09"), altData.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      minWidth: 70,
      color: COLORS.text
    }
  }, a.name), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      background: COLORS.border,
      borderRadius: 6,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${a.corr * 100}%`,
      background: a.corr < 0.2 ? COLORS.secondary : a.corr < 0.4 ? COLORS.accent : COLORS.danger,
      borderRadius: 6
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      minWidth: 50
    }
  }, "\u03C1\u2248", a.corr), /*#__PURE__*/React.createElement("span", {
    style: {
      ...STYLES.badge(color),
      fontSize: 10
    }
  }, "R:", a.ret, "%")))), /*#__PURE__*/React.createElement(InfoBox, {
    title: "ESG\u6295\u8CC7 5\u3064\u306E\u30A2\u30D7\u30ED\u30FC\u30C1",
    color: COLORS.secondary
  }, "\u2460", /*#__PURE__*/React.createElement("strong", null, "\u30CD\u30AC\u30C6\u30A3\u30D6\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0"), "\uFF1A\u554F\u984C\u4F01\u696D\u3092\u9664\u5916\uFF08\u30BF\u30D0\u30B3\u30FB\u6B66\u5668\u7B49\uFF09", /*#__PURE__*/React.createElement("br", null), "\u2461", /*#__PURE__*/React.createElement("strong", null, "\u30DD\u30B8\u30C6\u30A3\u30D6\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0"), "\uFF1AESG\u512A\u826F\u4F01\u696D\u3092\u7A4D\u6975\u9078\u629E", /*#__PURE__*/React.createElement("br", null), "\u2462", /*#__PURE__*/React.createElement("strong", null, "ESG\u30A4\u30F3\u30C6\u30B0\u30EC\u30FC\u30B7\u30E7\u30F3"), "\uFF1A\u8CA1\u52D9\u5206\u6790\u306B\u975E\u8CA1\u52D9\u60C5\u5831\u3092\u7D71\u5408", /*#__PURE__*/React.createElement("br", null), "\u2463", /*#__PURE__*/React.createElement("strong", null, "\u30A8\u30F3\u30B2\u30FC\u30B8\u30E1\u30F3\u30C8"), "\uFF1A\u4F01\u696D\u3068\u306E\u5BFE\u8A71\u3067\u6539\u5584\u3092\u4FC3\u9032", /*#__PURE__*/React.createElement("br", null), "\u2464", /*#__PURE__*/React.createElement("strong", null, "\u30A4\u30F3\u30D1\u30AF\u30C8\u6295\u8CC7"), "\uFF1A\u8CA1\u52D9\u30EA\u30BF\u30FC\u30F3\uFF0B\u793E\u4F1A\u7684\u6210\u679C\u3092\u540C\u6642\u8FFD\u6C42"), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["オルタナティブ：伝統資産との低相関 → 分散効果。流動性リスクが課題", "REIT：収益の90%超分配で法人課税実質免除・東証上場で売買容易", "ポジティブスクリーニング（優良選択）≠ ネガティブスクリーニング（問題除外）", "インパクト投資：リターン＋社会的インパクトの両立（ESGの最上位概念）"]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...(done ? STYLES.btnSecondary : STYLES.btnPrimary),
      width: "100%",
      marginBottom: 12,
      background: done ? `linear-gradient(135deg,${COLORS.secondary},#3DAA60)` : `linear-gradient(135deg,${color},${color}BB)`
    },
    onClick: () => setState(s => ({
      ...s,
      _quizPRE: !s._quizPRE
    }))
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      marginRight: 5
    }
  }), "\u5B8C\u4E86\u6E08\u307F \u2014 \u518D\u6311\u6226\u3059\u308B") : "理解度テストを受ける（2問）"), state._quizPRE && /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: PRODUCTS_QUIZZES.E,
    tabId: "products",
    sectionId: "E",
    accentColor: color,
    state: state,
    setState: setState
  }));
}

// --- セクションF: デリバティブ取引（補論2）---
function ProductsSectionF({
  color,
  state,
  setState
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const done = state.chapProgress?.supp2?.A ?? false;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u30C7\u30EA\u30D0\u30C6\u30A3\u30D6\u53D6\u5F15\u3068\u306F",
    color: color
  }, "\u682A\u5F0F\u30FB\u50B5\u5238\u30FB\u70BA\u66FF\u306A\u3069\u306E\u539F\u8CC7\u7523\u304B\u3089\u300C\u6D3E\u751F\u300D\u3057\u305F\u91D1\u878D\u5546\u54C1\u306E\u7DCF\u79F0\u3002 \u30D8\u30C3\u30B8\uFF08\u30EA\u30B9\u30AF\u56DE\u907F\uFF09\u30FB\u6295\u6A5F\u30FB\u88C1\u5B9A\u53D6\u5F15\u306B\u6D3B\u7528\u3055\u308C\u308B\u3002ABC\u8A66\u9A13\u306E\u88DC\u8AD62\u3067\u51FA\u984C\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4E3B\u89813\u7A2E\u985E\uFF1A"), "\u5148\u7269\u53D6\u5F15\uFF08\u7FA9\u52D9\uFF09\uFF0F\u30AA\u30D7\u30B7\u30E7\u30F3\u53D6\u5F15\uFF08\u6A29\u5229\uFF09\uFF0F\u30B9\u30EF\u30C3\u30D7\u53D6\u5F15\uFF08\u4EA4\u63DB\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 13,
      color,
      marginBottom: 10
    }
  }, "\u30C7\u30EA\u30D0\u30C6\u30A3\u30D63\u7A2E\u6BD4\u8F03"), [{
    name: "先物取引",
    key: "futures",
    desc: "将来の特定日に合意価格で売買する義務。売り手・買い手ともに義務が生じる。"
  }, {
    name: "オプション取引",
    key: "option",
    desc: "原資産を買う権利（コール）または売る権利（プット）。権利行使は任意。"
  }, {
    name: "スワップ取引",
    key: "swap",
    desc: "2者間でキャッシュフローを交換。金利スワップ（固定⇄変動）が代表的。"
  }, {
    name: "為替予約",
    key: "fwdfx",
    desc: "将来の特定日に特定レートで外貨と円を交換する契約（店頭先物）。"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.key,
    style: {
      padding: "9px 0",
      borderBottom: `1px solid ${COLORS.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 12,
      color: COLORS.text,
      marginBottom: 3
    }
  }, item.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      lineHeight: 1.5
    }
  }, item.desc)))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12,
      background: "#fff3f3",
      border: `1.5px solid ${color}40`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 13,
      color,
      marginBottom: 8
    }
  }, "\u30B3\u30FC\u30EB vs \u30D7\u30C3\u30C8\u306E\u30DD\u30B8\u30B7\u30E7\u30F3\u6574\u7406"), [{
    pos: "コール買い",
    up: "↑ 利益",
    down: "↓ プレミアム損失のみ",
    note: "原資産上昇時に有利"
  }, {
    pos: "プット買い",
    up: "↓ プレミアム損失のみ",
    down: "↑ 利益",
    note: "原資産下落時に有利"
  }, {
    pos: "コール売り",
    up: "↓ 理論上無限の損失",
    down: "↑ プレミアム収入",
    note: "裸売りは最高リスク"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.pos,
    style: {
      display: "flex",
      gap: 8,
      padding: "5px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      minWidth: 70
    }
  }, item.pos), /*#__PURE__*/React.createElement("span", null, "\u539F\u8CC7\u7523\u2191:", item.up, " / \u2193:", item.down)))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      textAlign: "center",
      background: COLORS.secondary + "12",
      border: `2px solid ${COLORS.secondary}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      marginBottom: 4
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: COLORS.secondary
    }
  }, "\u30BB\u30AF\u30B7\u30E7\u30F3F \u5B8C\u4E86\uFF01")) : showQuiz ? /*#__PURE__*/React.createElement(QuizComponent, {
    quizzes: SUPP2_QUIZZES,
    tabId: "supp2",
    sectionId: "A",
    accentColor: color,
    state: state,
    setState: setState,
    progressField: "chapProgress"
  }) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowQuiz(true),
    style: {
      ...STYLES.btnPrimary,
      width: "100%",
      background: `linear-gradient(135deg, ${color}, #E8922A)`
    }
  }, "\u30C7\u30EA\u30D0\u30C6\u30A3\u30D6 \u78BA\u8A8D\u30C6\u30B9\u30C8\uFF0810\u554F\uFF09\u3092\u958B\u59CB"));
}

// --- ④金融商品タブ本体 ---
const PRODUCTS_SECTIONS = [{
  id: "A",
  label: "A: 株式"
}, {
  id: "B",
  label: "B: 債券"
}, {
  id: "C",
  label: "C: 外国証券"
}, {
  id: "D",
  label: "D: 投資信託"
}, {
  id: "E",
  label: "E: オルタナ"
}, {
  id: "F",
  label: "F: デリバティブ"
}];
function ProductsTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = "#E67E22";

  // F セクションは chapProgress で追跡
  const combinedProgress = {
    ...state.progress,
    products: {
      ...state.progress.products,
      F: state.chapProgress?.supp2?.A ?? false
    }
  };
  const renderSection = () => {
    switch (section) {
      case "A":
        return /*#__PURE__*/React.createElement(ProductsSectionA, {
          color: color,
          state: state,
          setState: setState
        });
      case "B":
        return /*#__PURE__*/React.createElement(ProductsSectionB, {
          color: color,
          state: state,
          setState: setState
        });
      case "C":
        return /*#__PURE__*/React.createElement(ProductsSectionC, {
          color: color,
          state: state,
          setState: setState
        });
      case "D":
        return /*#__PURE__*/React.createElement(ProductsSectionD, {
          color: color,
          state: state,
          setState: setState
        });
      case "E":
        return /*#__PURE__*/React.createElement(ProductsSectionE, {
          color: color,
          state: state,
          setState: setState
        });
      case "F":
        return /*#__PURE__*/React.createElement(ProductsSectionF, {
          color: color,
          state: state,
          setState: setState
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u91D1\u878D\u5546\u54C1",
    subtitle: "\u682A\u5F0F\u30FB\u50B5\u5238\u30FB\u5916\u56FD\u8A3C\u5238\u30FB\u6295\u8CC7\u4FE1\u8A17\u30FB\u30AA\u30EB\u30BF\u30CA\u30FB\u30C7\u30EA\u30D0\u30C6\u30A3\u30D6",
    color: color,
    icon: DollarSign
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: PRODUCTS_SECTIONS,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "products",
    sections: PRODUCTS_SECTIONS,
    progress: combinedProgress,
    color: color,
    onSelect: setSection
  }), renderSection());
}

// ============================================================
// フェーズ12: ⑤ケーススタディタブ
// ============================================================

// --- ケース問題コンポーネント ---
function CaseQuizBlock({
  cs,
  state,
  setState
}) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = cs.questions[qIdx];
  const total = cs.questions.length;
  const handleSelect = i => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answer) setScore(s => s + 1);
  };
  const handleNext = () => {
    if (qIdx + 1 >= total) {
      setDone(true);
      setState(s => ({
        ...s,
        progress: {
          ...s.progress,
          casestudy: {
            ...s.progress.casestudy,
            [cs.id === "case01" ? "A" : "B"]: score + (selected === q.answer ? 1 : 0) >= Math.ceil(total * 0.6)
          }
        },
        testHistory: [...s.testHistory, ...cs.questions.map((cq, i) => ({
          date: new Date().toISOString(),
          tab: "casestudy",
          section: cs.id,
          question: `${cs.id}-q${i}`,
          correct: i === qIdx ? selected === q.answer : false,
          keyword: cq.choices[cq.answer].slice(0, 12),
          isCalc: false
        }))]
      }));
      return;
    }
    setQIdx(i => i + 1);
    setSelected(null);
    setAnswered(false);
  };
  const handleRetry = () => {
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
  };
  if (done) {
    const pct = Math.round(score / total * 100);
    const passed = pct >= 60;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        textAlign: "center",
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 36,
        marginBottom: 6
      }
    }, passed ? "🎉" : "📚"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 900,
        color: passed ? COLORS.secondary : COLORS.accent
      }
    }, score, "/", total, " \u6B63\u89E3 \u2014 ", pct, "\u70B9"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.badge(passed ? COLORS.secondary : COLORS.accent),
        fontSize: 13,
        margin: "8px auto"
      }
    }, passed ? "ケースクリア！" : "再挑戦してみましょう"), /*#__PURE__*/React.createElement("button", {
      style: {
        ...STYLES.btnOutline,
        marginTop: 10
      },
      onClick: handleRetry
    }, "\u3082\u3046\u4E00\u5EA6"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      color: COLORS.textLight,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: cs.color
    }
  }, "\u554F ", qIdx + 1, " / ", total), /*#__PURE__*/React.createElement("span", null, "\u6B63\u89E3 ", score, "\u554F")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: COLORS.border,
      borderRadius: 4,
      marginBottom: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${qIdx / total * 100}%`,
      background: cs.color,
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: COLORS.text,
      lineHeight: 1.8,
      marginBottom: 12,
      padding: "10px 12px",
      background: cs.color + "0A",
      borderRadius: 10,
      border: `1px solid ${cs.color}22`
    }
  }, q.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, q.choices.map((choice, i) => {
    let bg = "#fff",
      border = `1.5px solid ${COLORS.border}`,
      col = COLORS.text;
    if (answered) {
      if (i === q.answer) {
        bg = COLORS.secondary + "18";
        border = `2px solid ${COLORS.secondary}`;
        col = COLORS.secondary;
      } else if (i === selected) {
        bg = COLORS.danger + "12";
        border = `2px solid ${COLORS.danger}`;
        col = COLORS.danger;
      }
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => handleSelect(i),
      style: {
        background: bg,
        border,
        borderRadius: 12,
        padding: "10px 14px",
        textAlign: "left",
        cursor: answered ? "default" : "pointer",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontFamily: "'Noto Sans JP', sans-serif"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 22,
        height: 22,
        borderRadius: "50%",
        background: answered && i === q.answer ? COLORS.secondary : answered && i === selected ? COLORS.danger : cs.color + "33",
        color: answered && (i === q.answer || i === selected) ? "#fff" : cs.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        flexShrink: 0
      }
    }, answered && i === q.answer ? "○" : answered && i === selected ? "✗" : ["①", "②", "③", "④"][i]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: col,
        lineHeight: 1.6
      }
    }, choice));
  })), answered && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "10px 12px",
      background: (selected === q.answer ? COLORS.secondary : COLORS.danger) + "10",
      border: `1px solid ${selected === q.answer ? COLORS.secondary : COLORS.danger}33`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: selected === q.answer ? COLORS.secondary : COLORS.danger,
      marginBottom: 4
    }
  }, selected === q.answer ? "✓ 正解！" : "✗ 不正解"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.7
    }
  }, q.explanation)), answered && /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnPrimary,
      width: "100%",
      marginTop: 10,
      background: `linear-gradient(135deg,${cs.color},${cs.color}BB)`
    },
    onClick: handleNext
  }, qIdx + 1 >= total ? "結果を見る" : "次の問題", " ", /*#__PURE__*/React.createElement(ChevronRight, {
    size: 14,
    style: {
      marginLeft: 4
    }
  })));
}

// --- 資産配分シミュレーター（ケーススタディ内） ---
function CaseSimulator() {
  const profiles = [{
    id: "young",
    label: "30代・積立中心",
    weights: {
      "国内株式": 35,
      "外国株式": 30,
      "国内債券": 15,
      "外国債券": 10,
      "国内REIT": 10
    }
  }, {
    id: "mid",
    label: "50代・バランス重視",
    weights: {
      "国内株式": 25,
      "外国株式": 20,
      "国内債券": 30,
      "外国債券": 15,
      "国内REIT": 10
    }
  }, {
    id: "retire",
    label: "60代・守り重視",
    weights: {
      "国内株式": 15,
      "外国株式": 10,
      "国内債券": 45,
      "外国債券": 20,
      "国内REIT": 10
    }
  }];
  const [selected, setSelected] = useState("young");
  const [weights, setWeights] = useState(profiles[0].weights);
  const applyProfile = id => {
    setSelected(id);
    setWeights({
      ...profiles.find(p => p.id === id).weights
    });
  };
  const totalW = Object.values(weights).reduce((s, v) => s + v, 0);
  const pfRet = ASSET_CLASS_DATA.reduce((s, a) => s + weights[a.name] / 100 * a.expectedReturn, 0);
  const pfRisk = Math.sqrt(ASSET_CLASS_DATA.reduce((s, a) => s + (weights[a.name] / 100) ** 2 * a.risk ** 2, 0));
  const pfSR = pfRisk > 0 ? (pfRet - 0.002) / pfRisk : 0;

  // 時系列シミュレーション（100万円・30年）
  const simData = Array.from({
    length: 31
  }, (_, yr) => ({
    year: yr,
    "期待値": Math.round(100 * Math.pow(1 + pfRet, yr)),
    "楽観（+1σ）": Math.round(100 * Math.pow(1 + pfRet + pfRisk, yr)),
    "悲観（−1σ）": Math.round(100 * Math.pow(1 + Math.max(pfRet - pfRisk, -0.3), yr))
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.sectionTitle,
      fontSize: 14,
      color: "#16A085"
    }
  }, /*#__PURE__*/React.createElement(Activity, {
    size: 15,
    color: "#16A085"
  }), " \u8CC7\u7523\u914D\u5206\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 12,
      flexWrap: "wrap"
    }
  }, profiles.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => applyProfile(p.id),
    style: {
      flex: 1,
      minWidth: 90,
      background: selected === p.id ? "#16A085" : "transparent",
      color: selected === p.id ? "#fff" : COLORS.textLight,
      border: `1.5px solid ${selected === p.id ? "#16A085" : COLORS.border}`,
      borderRadius: 10,
      padding: "7px 4px",
      cursor: "pointer",
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "'Noto Sans JP',sans-serif",
      transition: "all 0.15s ease"
    }
  }, p.label))), ASSET_CLASS_DATA.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: a.color
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800
    }
  }, weights[a.name], "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 0,
    max: 80,
    step: 5,
    value: weights[a.name],
    onChange: e => {
      setSelected("");
      setWeights(w => ({
        ...w,
        [a.name]: Number(e.target.value)
      }));
    },
    style: {
      width: "100%",
      accentColor: a.color
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: totalW === 100 ? COLORS.secondary : COLORS.danger,
      fontWeight: 700,
      textAlign: "center",
      marginBottom: 10
    }
  }, "\u5408\u8A08: ", totalW, "% ", totalW !== 100 && "← 100%に調整してください"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      flex: 1,
      textAlign: "center",
      padding: "10px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES.label
  }, "\u671F\u5F85\u30EA\u30BF\u30FC\u30F3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: COLORS.secondary
    }
  }, (pfRet * 100).toFixed(2), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      flex: 1,
      textAlign: "center",
      padding: "10px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES.label
  }, "\u30EA\u30B9\u30AF"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: COLORS.danger
    }
  }, (pfRisk * 100).toFixed(2), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      flex: 1,
      textAlign: "center",
      padding: "10px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: STYLES.label
  }, "\u30B7\u30E3\u30FC\u30D7"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: "#16A085"
    }
  }, pfSR.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#16A085",
      marginBottom: 6
    }
  }, "100\u4E07\u5186 \u6295\u8CC7\u3057\u305F\u5834\u5408\u306E30\u5E74\u9593\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 180
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: simData,
    margin: {
      top: 4,
      right: 8,
      left: -10,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "year",
    tick: {
      fontSize: 9
    },
    unit: "\u5E74"
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fontSize: 9
    },
    unit: "\u4E07"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}万円`,
    labelFormatter: l => `${l}年後`
  }), /*#__PURE__*/React.createElement(Legend, {
    iconSize: 10,
    wrapperStyle: {
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "\u697D\u89B3\uFF08+1\u03C3\uFF09",
    stroke: COLORS.secondary,
    fill: COLORS.secondary + "18",
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "\u671F\u5F85\u5024",
    stroke: "#16A085",
    fill: "#16A085" + "25",
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "\u60B2\u89B3\uFF08\u22121\u03C3\uFF09",
    stroke: COLORS.danger,
    fill: COLORS.danger + "10",
    strokeWidth: 1.5
  }))));
}

// --- ⑤ケーススタディタブ本体 ---
const CASE_STUDY_SECTIONS = [{
  id: "A",
  label: "30代夫婦"
}, {
  id: "B",
  label: "60代退職者"
}, {
  id: "C",
  label: "シミュレーター"
}];
function CaseStudyTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = "#16A085";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u30B1\u30FC\u30B9\u30B9\u30BF\u30C7\u30A3",
    subtitle: "\u5B9F\u8DF5\u7684\u306A\u9867\u5BA2\u5BFE\u5FDC\u30FB\u8CC7\u7523\u914D\u5206\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
    color: color,
    icon: Activity
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: CASE_STUDY_SECTIONS,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "casestudy",
    sections: CASE_STUDY_SECTIONS,
    progress: state.progress,
    color: color,
    onSelect: setSection
  }), (section === "A" || section === "B") && (() => {
    const cs = CASE_STUDIES[section === "A" ? 0 : 1];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.cardLg,
        borderLeft: `4px solid ${cs.color}`,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: cs.color,
        marginBottom: 8
      }
    }, "\uD83D\uDCCB ", cs.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 1.8,
        marginBottom: 10
      }
    }, cs.scenario), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, cs.tags.map(tag => /*#__PURE__*/React.createElement("span", {
      key: tag,
      style: STYLES.badge(cs.color)
    }, tag)))), section === "A" && /*#__PURE__*/React.createElement(InfoBox, {
      title: "\u89E3\u7B54\u306E\u30DD\u30A4\u30F3\u30C8",
      color: cs.color
    }, /*#__PURE__*/React.createElement("strong", null, "\u30EA\u30B9\u30AF\u8A31\u5BB9\u5EA6"), "\uFF1A30\u4EE3\u30FB\u9577\u671F\u6295\u8CC7\u53EF\u30FB\u5B89\u5B9A\u53CE\u5165 \u2192 \u3084\u3084\u9AD8\u3081\u8A2D\u5B9A\u53EF", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "NISA\u6D3B\u7528"), "\uFF1A\u65B0NISA\u3067\u6D41\u52D5\u6027\u78BA\u4FDD\uFF08\u6559\u80B2\u8CBB\u306B\u3082\u5BFE\u5FDC\uFF09", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "iDeCo\u6D3B\u7528"), "\uFF1A\u6240\u5F97\u63A7\u9664\u3067\u7BC0\u7A0E\u3057\u306A\u304C\u3089\u8001\u5F8C\u8CC7\u91D1\u3092\u7A4D\u7ACB", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4F4F\u5B85\u30ED\u30FC\u30F3"), "\uFF1A\u91D1\u5229\u304C\u4F4E\u3044\u5834\u5408\u3001\u7E70\u4E0A\u8FD4\u6E08\u3088\u308A\u6295\u8CC7\u3092\u512A\u5148\u3059\u308B\u9078\u629E\u80A2\u3082", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u6559\u80B2\u8CBB"), "\uFF1A18\u5E74\u5F8C\u304B\u3089\u5FC5\u8981 \u2192 \u682A\u5F0F\u6BD4\u7387\u9AD8\u3081\u3067\u9577\u671F\u904B\u7528\u53EF"), section === "B" && /*#__PURE__*/React.createElement(InfoBox, {
      title: "\u89E3\u7B54\u306E\u30DD\u30A4\u30F3\u30C8",
      color: cs.color
    }, /*#__PURE__*/React.createElement("strong", null, "\u53D6\u308A\u5D29\u3057\u30D5\u30A7\u30FC\u30BA"), "\uFF1A\u5E74\u91D1\u958B\u59CB\u307E\u30672\u301C3\u5E74\u5206\u306E\u751F\u6D3B\u8CBB\u3092\u6D41\u52D5\u8CC7\u7523\u3067\u78BA\u4FDD", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u4E0D\u8DB3\u984D"), "\uFF1A\u670810\u4E07\u5186\uFF0830\u4E07\u221220\u4E07\uFF09\xD7 12\u30F6\u6708 = \u5E74120\u4E07\u5186\u4E0D\u8DB3", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u9577\u5BFF\u30EA\u30B9\u30AF"), "\uFF1A90\u6B73\u307E\u306728\u5E74\u9593\u3001\u30A4\u30F3\u30D5\u30EC\u8003\u616E\u306A\u3057\u30673,360\u4E07\u5186\u5FC5\u8981", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u30A4\u30F3\u30D5\u30EC\u5BFE\u7B56"), "\uFF1A\u682A\u5F0F\u30FBREIT\u30FB\u7269\u4FA1\u9023\u52D5\u50B5\u3092\u4E00\u90E8\u7D44\u307F\u5165\u308C\u308B", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u5B9A\u7387\u53D6\u308A\u5D29\u3057"), "\uFF1A\u5B9A\u7387\uFF08\u8CC7\u7523\u306E\u4F55%\uFF09\u53D6\u308A\u5D29\u3057\u306F\u9577\u5BFF\u30EA\u30B9\u30AF\u306B\u5F37\u3044"), /*#__PURE__*/React.createElement(CaseQuizBlock, {
      cs: cs,
      state: state,
      setState: setState
    }));
  })(), section === "C" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\u8CC7\u7523\u914D\u5206\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC\u306E\u4F7F\u3044\u65B9",
    color: color
  }, "\u5E74\u4EE3\u5225\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E\u3059\u308B\u304B\u3001\u30B9\u30E9\u30A4\u30C0\u30FC\u3067\u81EA\u7531\u306B\u8CC7\u7523\u914D\u5206\u3092\u8A2D\u5B9A\u3002", /*#__PURE__*/React.createElement("br", null), "\u671F\u5F85\u30EA\u30BF\u30FC\u30F3\u30FB\u30EA\u30B9\u30AF\u30FB\u30B7\u30E3\u30FC\u30D7\u30EC\u30B7\u30AA\u3092\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u3067\u78BA\u8A8D\u3057\u3001", /*#__PURE__*/React.createElement("br", null), "30\u5E74\u9593\u306E\u8CC7\u7523\u6210\u9577\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u30B0\u30E9\u30D5\u3067\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002"), /*#__PURE__*/React.createElement(CaseSimulator, null), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["退職後は「取り崩しフェーズ」：流動性確保 + 中リスク分散が基本", "定率取り崩し（毎年資産の4%等）は長寿リスクに対応しやすい", "ライフサイクル投資：年齢とともにリスク資産比率を下げる", "インフレリスク：現金・固定利率資産の実質価値低下に注意", "4%ルール：年間生活費の25倍の資産があれば30年取り崩し可（米国研究）"]
  })));
}

// ============================================================
// フェーズ13: ⑥苦手分析タブ
// ============================================================

const MOCK_ADVICE_DATA = {
  capm: "CAPMの計算が苦手なようです。まずβの概念を押さえましょう。β=1は市場と同じ動き。公式はE(Ri)=Rf+β×(Rm-Rf)。Rfとβ、Rmを正確に区別することがコツです。",
  sharpe: "シャープレシオはリスク1単位あたりの超過リターン。(Rp-Rf)/σp で計算します。比較するときは同じリスク水準で考えましょう。",
  pv: "現在価値は「将来のお金を今の価値に換算」。PV=FV/(1+r)^n。割引率rが高いほど現在価値は小さくなります。",
  pf_risk: "ポートフォリオリスクの計算では相関係数の扱いが鍵です。ρ=-1で完全に相殺される原理から考えると覚えやすいです。",
  ddm: "DDMは株価=来期配当/(期待収益率-成長率)。分母の(r-g)がゼロや負になると成立しないことに注意。",
  duration: "デュレーションは「金利感応度」と覚えましょう。修正デュレーション×金利変化率≈価格変化率（マイナス符号あり）。",
  weak_ethics: "倫理・顧客本位分野が苦手なようです。フィデューシャリーデューティーの7原則を繰り返し読み、ケーススタディで実際の適用場面を想定して理解を深めましょう。",
  weak_calc: "計算問題の正答率が低いようです。まず各公式の変数の意味を確認しましょう。次に数値を変えながら電卓で繰り返し練習することをお勧めします。",
  default: "間違いが多い分野を電卓練習と理解テストで集中的に対策しましょう。試験まで40問・60%合格を目標に計画的に学習を進めてください。"
};
const CALC_PRACTICE_ITEMS = [{
  key: "capm",
  label: "CAPM期待リターン",
  formula: "E(Ri) = Rf + β × (Rm − Rf)",
  question: v => `リスクフリーレート${v.rf}%、β=${v.beta}、市場リターン${v.rm}%のとき期待リターンは？`,
  generate: () => {
    const rf = +(Math.random() * 3 + 1).toFixed(1);
    const rm = +(Math.random() * 5 + 6).toFixed(1);
    const beta = +(Math.random() * 1.5 + 0.5).toFixed(1);
    const ans = +(rf + beta * (rm - rf)).toFixed(2);
    return {
      inputs: {
        rf,
        rm,
        beta
      },
      answer: ans,
      unit: "%"
    };
  }
}, {
  key: "sharpe",
  label: "シャープレシオ",
  formula: "SR = (Rp − Rf) / σp",
  question: v => `ポートフォリオリターン${v.rp}%、無リスク利子率${v.rf}%、標準偏差${v.sigma}%のときシャープレシオは？`,
  generate: () => {
    const rf = +(Math.random() * 2 + 1).toFixed(1);
    const rp = +(Math.random() * 8 + 4).toFixed(1);
    const sigma = +(Math.random() * 10 + 5).toFixed(1);
    const ans = +((rp - rf) / sigma).toFixed(2);
    return {
      inputs: {
        rp,
        rf,
        sigma
      },
      answer: ans,
      unit: ""
    };
  }
}, {
  key: "pv",
  label: "現在価値（PV）",
  formula: "PV = FV / (1 + r)ⁿ",
  question: v => `${v.n}年後に${v.fv}万円を受け取る。割引率${v.r}%のとき現在価値は？`,
  generate: () => {
    const fv = [100, 200, 300, 500][Math.floor(Math.random() * 4)];
    const r = +(Math.random() * 4 + 2).toFixed(1);
    const n = Math.floor(Math.random() * 8 + 3);
    const ans = +(fv / Math.pow(1 + r / 100, n)).toFixed(1);
    return {
      inputs: {
        fv,
        r,
        n
      },
      answer: ans,
      unit: "万円"
    };
  }
}, {
  key: "pf_risk",
  label: "2資産PFリスク",
  formula: "σp = √(w₁²σ₁² + 2ρw₁w₂σ₁σ₂ + w₂²σ₂²)",
  question: v => `資産A比率${v.w1 * 100}%（σ=${v.s1}%）、資産B比率${(1 - v.w1) * 100}%（σ=${v.s2}%）、相関係数${v.rho}のときPFリスクは？`,
  generate: () => {
    const w1 = [0.4, 0.5, 0.6][Math.floor(Math.random() * 3)];
    const w2 = 1 - w1;
    const s1 = Math.floor(Math.random() * 6 + 8);
    const s2 = Math.floor(Math.random() * 6 + 8);
    const rho = [0, 0.3, 0.5, -0.3][Math.floor(Math.random() * 4)];
    const ans = +Math.sqrt(w1 ** 2 * s1 ** 2 + 2 * rho * w1 * w2 * s1 * s2 + w2 ** 2 * s2 ** 2).toFixed(1);
    return {
      inputs: {
        w1,
        s1,
        s2,
        rho
      },
      answer: ans,
      unit: "%"
    };
  }
}, {
  key: "ddm",
  label: "DDM（配当割引モデル）",
  formula: "P = D₁ / (r − g)",
  question: v => `来期配当${v.d}円、期待収益率${v.r}%、配当成長率${v.g}%のとき理論株価は？`,
  generate: () => {
    const d = [50, 60, 80, 100][Math.floor(Math.random() * 4)];
    const g = +(Math.random() * 3 + 1).toFixed(1);
    const r = +(g + Math.random() * 5 + 3).toFixed(1);
    const ans = +(d / ((r - g) / 100)).toFixed(0);
    return {
      inputs: {
        d,
        r,
        g
      },
      answer: ans,
      unit: "円"
    };
  }
}, {
  key: "duration",
  label: "修正デュレーション価格変化",
  formula: "ΔP/P ≈ −ModD × Δy",
  question: v => `修正デュレーション${v.d}年の債券。金利が${v.dy}%上昇したとき価格変化率は？`,
  generate: () => {
    const d = +(Math.random() * 5 + 3).toFixed(1);
    const dy = [0.5, 1.0, 1.5, 2.0][Math.floor(Math.random() * 4)];
    const ans = +(-d * dy).toFixed(2);
    return {
      inputs: {
        d,
        dy
      },
      answer: ans,
      unit: "%"
    };
  }
}];
function generateForgettingCurve() {
  const data = [];
  for (let t = 0; t <= 30; t++) {
    const raw = Math.round(100 * Math.exp(-t / 7));
    const rev = t <= 1 ? raw : Math.min(100, Math.round(100 * Math.exp(-(t - 1) / 14)));
    data.push({
      day: `${t}日`,
      復習なし: Math.max(raw, 0),
      復習あり: Math.max(rev, 0)
    });
  }
  return data;
}
const FORGETTING_CURVE_DATA = generateForgettingCurve();

// --- AnalysisSectionA: 正答率分析 ---
function AnalysisSectionA({
  state
}) {
  const {
    testHistory
  } = state;

  // 章をまとめたグループでレーダー表示（7分野）
  const RADAR_GROUPS = [{
    key: "g_ethics",
    label: "倫理・顧客本位",
    tabs: ["ch1", "ch2", "ethics"]
  }, {
    key: "g_basics",
    label: "資産運用基礎",
    tabs: ["basics"]
  }, {
    key: "g_fs",
    label: "財務諸表",
    tabs: ["ch6"]
  }, {
    key: "g_pf",
    label: "PF・CAPM",
    tabs: ["portfolio"]
  }, {
    key: "g_prod",
    label: "金融商品",
    tabs: ["products"]
  }, {
    key: "g_deriv",
    label: "デリバティブ",
    tabs: ["supp2"]
  }, {
    key: "g_calc",
    label: "計算問題",
    tabs: ["__calc__"]
  }];
  const radarData = RADAR_GROUPS.map(({
    label,
    tabs
  }) => {
    const records = tabs[0] === "__calc__" ? testHistory.filter(h => h.isCalc) : testHistory.filter(h => tabs.includes(h.tab));
    const total = records.length;
    const correct = records.filter(h => h.correct).length;
    return {
      subject: label,
      正答率: total > 0 ? Math.round(correct / total * 100) : 0,
      fullMark: 100
    };
  });

  // セクション別正答率（chapter × section）
  const TAB_LABELS = {
    ch1: "行動経済学",
    ch2: "ゴールベース",
    ethics: "倫理・税制",
    basics: "資産運用基礎",
    ch6: "財務諸表",
    portfolio: "PF・CAPM",
    products: "金融商品",
    supp2: "デリバティブ",
    casestudy: "ケース"
  };
  const TAB_SECTIONS = {
    ch1: ["A"],
    ch2: ["A"],
    ethics: ["A", "B", "C"],
    basics: ["A", "B", "C", "D", "E"],
    ch6: ["A"],
    portfolio: ["A", "B", "C", "D"],
    products: ["A", "B", "C", "D", "E"],
    supp2: ["A"],
    casestudy: ["A", "B"]
  };
  const sectionData = [];
  Object.entries(TAB_SECTIONS).forEach(([tab, secs]) => {
    secs.forEach(sec => {
      const records = testHistory.filter(h => h.tab === tab && h.section === sec);
      if (records.length > 0) {
        const correct = records.filter(h => h.correct).length;
        sectionData.push({
          name: `${TAB_LABELS[tab]?.slice(0, 4) ?? tab}-${sec}`,
          正答率: Math.round(correct / records.length * 100)
        });
      }
    });
  });
  const dateMap = {};
  testHistory.forEach(h => {
    const d = h.date?.slice(0, 10);
    if (!d) return;
    if (!dateMap[d]) dateMap[d] = {
      correct: 0,
      total: 0
    };
    dateMap[d].total++;
    if (h.correct) dateMap[d].correct++;
  });
  const trendData = Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b)).map(([date, {
    correct,
    total
  }]) => ({
    date: date.slice(5),
    正答率: Math.round(correct / total * 100)
  }));
  const withData = radarData.filter(d => d.正答率 > 0);
  const weakTab = [...withData].sort((a, b) => a.正答率 - b.正答率)[0];
  const adviceKey = weakTab?.subject === "倫理・顧客本位" ? "weak_ethics" : weakTab?.subject === "計算問題" ? "weak_calc" : "default";
  if (testHistory.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "24px 16px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        textAlign: "center",
        padding: 28
      }
    }, /*#__PURE__*/React.createElement(Activity, {
      size: 44,
      color: COLORS.highlight,
      style: {
        marginBottom: 12
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 700,
        fontSize: 15,
        color: COLORS.text,
        margin: "0 0 6px"
      }
    }, "\u307E\u3060\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: COLORS.textLight,
        margin: 0
      }
    }, "\u5404\u30BF\u30D6\u306E\u30AF\u30A4\u30BA\u306B\u6311\u6226\u3059\u308B\u3068\u3001\u3053\u3053\u306B\u6B63\u7B54\u7387\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 24px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      margin: "0 0 14px"
    }
  }, "\u7DCF\u554F\u984C\u6570: ", testHistory.length, "\u554F \uFF0F \u6B63\u7B54: ", testHistory.filter(h => h.correct).length, "\u554F"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text,
      margin: "0 0 10px"
    }
  }, "\uD83D\uDCE1 \u79D1\u76EE\u5225\u6B63\u7B54\u7387\u30EC\u30FC\u30C0\u30FC"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 240
  }, /*#__PURE__*/React.createElement(RadarChart, {
    data: radarData,
    cx: "50%",
    cy: "50%",
    outerRadius: 80
  }, /*#__PURE__*/React.createElement(PolarGrid, {
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(PolarAngleAxis, {
    dataKey: "subject",
    tick: {
      fontSize: 11,
      fill: COLORS.text
    }
  }), /*#__PURE__*/React.createElement(PolarRadiusAxis, {
    angle: 90,
    domain: [0, 100],
    tick: {
      fontSize: 9
    }
  }), /*#__PURE__*/React.createElement(Radar, {
    name: "\u6B63\u7B54\u7387",
    dataKey: "\u6B63\u7B54\u7387",
    stroke: COLORS.highlight,
    fill: COLORS.highlight,
    fillOpacity: 0.3
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`
  })))), sectionData.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text,
      margin: "0 0 10px"
    }
  }, "\uD83D\uDCCA \u30BB\u30AF\u30B7\u30E7\u30F3\u5225\u8A73\u7D30"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 200
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: sectionData,
    margin: {
      top: 4,
      right: 8,
      left: -20,
      bottom: 40
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "name",
    tick: {
      fontSize: 10
    },
    angle: -45,
    textAnchor: "end"
  }), /*#__PURE__*/React.createElement(YAxis, {
    domain: [0, 100],
    tick: {
      fontSize: 10
    },
    unit: "%"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "\u6B63\u7B54\u7387",
    fill: COLORS.secondary,
    radius: [4, 4, 0, 0]
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: 60,
    stroke: COLORS.danger,
    strokeDasharray: "4 2",
    label: {
      value: "合格ライン",
      fill: COLORS.danger,
      fontSize: 10
    }
  })))), trendData.length >= 2 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text,
      margin: "0 0 10px"
    }
  }, "\uD83D\uDCC8 \u30B9\u30B3\u30A2\u63A8\u79FB"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 160
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: trendData,
    margin: {
      top: 4,
      right: 8,
      left: -20,
      bottom: 4
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "date",
    tick: {
      fontSize: 10
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    domain: [0, 100],
    tick: {
      fontSize: 10
    },
    unit: "%"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "\u6B63\u7B54\u7387",
    stroke: COLORS.accent,
    strokeWidth: 2,
    dot: {
      r: 4
    }
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: 60,
    stroke: COLORS.danger,
    strokeDasharray: "4 2"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${COLORS.highlight}12`,
      borderRadius: 14,
      padding: 14,
      border: `1px solid ${COLORS.highlight}33`
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: COLORS.highlight,
      margin: "0 0 6px"
    }
  }, "\uD83E\uDD16 AI\u5B66\u7FD2\u30A2\u30C9\u30D0\u30A4\u30B9\uFF08\u30E2\u30C3\u30AF\uFF09"), weakTab && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      margin: "0 0 6px"
    }
  }, "\u6700\u3082\u6B63\u7B54\u7387\u304C\u4F4E\u3044\u79D1\u76EE: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: COLORS.danger
    }
  }, weakTab.subject, "\uFF08", weakTab.正答率, "%\uFF09")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.65,
      margin: 0
    }
  }, MOCK_ADVICE_DATA[adviceKey])));
}

// --- AnalysisSectionB: 計算問題特訓 ---
function AnalysisSectionB({
  state,
  setState
}) {
  const [currentItem, setCurrentItem] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [localHistory, setLocalHistory] = useState([]);
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setResult({
        correct: false,
        timeout: true
      });
      setTimerActive(false);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timeLeft]);
  const startPractice = item => {
    const q = item.generate();
    setCurrentItem(item);
    setCurrentQ(q);
    setUserAnswer("");
    setResult(null);
    setTimeLeft(60);
    setTimerActive(true);
  };
  const handleSubmit = () => {
    if (!currentQ || result) return;
    setTimerActive(false);
    const num = parseFloat(userAnswer);
    const correct = !isNaN(num) && Math.abs(num - currentQ.answer) <= Math.abs(currentQ.answer) * 0.02 + 0.05;
    const timeSpent = 60 - timeLeft;
    setResult({
      correct,
      expected: currentQ.answer,
      unit: currentQ.unit
    });
    setLocalHistory(h => [{
      key: currentItem.key,
      correct,
      timeSpent
    }, ...h.slice(0, 19)]);
    setState(s => ({
      ...s,
      calcHistory: [{
        date: new Date().toISOString(),
        formula: currentItem.key,
        correct,
        timeSpent
      }, ...(s.calcHistory || []).slice(0, 49)]
    }));
  };
  const calcHistory = state.calcHistory || [];
  const sorted = CALC_PRACTICE_ITEMS.map(item => {
    const hist = calcHistory.filter(h => h.formula === item.key);
    const rate = hist.length > 0 ? hist.filter(h => h.correct).length / hist.length : -1;
    return {
      ...item,
      rate,
      attempts: hist.length
    };
  }).sort((a, b) => a.rate - b.rate);
  const timerColor = timeLeft > 30 ? COLORS.secondary : timeLeft > 10 ? COLORS.accent : COLORS.danger;
  if (!currentItem) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 14px 24px"
      }
    }, /*#__PURE__*/React.createElement(InfoBox, {
      title: "\uD83D\uDCA1 \u4F7F\u3044\u65B9",
      color: COLORS.primary
    }, "\u6B63\u7B54\u7387\u306E\u4F4E\u3044\u516C\u5F0F\u3092\u512A\u5148\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002\u300C\u6311\u6226\u300D\u3092\u62BC\u3057\u3066\u304B\u308960\u79D2\u4EE5\u5185\u306B\u6570\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 14
      }
    }, sorted.map(item => {
      const rateLabel = item.attempts > 0 ? `${Math.round(item.rate * 100)}%（${item.attempts}回）` : "未挑戦";
      const rateColor = item.attempts === 0 ? COLORS.textLight : item.rate < 0.6 ? COLORS.danger : COLORS.secondary;
      return /*#__PURE__*/React.createElement("div", {
        key: item.key,
        style: {
          ...STYLES.card,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontWeight: 700,
          fontSize: 13,
          color: COLORS.text,
          margin: "0 0 2px"
        }
      }, item.label), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 11,
          color: COLORS.textLight,
          margin: "0 0 4px",
          fontFamily: "monospace"
        }
      }, item.formula), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 11,
          color: rateColor,
          margin: 0,
          fontWeight: 700
        }
      }, "\u6B63\u7B54\u7387 ", rateLabel)), /*#__PURE__*/React.createElement("button", {
        onClick: () => startPractice(item),
        style: {
          ...STYLES.btnPrimary,
          padding: "8px 14px",
          fontSize: 12,
          flexShrink: 0
        }
      }, "\u6311\u6226"));
    })), localHistory.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: COLORS.text,
        margin: "0 0 10px"
      }
    }, "\u76F4\u8FD1\u306E\u7DF4\u7FD2\u5C65\u6B74"), localHistory.slice(0, 6).map((h, i) => {
      const item = CALC_PRACTICE_ITEMS.find(c => c.key === h.key);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 14
        }
      }, h.correct ? "✅" : "❌"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: COLORS.text,
          flex: 1
        }
      }, item?.label), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: COLORS.textLight
        }
      }, h.timeSpent, "\u79D2"));
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      ...STYLES.card,
      marginBottom: 14,
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text
    }
  }, currentItem.label), /*#__PURE__*/React.createElement("div", {
    style: {
      background: timerColor,
      color: "#fff",
      borderRadius: 20,
      padding: "4px 16px",
      fontSize: 17,
      fontWeight: 900
    }
  }, timeLeft, "\u79D2")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${COLORS.primary}14`,
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      textAlign: "center",
      fontFamily: "monospace",
      fontSize: 13,
      color: COLORS.primary
    }
  }, currentItem.formula), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: COLORS.text,
      lineHeight: 1.7,
      margin: 0
    }
  }, currentQ && currentItem.question(currentQ.inputs))), !result ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: userAnswer,
    onChange: e => setUserAnswer(e.target.value),
    onKeyDown: e => e.key === "Enter" && handleSubmit(),
    placeholder: `答えを入力${currentQ?.unit ? `（${currentQ.unit}）` : ""}`,
    style: {
      ...STYLES.input,
      flex: 1
    },
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    style: {
      ...STYLES.btnPrimary,
      padding: "10px 18px"
    }
  }, "\u7B54\u3048\u308B")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: result.correct ? `${COLORS.secondary}18` : `${COLORS.danger}12`,
      border: `2px solid ${result.correct ? COLORS.secondary : COLORS.danger}`,
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 900,
      fontSize: 18,
      color: result.correct ? COLORS.secondary : COLORS.danger,
      margin: "0 0 6px"
    }
  }, result.correct ? "🎉 正解！" : result.timeout ? "⏰ 時間切れ！" : "❌ 不正解"), !result.correct && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: COLORS.text,
      margin: "0 0 8px"
    }
  }, "\u6B63\u89E3: ", /*#__PURE__*/React.createElement("strong", null, result.expected, result.unit)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      lineHeight: 1.6,
      margin: 0
    }
  }, MOCK_ADVICE_DATA[currentItem.key] || MOCK_ADVICE_DATA.default)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => startPractice(currentItem),
    style: {
      ...STYLES.btnPrimary,
      flex: 1,
      padding: 12
    }
  }, "\u3082\u3046\u4E00\u5EA6"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setCurrentItem(null);
      setCurrentQ(null);
      setResult(null);
    },
    style: {
      ...STYLES.btnOutline,
      flex: 1,
      padding: 12,
      borderRadius: 12
    }
  }, "\u4E00\u89A7\u3078\u623B\u308B"))));
}

// --- AnalysisSectionC: 忘却曲線・復習管理 ---
function AnalysisSectionC({
  state,
  setState
}) {
  const {
    testHistory,
    reviewStatus
  } = state;
  const wrongMap = {};
  testHistory.filter(h => !h.correct && h.keyword).forEach(h => {
    wrongMap[h.keyword] = (wrongMap[h.keyword] || 0) + 1;
  });
  const reviewItems = Object.entries(wrongMap).sort(([, a], [, b]) => b - a).slice(0, 12);
  const STATUS = {
    today: {
      label: "今日復習",
      color: COLORS.accent,
      next: "tomorrow"
    },
    tomorrow: {
      label: "明日確認",
      color: COLORS.primary,
      next: "mastered"
    },
    mastered: {
      label: "習得済み",
      color: COLORS.secondary,
      next: null
    }
  };
  const getStatus = kw => (reviewStatus || {})[kw] || "today";
  const masteredCount = reviewItems.filter(([kw]) => getStatus(kw) === "mastered").length;
  const updateReview = (kw, next) => {
    setState(s => ({
      ...s,
      reviewStatus: {
        ...s.reviewStatus,
        [kw]: next
      },
      progress: {
        ...s.progress,
        analysis: {
          analyzed: true
        }
      }
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text,
      margin: "0 0 4px"
    }
  }, "\uD83D\uDCC9 \u30A8\u30D3\u30F3\u30B0\u30CF\u30A6\u30B9\u306E\u5FD8\u5374\u66F2\u7DDA"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      margin: "0 0 12px"
    }
  }, "\u7E70\u308A\u8FD4\u3057\u5FA9\u7FD2\u3059\u308B\u3053\u3068\u3067\u8A18\u61B6\u5B9A\u7740\u7387\u304C\u5927\u304D\u304F\u5411\u4E0A\u3057\u307E\u3059"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 180
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: FORGETTING_CURVE_DATA,
    margin: {
      top: 4,
      right: 8,
      left: -20,
      bottom: 4
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: COLORS.border
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "day",
    tick: {
      fontSize: 9
    },
    interval: 4
  }), /*#__PURE__*/React.createElement(YAxis, {
    domain: [0, 100],
    tick: {
      fontSize: 9
    },
    unit: "%"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: v => `${v}%`
  }), /*#__PURE__*/React.createElement(Legend, {
    wrapperStyle: {
      fontSize: 11
    }
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "\u5FA9\u7FD2\u306A\u3057",
    stroke: COLORS.danger,
    strokeWidth: 2,
    dot: false
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "\u5FA9\u7FD2\u3042\u308A",
    stroke: COLORS.secondary,
    strokeWidth: 2,
    dot: false,
    strokeDasharray: "5 3"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 8,
      fontSize: 11,
      color: COLORS.textLight,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u7FCC\u65E5: \u7D0474%\u5FD8\u5374"), /*#__PURE__*/React.createElement("span", null, "1\u9031\u9593: \u7D0467%\u5FD8\u5374"), /*#__PURE__*/React.createElement("span", null, "1\u30F6\u6708: \u7D0479%\u5FD8\u5374"))), reviewItems.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: COLORS.text,
      margin: 0
    }
  }, "\u5FA9\u7FD2\u9032\u6357"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: COLORS.secondary,
      fontWeight: 700
    }
  }, masteredCount, " / ", reviewItems.length, " \u7FD2\u5F97\u6E08\u307F")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.border,
      borderRadius: 8,
      height: 8,
      overflow: "hidden",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.secondary,
      height: "100%",
      borderRadius: 8,
      width: `${reviewItems.length > 0 ? masteredCount / reviewItems.length * 100 : 0}%`,
      transition: "width 0.4s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, reviewItems.map(([kw, cnt]) => {
    const st = getStatus(kw);
    const info = STATUS[st];
    return /*#__PURE__*/React.createElement("div", {
      key: kw,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        borderRadius: 10,
        padding: "10px 12px",
        border: `1px solid ${COLORS.border}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: COLORS.text,
        margin: "0 0 1px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, kw), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: COLORS.textLight,
        margin: 0
      }
    }, "\u9593\u9055\u3044 ", cnt, "\u56DE")), /*#__PURE__*/React.createElement("span", {
      style: {
        ...STYLES.badge(info.color),
        fontSize: 10,
        whiteSpace: "nowrap",
        flexShrink: 0
      }
    }, info.label), info.next ? /*#__PURE__*/React.createElement("button", {
      onClick: () => updateReview(kw, info.next),
      style: {
        background: info.color,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "5px 10px",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        flexShrink: 0
      }
    }, info.next === "tomorrow" ? "今日OK" : "完璧！") : /*#__PURE__*/React.createElement("button", {
      onClick: () => updateReview(kw, "today"),
      style: {
        background: "transparent",
        color: COLORS.textLight,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: "5px 10px",
        fontSize: 11,
        cursor: "pointer",
        flexShrink: 0
      }
    }, "\u30EA\u30BB\u30C3\u30C8"));
  }))), reviewItems.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      textAlign: "center",
      padding: 24,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: COLORS.textLight,
      margin: 0
    }
  }, "\u30AF\u30A4\u30BA\u3067\u9593\u9055\u3048\u305F\u30AD\u30FC\u30EF\u30FC\u30C9\u304C\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002", /*#__PURE__*/React.createElement("br", null), "\u5404\u30BF\u30D6\u306E\u30AF\u30A4\u30BA\u306B\u6311\u6226\u3057\u3066\u307F\u307E\u3057\u3087\u3046\uFF01")), /*#__PURE__*/React.createElement(ExamTipCard, {
    color: COLORS.accent,
    tips: ["翌日・3日後・1週間後・2週間後・1ヶ月後の間隔で繰り返すと定着率が高まる（間隔反復）", "「今日OK」→「完璧！」の順でステータスを進めましょう", "正答率60%以上を全セクションで維持するのが合格の目安", "計算問題は「なぜその公式になるか」を理解してから暗記すると応用が効く"]
  }));
}
const ANALYSIS_SECTIONS = [{
  id: "A",
  label: "正答率分析"
}, {
  id: "B",
  label: "計算特訓"
}, {
  id: "C",
  label: "忘却曲線"
}, {
  id: "D",
  label: "AI解説"
}];

// ============================================================
// フェーズ14: AI機能（モック）統合
// ============================================================

const TAB_DISPLAY = {
  ethics: "倫理・顧客本位",
  basics: "資産運用の基礎",
  portfolio: "ポートフォリオ理論",
  products: "金融商品",
  casestudy: "ケーススタディ"
};
const MOCK_AI_DATA = {
  explanation: {
    sharpe_ratio: "シャープレシオはポートフォリオの効率性を測る指標です。リスク（標準偏差）1単位あたり、どれだけ超過リターン（リターン−無リスク利子率）を獲得できたかを示します。数値が高いほど効率的なポートフォリオです。例：SR=1.0 はリスク1%あたり1%の超過リターンを意味します。",
    capm: "CAPMは個々の資産の期待リターンを説明するモデルです。投資家はシステマティックリスク（β）に対してのみ報酬を要求するという考え方に基づきます。非システマティックリスクは分散投資で消去できるため、市場は補償しないとされます。公式：E(Ri) = Rf + β×(Rm−Rf)。",
    duration: "デュレーションは債券の金利感応度を表します。『平均的に何年後にお金が戻ってくるか』という概念です。クーポンが小さい・残存期間が長いほどデュレーションが長くなり、金利変動の影響を受けやすくなります。修正デュレーション×金利変化率≒価格変化率（マイナス符号に注意）。",
    portfolio_risk: "ポートフォリオリスクは個別資産のリスクの単純合計より小さくなります（分散効果）。相関係数ρが低いほど分散効果が大きく、ρ=−1では理論上リスクをゼロにできます。2資産の場合：σp=√(w₁²σ₁²+2ρw₁w₂σ₁σ₂+w₂²σ₂²)。",
    ddm: "DDM（配当割引モデル）は株式の理論価格を将来の配当の現在価値合計として求めます。定率成長モデルでは P=D₁/(r−g)。分母が小さいほど（rとgが近いほど）株価は高くなります。成長率gが期待収益率rを上回ると成立しません。",
    pv: "現在価値（PV）は『将来のお金を今の価値に換算』した金額です。割引率が高いほど・期間が長いほど現在価値は小さくなります。PV=FV/(1+r)^n。年金や債券のキャッシュフロー評価に広く使われます。",
    fd_principle: "フィデューシャリーデューティー（FD）とは、顧客の最善の利益を追求する義務のことです。7原則（顧客利益優先・利益相反管理・手数料透明性・重要情報提供・適切なサービス・従業員意識向上・定期的見直し）を業務全体で実践することが求められます。",
    efficient_frontier: "効率的フロンティアは、同じリスク水準で最大リターン（または同じリターンで最小リスク）を実現するポートフォリオの集合です。その接線（CML）と無リスク資産の組み合わせが最適なポートフォリオとなります（トービンの分離定理）。",
    nisa: "新NISA（2024年〜）は年間360万円まで非課税投資が可能です。つみたて投資枠（120万/年）と成長投資枠（240万/年）の2本立て。生涯上限1,800万円。売却枠の再利用が可能。損益通算・損失の繰越控除は不可。",
    ideco: "iDeCoは掛金が全額所得控除になる私的年金制度です。拠出限度額は職業により異なります（会社員：月2.3万/5.5万、自営業：月6.8万など）。60歳以降に受け取り、受取時も控除あり（退職所得控除・公的年金等控除）。途中解約は原則不可。",
    default: "この概念の理解には、まず基本的な定義から始めて、具体的な数値例で確認するのが効果的です。電卓機能を使って実際に計算してみましょう。"
  },
  compare: [{
    id: "sharpe_vs_treynor",
    title: "シャープ vs トレイナー",
    left: {
      name: "シャープレシオ",
      key: "(Rp−Rf)/σp",
      desc: "全リスク（σ）で除算。未分散ポートフォリオの評価向き。"
    },
    right: {
      name: "トレイナーレシオ",
      key: "(Rp−Rf)/β",
      desc: "市場リスク（β）で除算。完全分散ポートフォリオの評価向き。"
    },
    note: "試験では『どちらが適切か』を職業/状況で判断する問題が頻出。個人投資家→シャープ、機関投資家（完全分散）→トレイナー。"
  }, {
    id: "index_vs_active",
    title: "インデックス vs アクティブ",
    left: {
      name: "インデックスファンド",
      key: "低コスト・市場平均追随",
      desc: "信託報酬0.1%前後。市場平均を上回ることを目指さない。長期では大半のアクティブを上回る実績。"
    },
    right: {
      name: "アクティブファンド",
      key: "高コスト・超過収益狙い",
      desc: "信託報酬1〜2%程度。市場平均超過（α）を狙う。長期的にはコスト差が不利に働きやすい。"
    },
    note: "効率的市場仮説：市場価格はすべての情報を反映しているため、継続的な超過収益は困難とされる。コスト差は複利で大きな差に。"
  }, {
    id: "nisa_vs_ideco",
    title: "NISA vs iDeCo",
    left: {
      name: "新NISA",
      key: "非課税運用・いつでも引出",
      desc: "運用益非課税。いつでも引き出せる。掛金控除なし。教育費・住宅購入など流動性重視に向く。"
    },
    right: {
      name: "iDeCo",
      key: "掛金控除・60歳まで拘束",
      desc: "掛金が全額所得控除。60歳まで引き出し不可。老後専用の長期積立に最適。節税効果が大きい。"
    },
    note: "どちらを優先するか？→ まず節税効果の高いiDeCoを上限まで活用し、次にNISAで残りを運用するのが基本戦略。"
  }, {
    id: "arith_vs_geo",
    title: "算術平均 vs 幾何平均",
    left: {
      name: "算術平均",
      key: "(r₁+r₂+…+rₙ)/n",
      desc: "各期リターンの単純平均。過去の実績分析・期待値計算に使用。将来予測には不適。"
    },
    right: {
      name: "幾何平均",
      key: "ⁿ√((1+r₁)(1+r₂)…(1+rₙ))−1",
      desc: "複利での実際の成長率。将来の資産成長予測に使用。常に算術平均以下。"
    },
    note: "試験頻出：将来の資産成長率→幾何平均、各期リターンの統計分析→算術平均。「どちらを使うべきか」問題に注意。"
  }, {
    id: "systematic_vs_unsystematic",
    title: "システマティック vs 非システマティック",
    left: {
      name: "システマティックリスク",
      key: "市場全体に影響・分散不可",
      desc: "金利変動・景気後退・地政学リスクなど。β（ベータ）で表される。CAPMで報酬される。"
    },
    right: {
      name: "非システマティックリスク",
      key: "個別企業固有・分散で消去可",
      desc: "企業の不祥事・業績悪化など。銘柄数増加で低減（15〜20銘柄で大部分消去）。報酬されない。"
    },
    note: "CAPM の核心：非システマティックリスクは分散投資で消去できるため、市場はシステマティックリスク（β）のみを報酬する。"
  }]
};

// --- AIMockPanel: 折りたたみ式AI解説パネル ---
function AIMockPanel({
  topicKey,
  type = "explanation",
  label = "AI解説",
  color = COLORS.highlight
}) {
  const [open, setOpen] = useState(false);
  const text = MOCK_AI_DATA[type]?.[topicKey] || MOCK_AI_DATA[type]?.default || "";
  if (!text) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: open ? `${color}18` : "transparent",
      border: `1.5px solid ${open ? color : COLORS.border}`,
      borderRadius: 10,
      padding: "7px 14px",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      color: open ? color : COLORS.textLight,
      fontFamily: "'Noto Sans JP', sans-serif",
      transition: "all 0.18s ease",
      width: "100%",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "\uD83E\uDD16"), label, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 10
    }
  }, open ? "▲" : "▼")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${color}0A`,
      border: `1px solid ${color}30`,
      borderRadius: "0 0 10px 10px",
      padding: "12px 14px",
      fontSize: 13,
      color: COLORS.text,
      lineHeight: 1.7
    }
  }, text));
}

// --- AICompareCard: 概念比較パネル ---
function AICompareCard({
  item
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: COLORS.highlight,
      margin: "0 0 10px"
    }
  }, "\uD83D\uDD01 ", item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${COLORS.primary}10`,
      borderRadius: 10,
      padding: 10,
      border: `1px solid ${COLORS.primary}30`
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: COLORS.primary,
      margin: "0 0 3px"
    }
  }, item.left.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      fontFamily: "monospace",
      margin: "0 0 4px"
    }
  }, item.left.key), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: COLORS.text,
      margin: 0,
      lineHeight: 1.5
    }
  }, item.left.desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${COLORS.secondary}10`,
      borderRadius: 10,
      padding: 10,
      border: `1px solid ${COLORS.secondary}30`
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: COLORS.secondary,
      margin: "0 0 3px"
    }
  }, item.right.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      fontFamily: "monospace",
      margin: "0 0 4px"
    }
  }, item.right.key), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: COLORS.text,
      margin: 0,
      lineHeight: 1.5
    }
  }, item.right.desc))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${COLORS.accent}12`,
      borderRadius: 8,
      padding: "8px 12px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.text,
      lineHeight: 1.6,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: COLORS.accent
    }
  }, "\u8A66\u9A13\u30DD\u30A4\u30F3\u30C8\uFF1A"), item.note)));
}

// --- AIReviewWidget: ホーム画面向けパーソナライズ提案 ---
function AIReviewWidget({
  state
}) {
  const {
    testHistory
  } = state;
  const [open, setOpen] = useState(false);
  if (testHistory.length < 5) return null;
  const tabStats = {};
  testHistory.forEach(h => {
    if (!tabStats[h.tab]) tabStats[h.tab] = {
      correct: 0,
      total: 0
    };
    tabStats[h.tab].total++;
    if (h.correct) tabStats[h.tab].correct++;
  });
  const sorted = Object.entries(tabStats).map(([tab, s]) => ({
    tab,
    rate: s.correct / s.total,
    total: s.total
  })).filter(t => t.total >= 3).sort((a, b) => a.rate - b.rate);
  const weakTab = sorted[0];
  const calcOnes = testHistory.filter(h => h.isCalc);
  const calcRate = calcOnes.length > 0 ? calcOnes.filter(h => h.correct).length / calcOnes.length : null;
  const explKey = weakTab?.tab === "portfolio" ? "capm" : weakTab?.tab === "basics" ? "pv" : weakTab?.tab === "products" ? "duration" : weakTab?.tab === "ethics" ? "fd_principle" : "default";
  const topKeywords = (() => {
    const wm = {};
    testHistory.filter(h => !h.correct && h.keyword).forEach(h => {
      wm[h.keyword] = (wm[h.keyword] || 0) + 1;
    });
    return Object.entries(wm).sort(([, a], [, b]) => b - a).slice(0, 3).map(([k]) => k);
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12,
      background: `${COLORS.highlight}0A`,
      border: `1.5px solid ${COLORS.highlight}33`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "none",
      border: "none",
      cursor: "pointer",
      width: "100%",
      padding: 0,
      fontFamily: "'Noto Sans JP', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: COLORS.highlight,
      flex: 1,
      textAlign: "left"
    }
  }, "\u4ECA\u65E5\u306EAI\u5B66\u7FD2\u63D0\u6848"), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 16,
    color: COLORS.highlight,
    style: {
      transform: open ? "rotate(90deg)" : "none",
      transition: "transform 0.2s"
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, weakTab && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: COLORS.text
    }
  }, "\u6700\u3082\u6B63\u7B54\u7387\u304C\u4F4E\u3044\u5206\u91CE:"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...STYLES.badge(COLORS.danger),
      fontWeight: 700
    }
  }, TAB_DISPLAY[weakTab.tab] || weakTab.tab, "\uFF08", Math.round(weakTab.rate * 100), "%\uFF09")), calcRate !== null && calcRate < 0.6 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: COLORS.text
    }
  }, "\u8A08\u7B97\u554F\u984C\u6B63\u7B54\u7387:"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...STYLES.badge(COLORS.accent),
      fontWeight: 700
    }
  }, Math.round(calcRate * 100), "% \u2192 \u8A08\u7B97\u7279\u8A13\u30BF\u30D6\u3067\u7DF4\u7FD2\u3092\uFF01")), topKeywords.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      margin: "0 0 6px"
    }
  }, "\u983B\u51FA\u306E\u9593\u9055\u3044\u30AD\u30FC\u30EF\u30FC\u30C9:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, topKeywords.map(kw => /*#__PURE__*/React.createElement("span", {
    key: kw,
    style: STYLES.badge(COLORS.primary)
  }, kw)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${COLORS.highlight}10`,
      borderRadius: 10,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.text,
      lineHeight: 1.65,
      margin: 0
    }
  }, MOCK_AI_DATA.explanation[explKey]))));
}

// --- AnalysisSectionD: AI解説・比較パネル集 ---
function AnalysisSectionD() {
  const topics = [{
    key: "capm",
    label: "CAPM（資本資産評価モデル）"
  }, {
    key: "sharpe_ratio",
    label: "シャープレシオ"
  }, {
    key: "portfolio_risk",
    label: "ポートフォリオリスクと分散効果"
  }, {
    key: "efficient_frontier",
    label: "効率的フロンティア・CML"
  }, {
    key: "duration",
    label: "デュレーション"
  }, {
    key: "ddm",
    label: "DDM（配当割引モデル）"
  }, {
    key: "fd_principle",
    label: "フィデューシャリーデューティー"
  }, {
    key: "nisa",
    label: "新NISA"
  }, {
    key: "ideco",
    label: "iDeCo"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(InfoBox, {
    title: "\uD83D\uDCA1 AI\u89E3\u8AAC\u306E\u4F7F\u3044\u65B9",
    color: COLORS.highlight
  }, "\u5404\u30C8\u30D4\u30C3\u30AF\u3092\u30BF\u30C3\u30D7\u3059\u308B\u3068AI\u98A8\u306E\u89E3\u8AAC\u304C\u5C55\u958B\u3057\u307E\u3059\u3002 \u300C\u6BD4\u8F03\u3067\u7406\u89E3\u300D\u30BB\u30AF\u30B7\u30E7\u30F3\u3067\u306F\u8A66\u9A13\u983B\u51FA\u306E\u6982\u5FF5\u6BD4\u8F03\u3092\u307E\u3068\u3081\u3066\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text,
      margin: "14px 0 10px"
    }
  }, "\uD83D\uDCDA \u30C8\u30D4\u30C3\u30AF\u5225AI\u89E3\u8AAC"), topics.map(t => /*#__PURE__*/React.createElement(AIMockPanel, {
    key: t.key,
    topicKey: t.key,
    label: `${t.label}を解説`
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: COLORS.text,
      margin: "20px 0 10px"
    }
  }, "\uD83D\uDD01 \u6BD4\u8F03\u3067\u7406\u89E3\u3059\u308B"), MOCK_AI_DATA.compare.map(item => /*#__PURE__*/React.createElement(AICompareCard, {
    key: item.id,
    item: item
  })));
}

// --- AnalysisTab ---
function AnalysisTab({
  state,
  setState
}) {
  const [section, setSection] = useState("A");
  const color = COLORS.highlight;
  const renderSection = () => {
    switch (section) {
      case "A":
        return /*#__PURE__*/React.createElement(AnalysisSectionA, {
          state: state
        });
      case "B":
        return /*#__PURE__*/React.createElement(AnalysisSectionB, {
          state: state,
          setState: setState
        });
      case "C":
        return /*#__PURE__*/React.createElement(AnalysisSectionC, {
          state: state,
          setState: setState
        });
      case "D":
        return /*#__PURE__*/React.createElement(AnalysisSectionD, null);
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "\u2465 \u82E6\u624B\u5206\u6790",
    subtitle: "\u6B63\u7B54\u7387\u30EC\u30FC\u30C0\u30FC\u30FB\u8A08\u7B97\u7279\u8A13\u30FB\u5FD8\u5374\u66F2\u7DDA\u3067\u5F31\u70B9\u3092\u5B8C\u5168\u514B\u670D",
    color: color,
    icon: Activity
  }), /*#__PURE__*/React.createElement(SectionTab, {
    sections: ANALYSIS_SECTIONS,
    activeSection: section,
    onSelect: setSection,
    color: color
  }), /*#__PURE__*/React.createElement(SectionProgress, {
    tabId: "analysis",
    sections: ANALYSIS_SECTIONS,
    progress: state.progress,
    color: color,
    onSelect: setSection
  }), renderSection());
}

// ============================================================
// フェーズ15: 仕上げ・模擬試験・結合
// ============================================================

function buildMockQuestions() {
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const pick = (arr, n) => shuffle(arr).slice(0, Math.min(n, arr.length));
  const tag = (arr, tab) => arr.map(q => ({
    ...q,
    tab
  }));

  // 第1章（行動経済学）・第2章（ゴールベース）
  const ch1Pool = tag(CH1_QUIZZES, "ch1");
  const ch2Pool = tag(CH2_QUIZZES, "ch2");

  // 第1〜3章（フィデューシャリー・信頼関係・NISA）
  const ethicsPool = tag([...ETHICS_QUIZZES.A, ...ETHICS_QUIZZES.B, ...ETHICS_QUIZZES.C], "ethics");

  // 第4〜5章（リターン・リスク・現在価値・積立）
  const basicsPool = tag([...BASICS_QUIZZES.A, ...BASICS_QUIZZES.B, ...BASICS_QUIZZES.C], "basics");

  // 第6章（財務諸表）
  const ch6Pool = tag(CH6_QUIZZES, "ch6");

  // 第7〜8章（ポートフォリオ理論・CAPM）
  const pfPool = tag([...PORTFOLIO_QUIZZES.A, ...PORTFOLIO_QUIZZES.B, ...PORTFOLIO_QUIZZES.C, ...PORTFOLIO_QUIZZES.D], "portfolio");

  // 第9〜12章（株式・債券・外国証券・投資信託）
  const productsPool = tag([...PRODUCTS_QUIZZES.A, ...PRODUCTS_QUIZZES.B, ...PRODUCTS_QUIZZES.C, ...PRODUCTS_QUIZZES.D], "products");

  // 補論2（デリバティブ）・補論3（オルタナティブ）
  const supp2Pool = tag(SUPP2_QUIZZES, "supp2");
  const supp3Pool = tag(PRODUCTS_QUIZZES.E, "products");

  // ケーススタディ
  const casePool = CASE_STUDIES.flatMap((cs, ci) => cs.questions.map((q, qi) => ({
    id: `case-${ci}-${qi}`,
    tab: "casestudy",
    keyword: cs.title,
    explanation: q.explanation || "",
    ...q
  })));

  // 合計40問：全14章から均等配分
  return [...pick(ch1Pool, 2),
  // 第1章  行動経済学      2問
  ...pick(ch2Pool, 2),
  // 第2章  ゴールベース    2問
  ...pick(ethicsPool, 4),
  // 第1-3章 倫理・税制     4問
  ...pick(basicsPool, 6),
  // 第4-5章 資産運用基礎   6問
  ...pick(ch6Pool, 4),
  // 第6章  財務諸表        4問
  ...pick(pfPool, 8),
  // 第7-8章 PF理論・CAPM  8問
  ...pick(productsPool, 6),
  // 第9-12章 金融商品      6問
  ...pick(supp2Pool, 3),
  // 補論2  デリバティブ    3問
  ...pick(supp3Pool, 2),
  // 補論3  オルタナティブ  2問
  ...pick(casePool, 3) // ケーススタディ         3問
  ]; // 計40問
}
const MOCK_EXAM_TABS = {
  ch1: {
    label: "行動経済学",
    color: "#16A085"
  },
  ch2: {
    label: "ゴールベース",
    color: "#4A90D9"
  },
  ethics: {
    label: "倫理・税制",
    color: COLORS.secondary
  },
  basics: {
    label: "資産運用基礎",
    color: COLORS.accent
  },
  ch6: {
    label: "財務諸表",
    color: "#27AE60"
  },
  portfolio: {
    label: "PF・CAPM",
    color: COLORS.highlight
  },
  products: {
    label: "金融商品",
    color: "#E67E22"
  },
  supp2: {
    label: "デリバティブ",
    color: "#E74C3C"
  },
  casestudy: {
    label: "ケース",
    color: "#16A085"
  }
};
function MockExam({
  state,
  setState,
  onClose
}) {
  const [phase, setPhase] = useState("ready");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [result, setResult] = useState(null);
  const [showWrong, setShowWrong] = useState(false);
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) {
      finishExam(answers);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  });
  const startExam = () => {
    const qs = buildMockQuestions();
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setIdx(0);
    setSelected(null);
    setConfirmed(false);
    setTimeLeft(3600);
    setPhase("exam");
  };
  const confirmAnswer = () => {
    if (selected === null) return;
    const next = [...answers];
    next[idx] = selected;
    setAnswers(next);
    setConfirmed(true);
  };
  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      finishExam(answers.map((a, i) => a !== null ? a : -1));
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };
  const finishExam = finalAnswers => {
    const qs = questions;
    const ans = finalAnswers || answers;
    const correct = ans.filter((a, i) => a === qs[i]?.answer).length;
    const score = Math.round(correct / 40 * 100);
    const tabStats = {};
    qs.forEach((q, i) => {
      if (!tabStats[q.tab]) tabStats[q.tab] = {
        correct: 0,
        total: 0
      };
      tabStats[q.tab].total++;
      if (ans[i] === q.answer) tabStats[q.tab].correct++;
    });
    const calcIdxs = qs.map((q, i) => q.isCalc ? i : null).filter(i => i !== null);
    const calcCorrect = calcIdxs.filter(i => ans[i] === qs[i].answer).length;
    const wrong = qs.map((q, i) => ({
      ...q,
      yourAnswer: ans[i],
      isCorrect: ans[i] === q.answer
    })).filter(q => !q.isCorrect);
    const r = {
      correct,
      score,
      passed: score >= 60,
      tabStats,
      calcCorrect,
      calcTotal: calcIdxs.length,
      wrong
    };
    setResult(r);
    setPhase("result");
    setState(s => ({
      ...s,
      testHistory: [...s.testHistory, ...qs.map((q, i) => ({
        date: new Date().toISOString(),
        tab: q.tab,
        section: "mock",
        question: q.id || `mock-${i}`,
        correct: ans[i] === q.answer,
        keyword: q.keyword || "",
        isCalc: !!q.isCalc
      }))]
    }));
  };
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const timerColor = timeLeft < 300 ? COLORS.danger : timeLeft < 600 ? COLORS.accent : COLORS.text;

  // ── Ready Screen ──
  if (phase === "ready") return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      width: "100%",
      maxWidth: 400
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 900,
      fontSize: 20,
      color: COLORS.primary,
      margin: "0 0 12px",
      textAlign: "center"
    }
  }, "\uD83D\uDCDD \u6A21\u64EC\u8A66\u9A13"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 16
    }
  }, [["形式", "4肢択一・40問"], ["制限時間", "60分"], ["合格基準", "60点以上（60%）"], ["出題構成", "全14章から均等配分（行動経済学・ゴールベース・倫理・基礎・財務諸表・PF理論・CAPM・金融商品・デリバティブ・ケース）"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      gap: 8,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.textLight,
      minWidth: 72,
      fontWeight: 600
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.text
    }
  }, v)))), /*#__PURE__*/React.createElement(InfoBox, {
    color: COLORS.accent
  }, "\u7D50\u679C\u306F\u30C6\u30B9\u30C8\u5C65\u6B74\u306B\u4FDD\u5B58\u3055\u308C\u3001\u82E6\u624B\u5206\u6790\u30BF\u30D6\u306B\u53CD\u6620\u3055\u308C\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: startExam,
    style: {
      ...STYLES.btnPrimary,
      flex: 1,
      padding: 14,
      fontSize: 15
    }
  }, "\u8A66\u9A13\u3092\u958B\u59CB"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      ...STYLES.btnOutline,
      flex: 1,
      padding: 14,
      borderRadius: 12
    }
  }, "\u623B\u308B"))));

  // ── Exam Screen ──
  if (phase === "exam") {
    const q = questions[idx];
    if (!q) return null;
    const tabInfo = MOCK_EXAM_TABS[q.tab] || {
      label: q.tab,
      color: COLORS.primary
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: COLORS.bg,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#fff",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: COLORS.textLight
      }
    }, idx + 1, " / 40"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: COLORS.border,
        borderRadius: 6,
        height: 6,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${(idx + 1) / 40 * 100}%`,
        height: "100%",
        background: COLORS.primary,
        borderRadius: 6,
        transition: "width 0.3s"
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: timerColor,
        minWidth: 54
      }
    }, mm, ":", ss)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        padding: "16px 16px 8px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: STYLES.badge(tabInfo.color)
    }, tabInfo.label), q.isCalc && /*#__PURE__*/React.createElement("span", {
      style: STYLES.badge(COLORS.highlight)
    }, "\u8A08\u7B97"), q.isHikakke && /*#__PURE__*/React.createElement("span", {
      style: STYLES.badge(COLORS.danger)
    }, "\u3072\u3063\u304B\u3051\u6CE8\u610F")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: COLORS.text,
        lineHeight: 1.7,
        margin: "0 0 16px"
      }
    }, q.q), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, q.choices.map((c, i) => {
      let bg = "#fff",
        border = `1.5px solid ${COLORS.border}`,
        col = COLORS.text;
      if (confirmed) {
        if (i === q.answer) {
          bg = `${COLORS.secondary}18`;
          border = `2px solid ${COLORS.secondary}`;
          col = COLORS.secondary;
        } else if (i === selected) {
          bg = `${COLORS.danger}12`;
          border = `2px solid ${COLORS.danger}`;
          col = COLORS.danger;
        }
      } else if (i === selected) {
        bg = `${COLORS.primary}12`;
        border = `2px solid ${COLORS.primary}`;
        col = COLORS.primary;
      }
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => !confirmed && setSelected(i),
        disabled: confirmed,
        style: {
          background: bg,
          border,
          borderRadius: 12,
          padding: "12px 14px",
          textAlign: "left",
          cursor: confirmed ? "default" : "pointer",
          fontSize: 13,
          color: col,
          lineHeight: 1.5,
          fontFamily: "'Noto Sans JP', sans-serif",
          transition: "all 0.15s"
        }
      }, /*#__PURE__*/React.createElement("strong", {
        style: {
          marginRight: 6
        }
      }, ["①", "②", "③", "④"][i]), c);
    })), confirmed && q.explanation && /*#__PURE__*/React.createElement("div", {
      style: {
        background: `${COLORS.primary}0C`,
        border: `1px solid ${COLORS.primary}30`,
        borderRadius: 12,
        padding: "10px 14px",
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: COLORS.text,
        lineHeight: 1.65,
        margin: 0
      }
    }, /*#__PURE__*/React.createElement("strong", null, "\u89E3\u8AAC\uFF1A"), q.explanation))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 16px 16px",
        borderTop: `1px solid ${COLORS.border}`,
        flexShrink: 0
      }
    }, !confirmed ? /*#__PURE__*/React.createElement("button", {
      onClick: confirmAnswer,
      disabled: selected === null,
      style: {
        ...STYLES.btnPrimary,
        width: "100%",
        padding: 13,
        fontSize: 15,
        opacity: selected === null ? 0.5 : 1
      }
    }, "\u7B54\u3048\u308B") : /*#__PURE__*/React.createElement("button", {
      onClick: handleNext,
      style: {
        ...STYLES.btnSecondary,
        width: "100%",
        padding: 13,
        fontSize: 15
      }
    }, idx + 1 < 40 ? `次の問題 →` : `結果を見る`)));
  }

  // ── Result Screen ──
  if (phase === "result" && result) {
    const barData = Object.entries(result.tabStats).map(([tab, s]) => ({
      name: MOCK_EXAM_TABS[tab]?.label || tab,
      正答率: Math.round(s.correct / s.total * 100),
      color: MOCK_EXAM_TABS[tab]?.color || COLORS.primary
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: COLORS.bg,
        zIndex: 1000,
        overflowY: "auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "20px 16px 32px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: COLORS.textLight,
        margin: "0 0 4px"
      }
    }, "\u6A21\u64EC\u8A66\u9A13 \u7D50\u679C"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 64,
        fontWeight: 900,
        color: result.passed ? COLORS.secondary : COLORS.danger,
        lineHeight: 1
      }
    }, result.score, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 24
      }
    }, "\u70B9")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: COLORS.textLight,
        margin: "4px 0 10px"
      }
    }, "40\u554F\u4E2D ", result.correct, "\u554F\u6B63\u89E3"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-block",
        padding: "6px 22px",
        borderRadius: 24,
        background: result.passed ? `${COLORS.secondary}20` : `${COLORS.danger}18`,
        border: `2px solid ${result.passed ? COLORS.secondary : COLORS.danger}`,
        fontSize: 16,
        fontWeight: 900,
        color: result.passed ? COLORS.secondary : COLORS.danger
      }
    }, result.passed ? "🎉 合格！" : "📚 不合格（60点以上で合格）")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: COLORS.text,
        margin: "0 0 10px"
      }
    }, "\u5206\u91CE\u5225\u6B63\u7B54\u7387"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%",
      height: 160
    }, /*#__PURE__*/React.createElement(BarChart, {
      data: barData,
      margin: {
        top: 4,
        right: 8,
        left: -20,
        bottom: 4
      }
    }, /*#__PURE__*/React.createElement(CartesianGrid, {
      strokeDasharray: "3 3",
      stroke: COLORS.border
    }), /*#__PURE__*/React.createElement(XAxis, {
      dataKey: "name",
      tick: {
        fontSize: 11
      }
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: [0, 100],
      tick: {
        fontSize: 10
      },
      unit: "%"
    }), /*#__PURE__*/React.createElement(Tooltip, {
      formatter: v => `${v}%`
    }), /*#__PURE__*/React.createElement(Bar, {
      dataKey: "\u6B63\u7B54\u7387",
      radius: [4, 4, 0, 0]
    }, barData.map((entry, i) => /*#__PURE__*/React.createElement(Cell, {
      key: i,
      fill: entry.color
    }))), /*#__PURE__*/React.createElement(ReferenceLine, {
      y: 60,
      stroke: COLORS.danger,
      strokeDasharray: "4 2"
    })))), result.calcTotal > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Calculator, {
      size: 28,
      color: COLORS.highlight
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: COLORS.text,
        margin: "0 0 2px"
      }
    }, "\u8A08\u7B97\u554F\u984C\u306E\u6B63\u7B54\u7387"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: COLORS.highlight,
        fontWeight: 700,
        margin: 0
      }
    }, result.calcCorrect, " / ", result.calcTotal, "\u554F \uFF08", Math.round(result.calcCorrect / result.calcTotal * 100), "%\uFF09"))), result.wrong.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowWrong(s => !s),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        width: "100%",
        padding: 0,
        fontFamily: "'Noto Sans JP', sans-serif"
      }
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 16,
      color: COLORS.danger
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: COLORS.text,
        flex: 1,
        textAlign: "left"
      }
    }, "\u9593\u9055\u3048\u305F\u554F\u984C\uFF08", result.wrong.length, "\u554F\uFF09"), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 16,
      color: COLORS.textMuted,
      style: {
        transform: showWrong ? "rotate(90deg)" : "none",
        transition: "transform 0.2s"
      }
    })), showWrong && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, result.wrong.map((q, i) => {
      const ti = MOCK_EXAM_TABS[q.tab] || {
        label: q.tab,
        color: COLORS.primary
      };
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: 10,
          marginTop: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 6,
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: STYLES.badge(ti.color)
      }, ti.label)), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 13,
          color: COLORS.text,
          fontWeight: 600,
          margin: "0 0 6px",
          lineHeight: 1.6
        }
      }, q.q), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: COLORS.danger,
          margin: "0 0 2px"
        }
      }, "\u3042\u306A\u305F\u306E\u7B54\u3048: ", q.yourAnswer >= 0 ? `${["①", "②", "③", "④"][q.yourAnswer]} ${q.choices?.[q.yourAnswer]}` : "未回答"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: COLORS.secondary,
          margin: "0 0 6px"
        }
      }, "\u6B63\u89E3: ", ["①", "②", "③", "④"][q.answer], " ", q.choices?.[q.answer]), q.explanation && /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 11,
          color: COLORS.textLight,
          lineHeight: 1.6,
          margin: 0
        }
      }, q.explanation));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setPhase("ready");
        setResult(null);
        setShowWrong(false);
      },
      style: {
        ...STYLES.btnPrimary,
        flex: 1,
        padding: 13
      }
    }, "\u3082\u3046\u4E00\u5EA6\u6311\u6226"), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        ...STYLES.btnOutline,
        flex: 1,
        padding: 13,
        borderRadius: 12
      }
    }, "\u30DB\u30FC\u30E0\u3078"))));
  }
  return null;
}
function PlaceholderTab({
  tab
}) {
  const Icon = tab.icon;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 16px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: tab.label,
    subtitle: "\u3053\u306E\u30BF\u30D6\u306F\u6E96\u5099\u4E2D\u3067\u3059",
    color: tab.color,
    icon: Icon
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.cardLg,
      textAlign: "center",
      padding: 40,
      color: COLORS.textLight
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 48,
    color: tab.color + "66",
    style: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 8
    }
  }, "\u30D5\u30A7\u30FC\u30BA3\u4EE5\u964D\u3067\u5B9F\u88C5\u4E88\u5B9A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "\u5185\u5BB9\uFF1A", tab.label, "\u306B\u95A2\u3059\u308B\u5B66\u7FD2\u30B3\u30F3\u30C6\u30F3\u30C4\u30FB\u96FB\u5353\u30FB\u30C6\u30B9\u30C8")));
}

// ============================================================
// ホーム画面（フェーズ6で詳細実装・ここは骨格のみ）
// ============================================================
// ============================================================
// フェーズ6: ホーム画面（完全実装）
// ============================================================

// 全クイズから計算問題のみ抽出してランダム出題
const ALL_CALC_QUIZZES = [...BASICS_QUIZZES.A.filter(q => q.isCalc), ...BASICS_QUIZZES.B.filter(q => q.isCalc), ...BASICS_QUIZZES.C.filter(q => q.isCalc), ...PORTFOLIO_QUIZZES.A.filter(q => q.isCalc), ...PORTFOLIO_QUIZZES.C.filter(q => q.isCalc), ...PRODUCTS_QUIZZES.A.filter(q => q.isCalc), ...PRODUCTS_QUIZZES.B.filter(q => q.isCalc)];

// 進捗リングSVG
function ProgressRing({
  pct,
  size = 72,
  stroke = 7,
  color = COLORS.primary
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct / 100 * circ;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: COLORS.border,
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeDasharray: `${dash} ${circ}`,
    strokeLinecap: "round",
    style: {
      transition: "stroke-dasharray 0.5s ease"
    }
  }));
}

// 計算正答率グラフデータ
function buildCalcChartData(testHistory) {
  const byKeyword = {};
  testHistory.filter(h => h.isCalc).forEach(h => {
    if (!byKeyword[h.keyword]) byKeyword[h.keyword] = {
      total: 0,
      correct: 0
    };
    byKeyword[h.keyword].total++;
    if (h.correct) byKeyword[h.keyword].correct++;
  });
  return Object.entries(byKeyword).map(([kw, {
    total,
    correct
  }]) => ({
    name: kw.length > 8 ? kw.slice(0, 8) + "…" : kw,
    rate: Math.round(correct / total * 100)
  })).sort((a, b) => a.rate - b.rate).slice(0, 6);
}
function HomeTab({
  state,
  setState,
  onTabChange
}) {
  const [calcQuiz, setCalcQuiz] = useState(() => {
    const picks = ALL_CALC_QUIZZES;
    return picks[Math.floor(Math.random() * picks.length)] ?? null;
  });
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [todayAnswered, setTodayAnswered] = useState(false);
  const [showMockExam, setShowMockExam] = useState(false);
  const daysLeft = (() => {
    if (!state.examDate) return null;
    const diff = new Date(state.examDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  // 章別進捗でリング表示を計算
  const _chapAll = computeAllChapProgress(state.progress, state.chapProgress);
  const totalSections = CHAPTERS_META.reduce((a, ch) => a + Object.keys(_chapAll[ch.id] ?? {}).length, 0);
  const doneSections = CHAPTERS_META.reduce((a, ch) => a + Object.values(_chapAll[ch.id] ?? {}).filter(Boolean).length, 0);
  const progressPct = totalSections > 0 ? Math.round(doneSections / totalSections * 100) : 0;
  const daysColor = daysLeft === null ? COLORS.primary : daysLeft <= 7 ? COLORS.danger : daysLeft <= 30 ? COLORS.accent : COLORS.secondary;
  const calcChartData = buildCalcChartData(state.testHistory);
  const refreshCalcQuiz = () => {
    const next = ALL_CALC_QUIZZES[Math.floor(Math.random() * ALL_CALC_QUIZZES.length)];
    setCalcQuiz(next);
    setTodayAnswered(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px 24px"
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    onNavigate: onTabChange
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, #2471b5 100%)`,
      borderRadius: 22,
      padding: "18px 20px",
      marginBottom: 12,
      color: "#fff",
      display: "flex",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      opacity: 0.8,
      marginBottom: 3
    }
  }, "\uD83D\uDCB9 \u8A66\u9A13\u52C9\u5F37\u30A2\u30D7\u30EA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 900,
      lineHeight: 1.35
    }
  }, "\u8CC7\u7523\u5F62\u6210\u30B3\u30F3\u30B5\u30EB\u30BF\u30F3\u30C8", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\uFF08ABC\uFF09\u8CC7\u683C\u8A66\u9A13")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      marginTop: 6,
      opacity: 0.75
    }
  }, "\u65E5\u672C\u8A3C\u5238\u30A2\u30CA\u30EA\u30B9\u30C8\u5354\u4F1A \uFF0F CBT\u65B9\u5F0F")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(ProgressRing, {
    pct: progressPct,
    size: 72,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 900
    }
  }, progressPct), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      opacity: 0.8
    }
  }, "%")))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Award, {
    size: 16,
    color: COLORS.accent
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: COLORS.text
    }
  }, "\u76EE\u6A19\u53D7\u9A13\u65E5"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: COLORS.textLight,
      marginLeft: "auto"
    }
  }, "CBT\u65B9\u5F0F\u30FB\u901A\u5E74\u53D7\u9A13")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: state.examDate,
    onChange: e => setState(s => ({
      ...s,
      examDate: e.target.value
    })),
    style: {
      ...STYLES.input,
      width: 155,
      fontSize: 13
    }
  }), daysLeft !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      background: daysColor + "18",
      border: `2px solid ${daysColor}`,
      borderRadius: 12,
      padding: "6px 14px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: daysColor,
      lineHeight: 1
    }
  }, daysLeft > 0 ? daysLeft : 0), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: daysColor,
      fontWeight: 700
    }
  }, daysLeft > 0 ? "日後" : "本日")), !state.examDate && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: COLORS.textLight
    }
  }, "\u65E5\u4ED8\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044")), daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "7px 10px",
      background: COLORS.accent + "12",
      borderRadius: 8,
      fontSize: 12,
      color: COLORS.accent,
      fontWeight: 600
    }
  }, "\u26A1 \u6B8B\u308A", daysLeft, "\u65E5\uFF011\u65E5\u3042\u305F\u308A", Math.ceil(40 / daysLeft * 10) / 10, "\u554F\u30DA\u30FC\u30B9\u3067\u6F14\u7FD2\u3092\uFF01")), (() => {
    const allChapProg = computeAllChapProgress(state.progress, state.chapProgress);
    const chapSections = CHAPTERS_META.map(ch => {
      const secs = allChapProg[ch.id] ?? {};
      const done = Object.values(secs).filter(Boolean).length;
      const all = Object.keys(secs).length;
      return {
        ...ch,
        secs,
        done,
        all
      };
    });
    const totalChapSecs = chapSections.reduce((a, c) => a + c.all, 0);
    const doneChapSecs = chapSections.reduce((a, c) => a + c.done, 0);
    const chapPct = totalChapSecs > 0 ? Math.round(doneChapSecs / totalChapSecs * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...STYLES.card,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(BarChart2, {
      size: 16,
      color: COLORS.primary
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        fontSize: 14,
        color: COLORS.text
      }
    }, "\u6559\u672C\u5225\u5B66\u7FD2\u9032\u6357")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: 600
      }
    }, doneChapSecs, "/", totalChapSecs, " \u5B8C\u4E86")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 8,
        background: COLORS.border,
        borderRadius: 8,
        marginBottom: 14,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${chapPct}%`,
        background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
        borderRadius: 8,
        transition: "width 0.5s ease"
      }
    })), chapSections.map((ch, idx) => {
      const isLast = idx === chapSections.length - 1;
      const pct = ch.all > 0 ? Math.round(ch.done / ch.all * 100) : 0;
      const allDone = ch.done === ch.all;
      return /*#__PURE__*/React.createElement("div", {
        key: ch.id,
        onClick: () => ch.tabId && onTabChange(ch.tabId),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 0",
          borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`,
          cursor: ch.tabId ? "pointer" : "default",
          opacity: ch.tabId ? 1 : 0.6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          minWidth: 44,
          height: 28,
          borderRadius: 8,
          background: ch.color + "20",
          border: `1.5px solid ${ch.color}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: 800,
          color: ch.color
        }
      }, ch.num)), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          color: COLORS.text,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "80%"
        }
      }, ch.title), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: allDone ? COLORS.secondary : COLORS.textLight,
          flexShrink: 0,
          marginLeft: 4
        }
      }, ch.done, "/", ch.all)), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 4,
          background: COLORS.border,
          borderRadius: 4,
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          width: `${pct}%`,
          background: allDone ? COLORS.secondary : ch.color,
          borderRadius: 4,
          transition: "width 0.4s ease"
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: COLORS.textMuted,
          marginTop: 2
        }
      }, ch.subtitle)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 3,
          flexShrink: 0
        }
      }, Object.entries(ch.secs).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          width: 14,
          height: 14,
          borderRadius: 4,
          background: v ? allDone ? COLORS.secondary : ch.color : COLORS.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }, v && /*#__PURE__*/React.createElement(Check, {
        size: 9,
        color: "#fff"
      })))), ch.tabId ? /*#__PURE__*/React.createElement(ChevronRight, {
        size: 13,
        color: COLORS.textMuted
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9,
          color: COLORS.textMuted,
          minWidth: 13
        }
      }, "Phase2\u2191"));
    }), calcChartData.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: COLORS.highlight,
        marginBottom: 8
      }
    }, "\u8A08\u7B97\u554F\u984C \u6B63\u7B54\u7387\uFF08\u82E6\u624B\u9806\uFF09"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%",
      height: 120
    }, /*#__PURE__*/React.createElement(BarChart, {
      data: calcChartData,
      margin: {
        top: 4,
        right: 4,
        left: -20,
        bottom: 0
      }
    }, /*#__PURE__*/React.createElement(XAxis, {
      dataKey: "name",
      tick: {
        fontSize: 10
      }
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: [0, 100],
      tick: {
        fontSize: 10
      }
    }), /*#__PURE__*/React.createElement(Tooltip, {
      formatter: v => `${v}%`
    }), /*#__PURE__*/React.createElement(Bar, {
      dataKey: "rate",
      fill: COLORS.highlight,
      radius: [4, 4, 0, 0]
    }), /*#__PURE__*/React.createElement(ReferenceLine, {
      y: 60,
      stroke: COLORS.danger,
      strokeDasharray: "4 2"
    })))), /*#__PURE__*/React.createElement("button", {
      style: {
        ...STYLES.btnOutline,
        width: "100%",
        marginTop: 12,
        fontSize: 12
      },
      onClick: () => {
        if (window.confirm("学習進捗・テスト履歴をすべてリセットしますか？")) {
          setState(INITIAL_STATE);
        }
      }
    }, /*#__PURE__*/React.createElement(RefreshCw, {
      size: 12,
      style: {
        marginRight: 5
      }
    }), " \u9032\u6357\u3092\u30EA\u30BB\u30C3\u30C8"));
  })(), showMockExam && /*#__PURE__*/React.createElement(MockExam, {
    state: state,
    setState: setState,
    onClose: () => setShowMockExam(false)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12,
      background: `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.highlight}12)`,
      border: `1.5px solid ${COLORS.primary}40`,
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 800,
      fontSize: 15,
      color: COLORS.primary,
      margin: "0 0 3px"
    }
  }, "\uD83D\uDCDD \u6A21\u64EC\u8A66\u9A13"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: COLORS.textLight,
      margin: 0
    }
  }, "40\u554F\u30FB60\u5206\u30FB4\u80A2\u629E\u4E00 \uFF0F 60\u70B9\u4EE5\u4E0A\u3067\u5408\u683C")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowMockExam(true),
    style: {
      ...STYLES.btnPrimary,
      padding: "10px 18px",
      flexShrink: 0,
      fontSize: 13
    }
  }, "\u958B\u59CB")), calcQuiz && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(MiniCalcCard, {
    quiz: calcQuiz,
    onAnswer: correct => {
      setTodayAnswered(true);
      setState(s => ({
        ...s,
        calcHistory: [...s.calcHistory, {
          date: new Date().toISOString(),
          formula: calcQuiz.keyword,
          correct,
          timeSpent: 0
        }]
      }));
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...STYLES.btnOutline,
      width: "100%",
      marginTop: 6,
      fontSize: 12
    },
    onClick: refreshCalcQuiz
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    size: 12,
    style: {
      marginRight: 5
    }
  }), " \u5225\u306E\u554F\u984C\u3092\u51FA\u3059")), /*#__PURE__*/React.createElement(AIReviewWidget, {
    state: state
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...STYLES.card,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowExamInfo(s => !s),
    style: {
      width: "100%",
      background: "none",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: 0,
      fontFamily: "'Noto Sans JP', sans-serif"
    }
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 16,
    color: COLORS.primary
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: COLORS.text,
      flex: 1,
      textAlign: "left"
    }
  }, "\u8A66\u9A13\u6982\u8981"), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 16,
    color: COLORS.textMuted,
    style: {
      transform: showExamInfo ? "rotate(90deg)" : "none",
      transition: "transform 0.2s"
    }
  })), showExamInfo && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, [["正式名称", "資産形成コンサルタント（ABC）資格試験"], ["主催", "日本証券アナリスト協会"], ["試験方式", "CBT（コンピュータ試験）・全国約300会場"], ["出題形式", "4肢択一・40問"], ["試験時間", "60分"], ["合格基準", "60点以上（100点満点換算）"], ["受験料", "9,900円（一般）"], ["受験資格", "特になし"], ["有効期限", "無期限（更新不要）"], ["難易度", "FP2〜1級レベル＋金融資産運用の深掘り"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      gap: 8,
      padding: "5px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.textLight,
      minWidth: 72,
      fontWeight: 600,
      fontSize: 12
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.text,
      fontSize: 13
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.textLight,
      marginBottom: 6
    }
  }, "\u51FA\u984C\u5206\u91CE\u3068\u6BD4\u7387\uFF08\u76EE\u5B89\uFF09"), [{
    label: "顧客本位・倫理",
    pct: 20,
    color: COLORS.secondary
  }, {
    label: "資産運用の基礎",
    pct: 25,
    color: COLORS.accent
  }, {
    label: "ポートフォリオ理論",
    pct: 25,
    color: COLORS.highlight
  }, {
    label: "金融商品",
    pct: 20,
    color: "#E67E22"
  }, {
    label: "ケーススタディ",
    pct: 10,
    color: "#16A085"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: COLORS.text,
      minWidth: 110
    }
  }, item.label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      background: COLORS.border,
      borderRadius: 6,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${item.pct * 4}%`,
      background: item.color,
      borderRadius: 6
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: item.color,
      fontWeight: 700,
      minWidth: 28
    }
  }, item.pct, "%")))))));
}

// ============================================================
// メインアプリ
// ============================================================
function ABCExamApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [state, setStateRaw] = useState(loadState);
  const setState = useCallback(updater => {
    setStateRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  // フォントロード
  useEffect(() => {
    if (!document.getElementById("noto-sans-jp")) {
      const link = document.createElement("link");
      link.id = "noto-sans-jp";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);
  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return /*#__PURE__*/React.createElement(HomeTab, {
          state: state,
          setState: setState,
          onTabChange: setActiveTab
        });
      case "ethics":
        return /*#__PURE__*/React.createElement(EthicsTab, {
          state: state,
          setState: setState
        });
      case "basics":
        return /*#__PURE__*/React.createElement(BasicsTab, {
          state: state,
          setState: setState
        });
      case "portfolio":
        return /*#__PURE__*/React.createElement(PortfolioTab, {
          state: state,
          setState: setState
        });
      case "products":
        return /*#__PURE__*/React.createElement(ProductsTab, {
          state: state,
          setState: setState
        });
      case "casestudy":
        return /*#__PURE__*/React.createElement(CaseStudyTab, {
          state: state,
          setState: setState
        });
      case "analysis":
        return /*#__PURE__*/React.createElement(AnalysisTab, {
          state: state,
          setState: setState
        });
      default:
        {
          const tab = TABS.find(t => t.id === activeTab);
          return tab ? /*#__PURE__*/React.createElement(PlaceholderTab, {
            tab: tab
          }) : null;
        }
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
      background: COLORS.bg,
      minHeight: "100vh",
      paddingBottom: 80,
      color: COLORS.text,
      maxWidth: 480,
      margin: "0 auto",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("main", null, renderTab()), /*#__PURE__*/React.createElement(NavigationBar, {
    activeTab: activeTab,
    onTabChange: setActiveTab
  }));
}

(function() {
  const container = document.getElementById('root');
  if (!container) { console.error('root element not found'); return; }
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(ABCExamApp));
})();
