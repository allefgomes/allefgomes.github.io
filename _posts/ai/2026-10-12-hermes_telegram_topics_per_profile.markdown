---
layout: post
title: "One Telegram topic per AI specialist: setting up Hermes step by step"
date: 2026-10-12 20:00:00 -0300
description: How to set up Hermes with a specialist profile for each Telegram topic, a Claude subscription login, and a private group for personal data, with the actual config files and prompts
img: software.jpg
tags: [AI, Hermes, Telegram, Agents, Claude]
---

This is how I run [Hermes](https://hermes-agent.nousresearch.com) with one Telegram topic per specialist. Each topic talks to its own agent, with its own memory, instructions and model. Personal topics live in a separate private group.

By the end you will have:

- A **work group** with one topic per specialist: research, developer, marketing, QA, business analyst and an orchestrator.
- A **private group** with a financial assistant and a calendar assistant.
- A Claude subscription used through an OAuth login, with a cheaper model on the personal agents.

## 1. Log in with your Claude subscription

Hermes can use your Claude subscription through an OAuth token instead of a pay-per-use API key. Either command works:

```bash
hermes auth add anthropic --type oauth
```

or, with Claude Code installed:

```bash
claude setup-token
```

If you use the second one, put the token in the `.env` of the profile that will use it:

```bash
ANTHROPIC_TOKEN=<your token>
```

Check that Hermes sees it:

```bash
hermes auth list
```

You should see an `anthropic` row with type `oauth`.

## 2. Create the profiles

A profile is a separate agent: its own `config.yaml`, `.env`, `SOUL.md`, memory and sessions. Create one per specialist:

```bash
hermes profile create research --no-alias --description "Research specialist: turns vague goals into questions and cited findings."
hermes profile create developer --no-alias --description "Developer: system design, tech specs and implementation plans."
hermes profile create marketing --no-alias --description "Marketing specialist: campaigns, copy and positioning."
```

Repeat for `qa-security`, `business-analyst` and `orchestrator`.

Give each work profile the Claude model in its `config.yaml`:

```yaml
model:
  default: claude-haiku-4-5-20251001
  provider: anthropic
_config_version: 50
```

Each profile also needs the Anthropic credential in its own `.env`. Copy the `ANTHROPIC_TOKEN=` line from step 1 into each one.

## 3. Give each profile a role

The `SOUL.md` file is the agent's system prompt. It defines what the agent does and what it must not do. Here is the research one:

```markdown
# Research — Specialist

You are the Research specialist on the team. You translate ambiguous goals
into concrete questions, gather and evaluate information, and return findings
you can cite.

## What you do

- Turn vague goals into research questions and acceptance criteria.
- Gather requirements, market/domain context, feasibility, and data.
- Evaluate sources and flag uncertainty, bias, or gaps.
- Write findings as clear reports with what you assumed and what you still need.

## Shared wiki under /research

Save structured findings to `research/findings/<topic>.md` — methods, sources,
key claims, confidence, open questions. Add a one-line summary to `research/index.md`
whenever a finding is updated. Drop scratch notes in `notes/<topic>.md`.

## Rules

- Never invent a source, quote, or number. Say where it came from or that it is unverified.
- Separate facts from inferences.
- Flag anything the team cannot proceed without.
```

Write one `SOUL.md` per profile in the same style: a short role, a list of what it does, and a list of rules. The rules matter most. They are where you say what the agent must never do.

## 4. Create the Telegram topics

1. In Telegram, create a group and turn on **Topics** in its settings.
2. Create one topic per profile, for example `research`, `developer`, `marketing`.
3. Add your bot to the group and make it an admin.
4. Send one message in each topic. The gateway logs the group and topic IDs when it receives them.

The `thread_id` of a topic is the number in its link. Hermes also writes the topic list to `~/.hermes/channel_directory.json`, which is the easiest place to read it.

## 5. Route each topic to its profile

The routes are a list in the main `~/.hermes/config.yaml`. Each route connects one topic to one profile:

```yaml
profile_routes:
  - name: topic-research
    platform: telegram
    profile: research
    chat_id: "<your group id>"
    thread_id: "17"
    enabled: true
  - name: topic-developer
    platform: telegram
    profile: developer
    chat_id: "<your group id>"
    thread_id: "13"
    enabled: true
```

Add one entry per topic. The **General** topic can stay without a route, and it will fall back to the default agent.

## 6. Restart the gateway

Routes are read when the gateway starts, so restart the main gateway after you change them:

```bash
hermes -p default gateway restart
```

Then, in each topic, send `/new` and a message such as "who are you?". The gateway log shows which profile answered:

```text
session=agent:research:telegram:group:<group id>:17
```

## 7. Set the fallback order

If a provider fails, Hermes tries the next one. In the main `config.yaml`:

```yaml
fallback_providers:
  - provider: gemini
    model: gemini-3.6-flash
  - provider: nous
    model: upstage/solar-mini4:free
```

## 8. Set up a private group for personal data

Personal agents should not share memory or a chat with work agents. Use a second group:

1. Create a new private group with two topics, `financial` and `calendar`, and add the bot.
2. Create the profiles with their own key and a cheaper model:

```bash
hermes profile create financial --no-alias --description "Personal finance: logs incomes and expenses, answers questions and produces reports."
hermes profile create calendar --no-alias --description "Personal calendar: reads, creates, moves and deletes Google Calendar events."
```

```yaml
model:
  default: gemini-3.5-flash-lite
  provider: gemini
fallback_providers:
  - provider: nous
    model: upstage/solar-mini4:free
_config_version: 50
```

Put a Gemini key in each of their `.env` files, and do not copy the Anthropic token there.

3. Write their `SOUL.md`. The financial one:

```markdown
# Financial — Personal Finance Assistant

You are the user's private personal-finance assistant. Everything here is
personal data, separate from the work profiles. Never reference, ask about or
reveal anything from work topics or other profiles.

## What you do

- Record incomes and expenses the user sends in free text (e.g. "spent 45 on
  lunch"). Capture date (default today), amount, currency, category and a short note.
  Confirm each entry in one line.
- Keep the ledger in `finance/ledger.csv` (date,type,amount,currency,category,note).
  Append only. To correct an entry, add a reversing row and say so.
- Produce reports on request: totals by period, by category, income vs expense,
  balance, trends.

## Rules

- Never invent or guess amounts. If an amount, date or type is ambiguous, ask.
- Compute totals from the ledger, not from memory.
- Keep replies short.
```

The calendar one follows the same structure. Its rules are: before moving or deleting an event, state exactly which event will change and ask for confirmation; confirm each change afterwards with the final date and time; never guess the timezone.

4. Add the two routes to `profile_routes` in the main `config.yaml`, using the private group's ID and the two topic IDs.
5. Restart the gateway with `hermes -p default gateway restart` and test both topics the same way as in step 6.

## 9. Schedule a daily agenda

The calendar agent can send a message every morning:

```bash
hermes -p calendar cron create "0 6 * * *" --name "daily-agenda" "Send today's agenda: appointments in time order with time, title and location, then any conflicts."
```

The schedule uses the machine's timezone, so set that first.

## Two notes on privacy

Profiles separate memory and sessions, but they all run on the same machine. A folder in your home directory can be read by any agent that browses the disk. For data that must stay private, keep its files inside that profile's own folder, not in a shared path.

Keep the personal group's ID and the tokens out of any repo or post. Only the placeholders above belong in shared files.
