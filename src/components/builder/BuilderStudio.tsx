"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DiagnosisCompiler } from "@/components/diagnosis/DiagnosisCompiler";
import {
  saveBuilderDiagnosisRemote,
  listCreatorBuilderRecords,
  unpublishBuilderDiagnosisRemote,
} from "@/lib/builder/builderApiClient";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import { readStoredUserId } from "@/lib/user/readStoredUserId";
import {
  createDefaultBuilderDraft,
  deleteBuilderDraft,
  listBuilderDrafts,
  loadBuilderDraft,
  saveBuilderDraft,
  type BuilderDraftRecord,
} from "@/lib/builder/builderDraftStorage";
import { validateBuilderDefinition } from "@/lib/builder/convertBuilderToPlugDefinition";
import {
  applyFrameworkTemplate,
  FRAMEWORK_TEMPLATES,
} from "@/lib/builder/frameworkRegistry";
import { PSYCH_FRAMEWORK_IDS, type PsychFrameworkId } from "@/lib/diagnosis/scoring";
import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import type {
  BuilderBlock,
  BuilderDiagnosisDefinition,
  ConversationalQuestionBlock,
  OceanTraitKey,
} from "@/types/builder";
import { isConversationalQuestionBlock, OCEAN_TRAIT_KEYS } from "@/types/builder";
import type { ResultLayoutKind } from "@/types/diagnosisCompiler";
import styles from "./builderStudio.module.css";

type StudioMode = "edit" | "preview";
type EditorTab = "blocks" | "results";

const OCEAN_LABELS: Readonly<Record<OceanTraitKey, string>> = {
  openness: "開放性",
  conscientiousness: "誠実性",
  extraversion: "外向性",
  agreeableness: "協調性",
  neuroticism: "感情変動",
};

const LAYOUT_LABELS: Readonly<Record<ResultLayoutKind, string>> = {
  full_affirmation_chart: "5因子チャート",
  character_archetype_card: "キャラクター型",
  compatibility_radar: "相性レーダー",
};

const BuilderStudio = () => {
  const [drafts, setDrafts] = useState<BuilderDraftRecord[]>([]);
  const [definition, setDefinition] = useState<BuilderDiagnosisDefinition>(
    createDefaultBuilderDraft(),
  );
  const [mode, setMode] = useState<StudioMode>("edit");
  const [editorTab, setEditorTab] = useState<EditorTab>("blocks");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("q-1");
  const [dragBlockId, setDragBlockId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const creatorId = useMemo(() => readStoredUserId(), []);

  useEffect(() => {
    const bootstrap = async () => {
      const localDrafts = listBuilderDrafts();
      const remoteRecords = await listCreatorBuilderRecords(creatorId);
      const remoteDrafts = remoteRecords.map((record) => ({
        id: record.id,
        title: record.definition.title,
        slug: record.definition.slug,
        updatedAt: record.updatedAt,
        definition: record.definition,
      }));

      const merged = [...remoteDrafts, ...localDrafts].reduce<BuilderDraftRecord[]>(
        (accumulator, draft) => {
          if (accumulator.some((entry) => entry.id === draft.id)) {
            return accumulator;
          }

          return [...accumulator, draft];
        },
        [],
      );

      if (merged.length > 0) {
        setDrafts(merged);
        setDefinition(merged[0]!.definition);
        setSelectedBlockId(merged[0]!.definition.startBlockId);
        return;
      }

      const initial = saveBuilderDraft(createDefaultBuilderDraft());
      setDrafts([initial]);
    };

    void bootstrap();
  }, [creatorId]);

  const validationErrors = useMemo(
    () => validateBuilderDefinition(definition),
    [definition],
  );

  const selectedBlock = definition.blocks.find((block) => block.id === selectedBlockId);

  const updateDefinition = useCallback(
    (updater: (current: BuilderDiagnosisDefinition) => BuilderDiagnosisDefinition) => {
      setDefinition((current) => updater(current));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const saved = saveBuilderDraft(definition);
    setDrafts(listBuilderDrafts());

    try {
      await saveBuilderDiagnosisRemote({
        definition,
        status: "draft",
        creatorId,
      });
      setSyncMessage("クラウドに保存しました");
    } catch (error) {
      setSyncMessage(
        error instanceof Error ? error.message : "クラウド保存に失敗しました",
      );
    }

    trackDiagnosisEvent("builder_draft_saved", {
      slug: saved.slug,
      blockCount: String(definition.blocks.length),
    });
  }, [creatorId, definition]);

  const handlePublish = useCallback(async () => {
    if (validationErrors.length > 0) {
      return;
    }

    saveBuilderDraft(definition);

    try {
      const record = await saveBuilderDiagnosisRemote({
        definition,
        status: "published",
        creatorId,
      });
      setSyncMessage(`公開しました: /diagnosis/play/${record.slug}`);
      trackDiagnosisEvent("builder_draft_saved", {
        slug: record.slug,
        status: "published",
      });
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "公開に失敗しました");
    }
  }, [creatorId, definition, validationErrors.length]);

  const handleUnpublish = useCallback(async () => {
    try {
      const record = await unpublishBuilderDiagnosisRemote({
        recordId: definition.id,
        creatorId,
      });
      setSyncMessage(`非公開にしました: ${record.slug}`);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "非公開に失敗しました");
    }
  }, [creatorId, definition.id]);

  const reorderBlock = useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId === targetId) {
        return;
      }

      updateDefinition((current) => {
        const sourceIndex = current.blocks.findIndex((block) => block.id === sourceId);
        const targetIndex = current.blocks.findIndex((block) => block.id === targetId);

        if (sourceIndex < 0 || targetIndex < 0) {
          return current;
        }

        const blocks = [...current.blocks];
        const [moved] = blocks.splice(sourceIndex, 1);
        blocks.splice(targetIndex, 0, moved!);

        return { ...current, blocks };
      });
    },
    [updateDefinition],
  );

  const moveSelectedBlock = useCallback(
    (direction: -1 | 1) => {
      if (!selectedBlockId) {
        return;
      }

      updateDefinition((current) => {
        const index = current.blocks.findIndex((block) => block.id === selectedBlockId);

        if (index < 0) {
          return current;
        }

        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= current.blocks.length) {
          return current;
        }

        const blocks = [...current.blocks];
        const [moved] = blocks.splice(index, 1);
        blocks.splice(targetIndex, 0, moved!);

        return { ...current, blocks };
      });
    },
    [selectedBlockId, updateDefinition],
  );

  const handleNewDraft = useCallback(() => {
    const draft = saveBuilderDraft(createDefaultBuilderDraft());
    setDrafts(listBuilderDrafts());
    setDefinition(draft.definition);
    setSelectedBlockId(draft.definition.startBlockId);
    setMode("edit");
  }, []);

  const handleLoadDraft = useCallback((id: string) => {
    const record = loadBuilderDraft(id);

    if (!record) {
      return;
    }

    setDefinition(record.definition);
    setSelectedBlockId(record.definition.startBlockId);
    setMode("edit");
  }, []);

  const handleDeleteDraft = useCallback((id: string) => {
    deleteBuilderDraft(id);
    const nextDrafts = listBuilderDrafts();
    setDrafts(nextDrafts);

    if (nextDrafts[0]) {
      setDefinition(nextDrafts[0].definition);
      setSelectedBlockId(nextDrafts[0].definition.startBlockId);
    } else {
      const fresh = saveBuilderDraft(createDefaultBuilderDraft());
      setDrafts([fresh]);
      setDefinition(fresh.definition);
      setSelectedBlockId(fresh.definition.startBlockId);
    }
  }, []);

  const handleAddQuestion = useCallback(() => {
    updateDefinition((current) => {
      const id = `q-${crypto.randomUUID().slice(0, 6)}`;
      const block: ConversationalQuestionBlock = {
        type: "CONVERSATIONAL_QUESTION",
        id,
        prompt: "新しい質問",
        choices: [
          { id: `${id}-a`, label: "選択肢A", scores: { openness: 0.3 } },
          { id: `${id}-b`, label: "選択肢B", scores: { conscientiousness: 0.3 } },
        ],
      };

      setSelectedBlockId(id);

      return {
        ...current,
        blocks: [...current.blocks, block],
      };
    });
  }, [updateDefinition]);

  const handleAddFeedback = useCallback(() => {
    const questionBlocks = definition.blocks.filter(isConversationalQuestionBlock);
    const trigger =
      questionBlocks[questionBlocks.length - 1]?.id ?? definition.startBlockId;
    const id = `fb-${crypto.randomUUID().slice(0, 6)}`;

    updateDefinition((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        {
          type: "AI_INTERMEDIATE_FEEDBACK",
          id,
          triggerAfterBlockId: trigger,
          affirmationTemplate: "「{choice}」— 素敵な選択ですね ✨",
          autoAdvanceMs: 2400,
        },
      ],
    }));

    setSelectedBlockId(id);
  }, [definition.blocks, definition.startBlockId, updateDefinition]);

  const handleAddBranch = useCallback(() => {
    const questionBlocks = definition.blocks.filter(isConversationalQuestionBlock);
    const after =
      questionBlocks[questionBlocks.length - 1]?.id ?? definition.startBlockId;
    const nextQuestion = questionBlocks[0]?.id ?? definition.startBlockId;
    const id = `br-${crypto.randomUUID().slice(0, 6)}`;

    updateDefinition((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        {
          type: "CONDITIONAL_BRANCH",
          id,
          afterBlockId: after,
          rules: [],
          defaultGotoBlockId: nextQuestion,
        },
      ],
    }));

    setSelectedBlockId(id);
  }, [definition.blocks, definition.startBlockId, updateDefinition]);

  const handlePreview = useCallback(() => {
    if (validationErrors.length > 0) {
      return;
    }

    trackDiagnosisEvent("builder_preview_started", {
      slug: definition.slug,
    });
    setMode("preview");
  }, [definition.slug, validationErrors.length]);

  const updateQuestionBlock = (
    blockId: string,
    patch: Partial<ConversationalQuestionBlock>,
  ) => {
    updateDefinition((current) => ({
      ...current,
      blocks: current.blocks.map((block) => {
        if (block.id !== blockId || block.type !== "CONVERSATIONAL_QUESTION") {
          return block;
        }

        return { ...block, ...patch };
      }),
    }));
  };

  if (mode === "preview") {
    return (
      <div className={styles.previewShell}>
        <div className={styles.previewToolbar}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setMode("edit")}
          >
            編集に戻る
          </button>
        </div>
        <DiagnosisCompiler builderDefinition={definition} />
      </div>
    );
  }

  return (
    <div className={styles.studio}>
      <aside className={styles.sidebar} aria-label="Builder drafts">
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>ドラフト</h2>
          <button type="button" className={styles.iconButton} onClick={handleNewDraft}>
            ＋
          </button>
        </div>
        <ul className={styles.draftList}>
          {drafts.map((draft) => (
            <li key={draft.id}>
              <button
                type="button"
                className={
                  draft.id === definition.id
                    ? styles.draftButtonActive
                    : styles.draftButton
                }
                onClick={() => handleLoadDraft(draft.id)}
              >
                {draft.title || "無題"}
              </button>
              <button
                type="button"
                className={styles.draftDelete}
                aria-label={`${draft.title}を削除`}
                onClick={() => handleDeleteDraft(draft.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>No-Code Builder</p>
            <h1 className={styles.title}>会話型診断エディタ</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => void handleSave()}
            >
              保存
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => void handlePublish()}
              disabled={validationErrors.length > 0}
            >
              公開
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => void handleUnpublish()}
            >
              非公開
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handlePreview}
              disabled={validationErrors.length > 0}
            >
              プレビュー再生
            </button>
          </div>
        </header>

        {syncMessage ? <p className={styles.syncMessage}>{syncMessage}</p> : null}

        <div className={styles.tabBar} role="tablist" aria-label="エディタタブ">
          <button
            type="button"
            role="tab"
            aria-selected={editorTab === "blocks"}
            className={editorTab === "blocks" ? styles.tabActive : styles.tab}
            onClick={() => setEditorTab("blocks")}
          >
            ブロック
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={editorTab === "results"}
            className={editorTab === "results" ? styles.tabActive : styles.tab}
            onClick={() => setEditorTab("results")}
          >
            結果タイプ
          </button>
        </div>

        {validationErrors.length > 0 ? (
          <div className={styles.validationBox} role="alert">
            {validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}

        <section className={styles.metaSection}>
          <label className={styles.field}>
            診断タイトル
            <input
              className={styles.input}
              value={definition.title}
              onChange={(event) =>
                updateDefinition((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </label>
          <label className={styles.field}>
            スラッグ
            <input
              className={styles.input}
              value={definition.slug}
              onChange={(event) =>
                updateDefinition((current) => ({
                  ...current,
                  slug: event.target.value,
                }))
              }
            />
          </label>
          <label className={styles.field}>
            スコアリングフレームワーク
            <select
              className={styles.input}
              value={definition.frameworkId ?? "ocean"}
              onChange={(event) => {
                const next = event.target.value as PsychFrameworkId;
                updateDefinition((current) => applyFrameworkTemplate(current, next));
              }}
            >
              {PSYCH_FRAMEWORK_IDS.map((id) => (
                <option key={id} value={id}>
                  {FRAMEWORK_TEMPLATES[id].label}
                </option>
              ))}
            </select>
            <span className={styles.fieldHint}>
              {FRAMEWORK_TEMPLATES[definition.frameworkId ?? "ocean"].description}
            </span>
          </label>
        </section>

        {editorTab === "blocks" ? (
          <section className={styles.blocksSection}>
            <div className={styles.blocksToolbar}>
              <h2 className={styles.sectionTitle}>ブロック</h2>
              <div className={styles.blocksToolbarActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => moveSelectedBlock(-1)}
                >
                  ↑ 上へ
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => moveSelectedBlock(1)}
                >
                  ↓ 下へ
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleAddQuestion}
                >
                  質問を追加
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleAddFeedback}
                >
                  AIフィードバック
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleAddBranch}
                >
                  分岐
                </button>
              </div>
            </div>

            <ul className={styles.blockList} role="list">
              {definition.blocks.map((block: BuilderBlock) => (
                <li
                  key={block.id}
                  draggable
                  onDragStart={() => setDragBlockId(block.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragBlockId) {
                      reorderBlock(dragBlockId, block.id);
                    }
                    setDragBlockId(null);
                  }}
                >
                  <button
                    type="button"
                    className={
                      block.id === selectedBlockId
                        ? styles.blockChipActive
                        : styles.blockChip
                    }
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    {block.type === "CONVERSATIONAL_QUESTION"
                      ? `Q: ${block.prompt.slice(0, 18)}`
                      : block.type === "AI_INTERMEDIATE_FEEDBACK"
                        ? "AIフィードバック"
                        : "分岐"}
                  </button>
                </li>
              ))}
            </ul>

            {selectedBlock?.type === "CONVERSATIONAL_QUESTION" ? (
              <div className={styles.blockEditor}>
                <label className={styles.field}>
                  質問文
                  <textarea
                    className={styles.textarea}
                    value={selectedBlock.prompt}
                    onChange={(event) =>
                      updateQuestionBlock(selectedBlock.id, {
                        prompt: event.target.value,
                      })
                    }
                  />
                </label>
                {selectedBlock.choices.map((choice, index) => (
                  <div key={choice.id} className={styles.choiceEditor}>
                    <label className={styles.field}>
                      選択肢 {index + 1}
                      <input
                        className={styles.input}
                        value={choice.label}
                        onChange={(event) =>
                          updateDefinition((current) => ({
                            ...current,
                            blocks: current.blocks.map((block) => {
                              if (
                                block.id !== selectedBlock.id ||
                                block.type !== "CONVERSATIONAL_QUESTION"
                              ) {
                                return block;
                              }

                              return {
                                ...block,
                                choices: block.choices.map((entry) =>
                                  entry.id === choice.id
                                    ? { ...entry, label: event.target.value }
                                    : entry,
                                ),
                              };
                            }),
                          }))
                        }
                      />
                    </label>
                    <fieldset className={styles.scoreFieldset}>
                      <legend className={styles.scoreLegend}>OCEAN 重み</legend>
                      {OCEAN_TRAIT_KEYS.map((traitKey) => (
                        <label key={traitKey} className={styles.scoreRow}>
                          <span>{OCEAN_LABELS[traitKey]}</span>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={choice.scores[traitKey] ?? 0}
                            onChange={(event) => {
                              const value = Number.parseFloat(event.target.value);
                              updateDefinition((current) => ({
                                ...current,
                                blocks: current.blocks.map((block) => {
                                  if (
                                    block.id !== selectedBlock.id ||
                                    block.type !== "CONVERSATIONAL_QUESTION"
                                  ) {
                                    return block;
                                  }

                                  return {
                                    ...block,
                                    choices: block.choices.map((entry) =>
                                      entry.id === choice.id
                                        ? {
                                            ...entry,
                                            scores: {
                                              ...entry.scores,
                                              [traitKey]: value,
                                            },
                                          }
                                        : entry,
                                    ),
                                  };
                                }),
                              }));
                            }}
                          />
                          <span className={styles.scoreValue}>
                            {(choice.scores[traitKey] ?? 0).toFixed(2)}
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  </div>
                ))}
              </div>
            ) : null}

            {selectedBlock?.type === "AI_INTERMEDIATE_FEEDBACK" ? (
              <div className={styles.blockEditor}>
                <label className={styles.field}>
                  肯定メッセージ（{"{choice}"} で選択肢を挿入）
                  <textarea
                    className={styles.textarea}
                    value={selectedBlock.affirmationTemplate}
                    onChange={(event) =>
                      updateDefinition((current) => ({
                        ...current,
                        blocks: current.blocks.map((block) =>
                          block.id === selectedBlock.id &&
                          block.type === "AI_INTERMEDIATE_FEEDBACK"
                            ? { ...block, affirmationTemplate: event.target.value }
                            : block,
                        ),
                      }))
                    }
                  />
                </label>
              </div>
            ) : null}

            {selectedBlock?.type === "CONDITIONAL_BRANCH" ? (
              <div className={styles.blockEditor}>
                <label className={styles.field}>
                  分岐元ブロック ID
                  <input
                    className={styles.input}
                    value={selectedBlock.afterBlockId}
                    onChange={(event) =>
                      updateDefinition((current) => ({
                        ...current,
                        blocks: current.blocks.map((block) =>
                          block.id === selectedBlock.id &&
                          block.type === "CONDITIONAL_BRANCH"
                            ? { ...block, afterBlockId: event.target.value }
                            : block,
                        ),
                      }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  デフォルト遷移先ブロック ID
                  <input
                    className={styles.input}
                    value={selectedBlock.defaultGotoBlockId}
                    onChange={(event) =>
                      updateDefinition((current) => ({
                        ...current,
                        blocks: current.blocks.map((block) =>
                          block.id === selectedBlock.id &&
                          block.type === "CONDITIONAL_BRANCH"
                            ? { ...block, defaultGotoBlockId: event.target.value }
                            : block,
                        ),
                      }))
                    }
                  />
                </label>
              </div>
            ) : null}
          </section>
        ) : (
          <section className={styles.blocksSection}>
            <h2 className={styles.sectionTitle}>結果タイプ</h2>
            <label className={styles.field}>
              結果レイアウト
              <select
                className={styles.input}
                value={definition.resultConfig.layout}
                onChange={(event) =>
                  updateDefinition((current) => ({
                    ...current,
                    resultConfig: {
                      ...current.resultConfig,
                      layout: event.target.value as ResultLayoutKind,
                    },
                  }))
                }
              >
                {(Object.keys(LAYOUT_LABELS) as ResultLayoutKind[]).map((layout) => (
                  <option key={layout} value={layout}>
                    {LAYOUT_LABELS[layout]}
                  </option>
                ))}
              </select>
            </label>
            {definition.resultConfig.results.map((result, index) => (
              <div key={result.id} className={styles.blockEditor}>
                <p className={styles.resultIndex}>タイプ {index + 1}</p>
                <label className={styles.field}>
                  タイトル
                  <input
                    className={styles.input}
                    value={result.title}
                    onChange={(event) =>
                      updateDefinition((current) => ({
                        ...current,
                        resultConfig: {
                          ...current.resultConfig,
                          results: current.resultConfig.results.map((entry) =>
                            entry.id === result.id
                              ? { ...entry, title: event.target.value }
                              : entry,
                          ),
                        },
                      }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  サブタイトル
                  <input
                    className={styles.input}
                    value={result.subtitle}
                    onChange={(event) =>
                      updateDefinition((current) => ({
                        ...current,
                        resultConfig: {
                          ...current.resultConfig,
                          results: current.resultConfig.results.map((entry) =>
                            entry.id === result.id
                              ? { ...entry, subtitle: event.target.value }
                              : entry,
                          ),
                        },
                      }))
                    }
                  />
                </label>
                <label className={styles.field}>
                  分析文
                  <textarea
                    className={styles.textarea}
                    value={result.analysis}
                    onChange={(event) =>
                      updateDefinition((current) => ({
                        ...current,
                        resultConfig: {
                          ...current.resultConfig,
                          results: current.resultConfig.results.map((entry) =>
                            entry.id === result.id
                              ? { ...entry, analysis: event.target.value }
                              : entry,
                          ),
                        },
                      }))
                    }
                  />
                </label>
                {index === 0 ? (
                  <fieldset className={styles.scoreFieldset}>
                    <legend className={styles.scoreLegend}>
                      アーキタイプ traitProfile
                    </legend>
                    {LEGAL_TRAIT_KEYS.map((traitKey) => (
                      <label key={traitKey} className={styles.scoreRow}>
                        <span>{traitKey.replace("trait_", "")}</span>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={result.traitProfile[traitKey] ?? 0}
                          onChange={(event) => {
                            const value = Number.parseFloat(event.target.value);
                            updateDefinition((current) => ({
                              ...current,
                              resultConfig: {
                                ...current.resultConfig,
                                results: current.resultConfig.results.map((entry) =>
                                  entry.id === result.id
                                    ? {
                                        ...entry,
                                        traitProfile: {
                                          ...entry.traitProfile,
                                          [traitKey]: value,
                                        },
                                      }
                                    : entry,
                                ),
                              },
                            }));
                          }}
                        />
                        <span className={styles.scoreValue}>
                          {(result.traitProfile[traitKey] ?? 0).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                ) : null}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export { BuilderStudio };
