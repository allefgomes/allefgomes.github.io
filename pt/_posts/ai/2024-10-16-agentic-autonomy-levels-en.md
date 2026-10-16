---
layout: post
title: "Agentic Autonomy Levels: From Suggestions to Orchestration"
date: 2026-10-16 00:00:00 +0000
description: Understand the 6 levels of AI agent autonomy, from basic assistance to full orchestration
img: ai/agentic-autonomy.png
tags: [AI, Agents, Autonomy, LLM]
---

## Introduction

AI agents aren't one-size-fits-all. There are different degrees of autonomy, and you need to understand which level your task actually needs. Based on [Addy Osmani's](https://addyosmani.com/blog/agentic-autonomy-levels) work, here are the 6 levels.

---

## Level 0: Assist

The agent **suggests**. You always decide.

- ✓ Generally good suggestions, but you choose whether to use them
- ✓ Autocomplete, inline suggestions in the editor
- ✓ No automatic execution

**In practice:**
1. You describe the change you need
2. The agent proposes a solution
3. You approve or reject it

**Example:** An LLM suggesting code completions as you type.

---

## Level 1: Supervised Action

The agent **edits or executes, but asks for approval**.

- ✓ The agent takes actions on your behalf
- ✓ Always asks for approval before consequential changes
- ✓ The current standard for most people

**In practice:**
1. You send a prompt: "Refactor this function"
2. The agent generates refactored code
3. You review and approve
4. The agent executes the commit

**Example:** OpenCode generating tests and asking for confirmation before pushing.

---

## Level 2: Scoped Task Delegation

A **limited task with clear objectives**.

- ✓ You delegate with well-defined constraints
- ✓ Agent works autonomously within those bounds
- ✓ Delivers with proof of completion
- ✓ Heart of AI-assisted engineering

**In practice:**
1. You delegate: "Add tests with 90% coverage for module X"
2. The agent creates tests and runs coverage
3. Proof: tests pass, coverage validated
4. You validate and integrate (or request adjustments)

**Example:** An agent that automatically implements tests until coverage target is reached.

---

## Level 3: Goal-Driven Autonomy

The agent does **whatever it takes to reach the goal**.

- ✓ You define the objective (e.g., "Reduce LCP below 1s")
- ✓ The agent cycles: plan → act → test → review
- ✓ Continues until goal is achieved
- ✓ Stopping condition must be measurable

**In practice:**
1. Goal: "Reach 95% coverage in the auth module"
2. Agent loops: writes test → runs → analyzes gaps → repeats
3. When coverage hits 95%, agent stops
4. Result ready with automated proof

**Example:** An agent improving a site's performance by testing different optimizations until the target is met.

---

## Level 4: Parallel Delegation

**Multiple agents work in parallel**.

- ✓ Multiple agents, each on its own isolated slice
- ✓ Correct decomposition avoids merge conflicts
- ✓ Supports: subagents, worktrees, background sessions

**In practice:**
1. Feature X = auth task + API task + DB task
2. 3 agents work simultaneously on worktrees
3. You observe each agent's progress
4. Automated merge with tests validating everything

**Example:** 3 agents developing 3 different features in parallel, each on its own branch.

---

## Level 5: Managed-by-Exception Orchestration

A **manager agent orchestrates everything**. You only intervene on exceptions.

- ✓ Agent manager: issues work, monitors, verifies, retries
- ✓ Issue tracker as input, resolved PRs as output
- ✓ You intervene only when things go wrong
- ✓ Maximum human time savings

**In practice:**
1. Manager agent reads GitHub Issues daily
2. For each issue, spawns specialized worker agents
3. Manager monitors progress, handles deadlocks
4. PRs ready to review (~5 min vs hours before)

**Example:** A manager agent that reads a backlog, creates tasks, and distributes them to workers who develop features from scratch.

---

## Which level to use?

| Level | When to use | Risk | Benefit |
|-------|------------|------|---------|
| 0 | Exploration, ideation | Low | Quick feedback |
| 1 | Small tasks | Low | Productivity |
| 2 | Well-defined features | Medium | Controlled autonomy |
| 3 | Measurable goals | Medium-High | Fewer iterations |
| 4 | Large features | High | Parallelization |
| 5 | Entire roadmap | Very High | Complete automation |

---

## Security & Permissions

The more autonomy, the more controls you need:

- **Harness**: infrastructure keeping the agent safe (permissions, blocks)
- **Sandbox**: isolated environment where the agent runs
- **Feedback loops**: validate outputs before integrating

The key is: **never give more autonomy than you can audit**.

---

## Conclusion

Agents aren't all-or-nothing. Use the level your task actually needs. Start small (Level 0-1), learn, build trust, and raise the levels as needed.

The best team will be one that combines **humans + agents** at the right levels.
