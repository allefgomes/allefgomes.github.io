---
layout: post
title: "One Telegram topic per AI agent: setting up Hermes with a profile for each job"
date: 2026-10-13 20:00:00 -0300
description: How I fixed a Hermes setup that was quietly using the wrong provider, and gave every Telegram topic its own specialist profile, including a private group for personal data
img: software.jpg
tags: [AI, Hermes, Telegram, Agents, Claude]
---

I run [Hermes](https://hermes-agent.nousresearch.com), an agent that lives behind a Telegram bot. The idea was simple: one Telegram group for work, with a **topic for each specialist** (research, developer, marketing...), so every conversation goes to the right agent. Today I sat down to make that real, and it took a few surprises. Here is everything I did, in order.

## The problem: "why is it using Copilot?"

It started with a startup banner that said `Provider: copilot` when I wanted my **Anthropic subscription**. Digging in, I found the cause:

- Hermes has **profiles**. Each profile is a full agent with its own config, memory, sessions and credentials.
- Five of my six profiles were set to `provider: copilot`. Only the `orchestrator` used `anthropic`.
- Switching them was a one-line change in each profile's `config.yaml`. That was the easy part.

## "Use my subscription, not an API key"

Hermes can use a Claude subscription through an **OAuth token** (it starts with `sk-ant-oat`) instead of a pay-per-use API key. I already had one in the main `.env`, and `hermes auth list` showed it as an `oauth` credential. You can create one with `hermes auth add anthropic --type oauth` or with `claude setup-token`.

## The real bug: credentials are per profile

After the switch, some topics still failed with a connection error, while the default agent worked. The logs told the story: Gemini was out of quota, and the Copilot fallback rejected the Claude model name. Anthropic was never even tried.

The reason: **each profile has its own `.env`**, and only the orchestrator had an Anthropic key. The other five had no way to authenticate. I copied the token into each profile's `.env` and the errors stopped.

Lesson: when you have many profiles, "it works on the default one" tells you nothing about the others.

## Restarting is not always restarting

Two gotchas cost me time:

1. `hermes gateway restart` restarted only the **active profile**, not the main gateway. The one I needed was `hermes -p default gateway restart`.
2. The gateway reads its **topic routes only when it starts**. I added routes and nothing changed, until I restarted. A good tell: `gateway.pid` has a new timestamp and a new PID.

## One topic, one profile

Routing is a list in the main `config.yaml`. Each entry maps a Telegram `chat_id` and `thread_id` (the topic) to a profile:

```yaml
profile_routes:
  - name: topic-developer
    platform: telegram
    profile: developer
    chat_id: "<group id>"
    thread_id: "13"
    enabled: true
```

To check that it works, I read the session names in `gateway.log`. A message in the developer topic shows up as `agent:developer:telegram:group:...:13`. If you see `agent:main`, the message went to the default agent and the route is not active.

The group's **General** topic has no route, so it always goes to the default agent. That is expected.

## Personal data deserves a separate group

Then I wanted two more agents:

- **financial**: I send my income and expenses in plain text, and ask for reports.
- **calendar**: connected to my Google Calendar, to read, move, create and delete appointments, plus a message every day at 6am with the agenda.

This is **personal** data, while the other topics are **work** data. So I made three decisions:

- A **separate private Telegram group** with its own topics, instead of new topics in the work group.
- Their own profiles, so memory, sessions and files are not shared with the work agents.
- The **cheapest Gemini model** (`gemini-3.5-flash-lite`) with its own key, since these are small tasks. A free model is the fallback.

Each profile also has a `SOUL.md`, the file that defines the agent's personality and rules. The financial one logs every entry to a ledger, never invents an amount and asks when something is unclear. The calendar one confirms before it moves or deletes anything. Both are told never to mention work topics.

One honest caveat: profiles separate memory and sessions, but they all run on the same machine. A folder in my home directory can be read by any agent that browses the disk. For truly private data, keep the files inside that profile's own folder.

## The fallback chain

I also set a clear order for when a provider fails: **Anthropic first, then Gemini, then a free model**. That way a rate limit on one provider no longer turns into "I couldn't connect to the AI model service."

## What is still missing

The calendar agent still needs the **Google Calendar login**. That step needs my browser and my consent, so it is mine to do. Once it works, the 6am agenda is one cron job: `hermes cron create "0 6 * * *"`, with the timezone set to my own.

## What I would tell myself this morning

- Profiles are separate agents. Check the credentials of **each one**.
- Restart the right gateway, then confirm with the PID and the log.
- Read the session names in the logs. They tell you which profile answered.
- Put personal and work data in different groups, and give personal agents a cheaper model.
