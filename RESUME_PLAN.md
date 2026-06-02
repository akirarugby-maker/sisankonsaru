# 実装再開計画: 苦手問題登録 + 60%ゲート撤廃

## 概要
- 確認テストで60点未満でも次のセクションに進めるようにする
- 間違えた問題を `weakQuestions` に保存し、各タブの先頭に表示する

## 変更箇所（すべて abc-exam-app.jsx）

### 1. INITIAL_STATE（line 181付近）
```js
const INITIAL_STATE = {
  examDate: "", progress: INITIAL_PROGRESS, chapProgress: INITIAL_CHAP_PROGRESS,
  visitedSections: INITIAL_VISITED, testHistory: [], calcHistory: [], reviewStatus: {},
  weakQuestions: {},   // ← 追加
};
```

### 2. loadState（line 193付近）
```js
return {
  ...INITIAL_STATE, ...saved,
  progress:        { ...INITIAL_PROGRESS,      ...saved.progress },
  chapProgress:    { ...INITIAL_CHAP_PROGRESS, ...saved.chapProgress },
  visitedSections: { ... },
  weakQuestions:   { ...(saved.weakQuestions ?? {}) },  // ← 追加
};
```

### 3. QuizComponent handleNext（line 3144付近）
- 60%ゲートを撤廃 → 常に progress を true にセット
- 間違えた問題を weakQuestions に保存
```js
const handleNext = () => {
  if (idx + 1 >= quizzes.length) {
    setFinished(true);
    const lastCorrect = selected === q.answer;
    const fullHistory = [...history, { correct: lastCorrect }];
    const wrongQuizzes = quizzes.filter((_, qi) => !fullHistory[qi]?.correct);
    const key = `${tabId}-${sectionId}`;
    setState((s) => ({
      ...s,
      [progressField]: {
        ...s[progressField],
        [tabId]: { ...(s[progressField]?.[tabId] ?? {}), [sectionId]: true },
      },
      testHistory: [ ...s.testHistory, ...quizzes.map((quiz, qi) => ({
        date: new Date().toISOString(), tab: tabId, section: sectionId,
        question: quiz.id, correct: fullHistory[qi]?.correct ?? false,
        keyword: quiz.keyword, isCalc: !!quiz.isCalc,
      }))],
      weakQuestions: {
        ...s.weakQuestions,
        [key]: wrongQuizzes.length > 0 ? wrongQuizzes : null,
      },
    }));
    return;
  }
  setIdx((i) => i + 1); setSelected(null); setAnswered(false);
};
```

### 4. 完了画面（line 3252付近）
- `passed &&` 条件を削除して常に「次のセクションへ」ボタンを表示
- バッジを「60点以上でクリア」から「再挑戦で苦手を克服！」に変更（60%未満時）

### 5. WeakQuestionsPanel 新規コンポーネント（MiniCalcCardの直前に追加）
```jsx
function WeakQuestionsPanel({ tabId, state, setState, color }) {
  const [open, setOpen] = useState(false);
  const [retryIdx, setRetryIdx] = useState(null); // 再出題中のキー

  const weakEntries = Object.entries(state.weakQuestions || {})
    .filter(([key, qs]) => key.startsWith(tabId + '-') && qs?.length > 0);

  if (weakEntries.length === 0) return null;

  const totalWeak = weakEntries.reduce((a, [, qs]) => a + qs.length, 0);

  const clearWeak = (key) => {
    setState(s => ({ ...s, weakQuestions: { ...s.weakQuestions, [key]: null } }));
  };

  return (
    <div style={{ ...STYLES.card, marginBottom: 12, border: `1.5px solid ${COLORS.danger}44` }}>
      <button
        onClick={() => setOpen(s => !s)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, padding: 0, fontFamily: "inherit" }}
      >
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span style={{ fontWeight: 800, fontSize: 14, color: COLORS.danger, flex: 1, textAlign: "left" }}>
          苦手問題 {totalWeak}問
        </span>
        <span style={{ fontSize: 11, color: COLORS.textMuted }}>
          {open ? "▲ 閉じる" : "▼ 確認する"}
        </span>
      </button>

      {open && weakEntries.map(([key, quizzes]) => {
        const sec = key.split('-')[1];
        return (
          <div key={key} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ ...STYLES.badge(COLORS.danger), fontSize: 11 }}>
                {sec}セクション
              </span>
              <span style={{ fontSize: 11, color: COLORS.textMuted, flex: 1 }}>
                {quizzes.length}問
              </span>
              <button
                onClick={() => clearWeak(key)}
                style={{ fontSize: 10, color: COLORS.textMuted, background: "none", border: "none",
                  cursor: "pointer", textDecoration: "underline" }}
              >
                クリア
              </button>
            </div>
            {quizzes.map((q, i) => (
              <div key={i} style={{ padding: "8px 10px", background: COLORS.danger + "08",
                border: `1px solid ${COLORS.danger}22`, borderRadius: 12, marginBottom: 6, fontSize: 12 }}>
                <div style={{ color: COLORS.danger, fontWeight: 700, marginBottom: 4 }}>✗ {q.keyword}</div>
                <div style={{ color: COLORS.text, lineHeight: 1.6 }}>{q.q}</div>
                <div style={{ marginTop: 6, padding: "6px 8px", background: COLORS.secondary + "12",
                  borderRadius: 8, fontSize: 11, color: COLORS.text }}>
                  ✅ 正解: {["①","②","③","④"][q.answer]} {q.choices[q.answer]}
                </div>
                {q.explanation && (
                  <div style={{ marginTop: 4, fontSize: 11, color: COLORS.textLight, lineHeight: 1.5 }}>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

### 6. 各タブに WeakQuestionsPanel を追加
EthicsTab, BasicsTab, PortfolioTab, ProductsTab の return 内、PageHeader の直後に:
```jsx
<WeakQuestionsPanel tabId="ethics" state={state} setState={setState} color={color} />
<WeakQuestionsPanel tabId="basics" state={state} setState={setState} color={color} />
<WeakQuestionsPanel tabId="portfolio" state={state} setState={setState} color={color} />
<WeakQuestionsPanel tabId="products" state={state} setState={setState} color={color} />
```
※ chapProgress を使う ch1/ch2/ch6/supp2 のキーも tabId="ch1" 等になるため、
  EthicsTab では tabId="ethics|ch1|ch2" を全部確認する必要あり。
  → WeakQuestionsPanel に tabIds（配列）を渡す形に変更:
  ```jsx
  <WeakQuestionsPanel tabIds={["ethics","ch1","ch2"]} ... />
  ```
  フィルタを `.filter(([key]) => tabIds.some(t => key.startsWith(t + '-')))` に変更。
