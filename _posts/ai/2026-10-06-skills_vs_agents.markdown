---
layout: post
title: "Skills vs Agents, explained like you're five"
date: 2026-10-06 00:00:00 -0300
description: The simplest possible explanation of the difference between skills and agents in AI assistants like Claude Code
img: software.jpg
tags: [AI, Claude, Agents, Skills]
---

If you've started using AI coding assistants like Claude Code, you've probably heard two words thrown around a lot: **skills** and **agents**. They sound similar. They are not. Let's make this as simple as it gets.

## The kitchen

Imagine the AI is **a cook in a kitchen**. You are the customer asking for food.

### A skill is a recipe card 📄

A **skill** is a recipe card you hand to the cook.

- The cook is still **the same cook**.
- The cook reads the card and now knows *how* to make lasagna the way you like it.
- The cook does the work **right in front of you**, in the same kitchen.

The skill doesn't do anything by itself. It's just paper. It **teaches** the cook.

### An agent is a second cook 👩‍🍳

An **agent** (often called a *subagent*) is **another cook** you call in to help.

- It's a **different person** working in a **different kitchen**.
- You give them a task: *"go buy and chop all the vegetables"*.
- They go away, do the whole job on their own, and come back with **just the result**: a bowl of chopped vegetables.
- You don't see the mess they made. You only get the bowl.

The agent **does** the work for you.

## The one-sentence version

> A **skill** teaches the AI *how* to do something.
> An **agent** is *another AI* that does something for you.

## Side by side

| | Skill 📄 | Agent 👩‍🍳 |
|---|---|---|
| What is it? | Instructions | A helper |
| Who does the work? | The same AI | A separate AI |
| Where does the work happen? | In your current conversation | In its own, separate conversation |
| What do you see? | Every step | Only the final answer |
| Good for | "Do it *this* way" | "Go do *this* and tell me what you found" |

## Why should I care?

**Memory.** An AI can only keep so much in its head at once (this is called the *context window*).

- When you use a **skill**, everything the AI reads and does fills up **your** conversation. That's fine, you want to see it.
- When you use an **agent**, it reads 50 files, makes a mess, and comes back with a short summary. **Your** conversation stays clean.

So:

- Use a **skill** when you want the AI to follow a recipe: "write commits in this format", "follow our brand colors", "review code using this checklist".
- Use an **agent** when there's a big, noisy job you don't want to watch: "search the whole project and tell me where we handle payments", "research these three libraries and compare them".

## In Claude Code, concretely

- A **skill** is a folder with a `SKILL.md` file inside. It's literally a text file of instructions. Claude reads it when the task matches, and then keeps working with you.
- An **agent** is defined in `.claude/agents/` (or is a built-in one, like `Explore`). Claude starts it, it works alone, and it hands back a report.

They also work together: an agent can use skills. The second cook can read a recipe card too. 😉

## TL;DR

- **Skill = recipe.** Same cook, now smarter.
- **Agent = extra cook.** Different cook, does the job, brings back the result.

That's it. You now know more than most people arguing about it on the internet.
