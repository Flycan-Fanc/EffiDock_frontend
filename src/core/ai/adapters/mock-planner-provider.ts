import type {
  PlannerInput,
  PlannerProviderAdapter,
  PlannerSuggestion,
} from "@/core/ai/types";

function extractBacklogItems(backlogText: string) {
  return backlogText
    .split(/\r?\n|[;；]/)
    .map((line) => line.replace(/^[-*•\d.\s]+/, "").trim())
    .filter(Boolean);
}

function createEnglishSuggestion(goal: string, backlogItems: string[]): PlannerSuggestion {
  const itemCount = backlogItems.length;
  const firstItem = backlogItems[0] ?? "clarify the first actionable step";
  const secondItem = backlogItems[1] ?? "turn the clarified scope into a short execution list";

  return {
    provider: "mock",
    generatedAt: new Date().toISOString(),
    overview:
      itemCount === 0
        ? `Focus the next planning cycle on "${goal}" and clarify the first concrete outcome before expanding the scope.`
        : `Break "${goal}" into ${itemCount} actionable inputs, then move from definition to execution in short feedback loops.`,
    milestones: [
      `Clarify the target outcome for "${goal}" and align it with the immediate scope.`,
      `Convert the current notes into a small working plan, starting from "${firstItem}".`,
      `Review progress after shipping "${secondItem}" and decide the next iteration.`,
    ],
    nextActions:
      backlogItems.length === 0
        ? [
            "Write one sentence that defines the expected outcome.",
            "List the first three actions required to move the goal forward.",
            "Reserve a short focused block to execute the first action today.",
          ]
        : backlogItems.slice(0, 3).map((item, index) => `Action ${index + 1}: ${item}`),
    risks: [
      "The goal may stay too broad if the first deliverable is not explicitly defined.",
      "Execution may stall if the next action depends on unresolved external input.",
      backlogItems.length > 5
        ? "The backlog looks dense. Trim it to the highest-leverage items first."
        : "Keep the plan lightweight so the first review happens before the context goes stale.",
    ],
  };
}

function createChineseSuggestion(goal: string, backlogItems: string[]): PlannerSuggestion {
  const itemCount = backlogItems.length;
  const firstItem = backlogItems[0] ?? "先明确第一步可执行动作";
  const secondItem = backlogItems[1] ?? "把目标收敛成一个短执行清单";

  return {
    provider: "mock",
    generatedAt: new Date().toISOString(),
    overview:
      itemCount === 0
        ? `先围绕“${goal}”收敛出一个清晰结果，再继续展开更完整的计划。`
        : `把“${goal}”拆成 ${itemCount} 个可执行输入，再用短反馈循环推进落地。`,
    milestones: [
      `明确“${goal}”当前阶段真正要交付的结果。`,
      `把现有笔记整理成小步执行计划，并从“${firstItem}”开始。`,
      `完成“${secondItem}”后立即回看结果，决定下一轮迭代。`,
    ],
    nextActions:
      backlogItems.length === 0
        ? [
            "用一句话写清楚这次规划想达成的结果。",
            "列出推动目标前进的前三个动作。",
            "今天预留一个短专注时段，先执行第一步。",
          ]
        : backlogItems.slice(0, 3).map((item, index) => `动作 ${index + 1}：${item}`),
    risks: [
      "如果第一阶段交付物不够明确，目标很容易继续发散。",
      "如果下一步依赖外部信息但没有提前确认，执行会卡住。",
      backlogItems.length > 5
        ? "当前待办较多，建议先缩到最高杠杆的几项。"
        : "保持计划轻量，避免在第一次回看前上下文已经过期。",
    ],
  };
}

function createJapaneseSuggestion(goal: string, backlogItems: string[]): PlannerSuggestion {
  const itemCount = backlogItems.length;
  const firstItem = backlogItems[0] ?? "最初の実行可能な一歩を明確にする";
  const secondItem = backlogItems[1] ?? "短い実行リストに落とし込む";

  return {
    provider: "mock",
    generatedAt: new Date().toISOString(),
    overview:
      itemCount === 0
        ? `まず「${goal}」の具体的な到達点を一つ明確にし、その後で計画を広げてください。`
        : `「${goal}」を ${itemCount} 個の実行入力に分解し、短いフィードバックループで前進してください。`,
    milestones: [
      `「${goal}」の現段階での成果物を明確にする。`,
      `現在のメモを小さな実行計画に整理し、「${firstItem}」から着手する。`,
      `「${secondItem}」を終えたら結果を見直し、次の反復を決める。`,
    ],
    nextActions:
      backlogItems.length === 0
        ? [
            "今回の計画で達成したい結果を一文で定義する。",
            "前進に必要な最初の 3 アクションを書き出す。",
            "今日の短い集中時間を確保して最初の一歩を実行する。",
          ]
        : backlogItems.slice(0, 3).map((item, index) => `アクション ${index + 1}: ${item}`),
    risks: [
      "最初の成果物が曖昧だと、目標が広がりすぎる可能性があります。",
      "次の一歩が未解決の外部依存に左右されると、実行が止まりやすくなります。",
      backlogItems.length > 5
        ? "現在のバックログは多めです。影響の大きい項目から先に絞ると安定します。"
        : "最初の見直しまでに文脈が古くならないよう、計画は軽く保ってください。",
    ],
  };
}

function createSuggestion(input: PlannerInput): PlannerSuggestion {
  const backlogItems = extractBacklogItems(input.backlogText);

  if (input.locale === "zh-CN") {
    return createChineseSuggestion(input.goal, backlogItems);
  }

  if (input.locale === "ja-JP") {
    return createJapaneseSuggestion(input.goal, backlogItems);
  }

  return createEnglishSuggestion(input.goal, backlogItems);
}

export const mockPlannerProvider: PlannerProviderAdapter = {
  id: "mock",
  async generateSuggestion(input: PlannerInput) {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    return createSuggestion(input);
  },
};
