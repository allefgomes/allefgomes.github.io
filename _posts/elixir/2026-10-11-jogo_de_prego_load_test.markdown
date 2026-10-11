---
layout: post
title: "How many people can play my game at once? A load test of Jogo de Prego"
date: 2026-10-11 02:30:03 +0000
description: "I filled my game's server with fake players to find its limit, and more than doubled it by sending fewer messages"
img: elixir/jogo-de-prego.jpg
tags: [Elixir, Phoenix, Performance, Load Test]
---

A few days ago I launched my first game: [Jogo de Prego](https://jogodeprego.allefgomes.com), the Brazilian table football where the players are nails fixed to a wooden board and the ball is a coin you flick with your finger. Two people play online, in the browser or on the Android app, and the server runs every match.

Before inviting more people, I wanted to answer one simple question: **how many people can play at once before the game starts to stutter?**

So I filled the production server with fake players, found the limit, made two changes, and tested again after each one. The result: the same small server now handles **more than twice as many players** as it did that morning.

| Run | What changed | Players with a smooth game |
|---|---|---|
| 1 | Nothing (original) | **250**, and the server was already full |
| 2 | Fewer updates while the coin is still | **400** (broke down at 600) |
| 3 | Fewer updates while the coin moves | **600+** (limit not found yet) |

## How the game works (the short version)

The game is built with **Elixir and Phoenix**. Every match is its own process on the server, and the **physics runs on the server**: the app only sends the direction and strength of a shot, the server simulates the coin bouncing off the nails, and then it sends the result to both players. That keeps anyone from cheating by moving the coin.

The catch is that the server has to keep telling both phones where the coin and the goalkeepers are. Each of those messages is an **update**, and the app draws the board from them, like the frames of a video.

## What a load test is

A program pretended to be hundreds of phones. Each fake player connected to the server, joined the queue, got matched with another fake player, aimed, shot, and started a new match when one ended. That's the same work the server does for real people.

I added players in steps (250, then 400, then 600), held each step for 2 minutes, and watched whether the game stayed smooth. To measure "smooth" I counted **late updates**: updates that arrived more than 70 ms after they were due. A few are normal on the internet. When that share keeps growing, the server can't keep up and players see the game stutter.

The server is small on purpose: **2 CPU cores and 4 GB of RAM**, shared with another app.

## Run 1: the original

The server sent every player **30 updates a second, all the time**, even when the coin was standing still and only the goalkeepers were walking.

At 100 players, everything was fine. At 250 players, the CPU was at 100% and late updates were going up. That was the ceiling.

## Run 2: fewer updates while the coin is still

Most of a match is people thinking about their next shot. While the coin is still, I dropped to **10 updates a second**, and the app slides the goalkeepers smoothly between updates, so it looks exactly the same. I also built each update **once per match instead of once per player**.

250 players was now comfortable, with about 25% of the CPU to spare. 400 players was still smooth. At 600 players the server got overloaded: late updates passed my 2% safety limit and the test stopped itself after a minute (it reached 13% late at the end).

## Run 3: fewer updates while the coin moves

During a shot I went from 30 to **15 updates a second**. With fewer frames, the app could cut corners when drawing a bounce, so each update now also lists the exact spots where the coin hit a nail or the wall. The app draws the real path instead of guessing.

600 players looked the same as 250: under 1% late, no dropped connections and no errors. Across that run the fake players started 1,792 matches and took 20,124 shots.

## Why it got better

![Aiming a shot in Jogo de Prego](/assets/img/elixir/jogo-de-prego-aiming.jpg)

Every update costs the server work: build it, encrypt it, send it. Here's how many updates each player got per second with 250 players:

| Run | Updates per player per second |
|---|---|
| 1 · original | 28.4 |
| 2 · first change | 17.8 |
| 3 · second change | 10.4 |

Cutting the number of messages by about two thirds freed most of that work for more players. Matchmaking, the database and memory were never the problem: the server answered "find me a match" quickly in every run.

**The lesson:** the fastest message is the one you don't send. I didn't need a bigger server, or faster code; I needed to stop sending the same information 30 times a second when nothing was changing.

## All the numbers

| Run | Players | Updates/s (total) | Late | Spare CPU | Result |
|---|---|---|---|---|---|
| 1 · original | 100 | 2,960 | 0.24% | some | Smooth |
| 1 · original | 250 | 7,100 | 0.73%, rising | 0% | Full |
| 2 · first change | 250 | 4,450 | 0.59% | ~25% | Smooth |
| 2 · first change | 400 | 6,900 | 0.57% | ~5–15% | Smooth |
| 2 · first change | 600 | 5,150 | 8.5% (up to 13%) | 0% | Overloaded |
| 3 · second change | 250 | 2,605 | 0.29% | not measured | Smooth |
| 3 · second change | 400 | 4,380 | 0.79% | not measured | Smooth |
| 3 · second change | 600 | 6,871 | 0.73% | not measured | Smooth |

The test machine was in Brazil and the server is in Finland, about 250 ms away. In run 2 at 600 players, fewer updates got out than at 400, because the server couldn't keep up.

## What to keep in mind

- **The real limit is still unknown.** Run 3 passed at 600 players, the highest step I tried.
- **I didn't record the CPU in run 3**, so I don't know yet how much room is left.
- **Fake players are busier than real ones.** They shoot after 0.5 to 3 seconds. Real people think longer, which means fewer updates, so the real capacity is probably a bit higher.
- **Each run measured lateness slightly differently**, using the best rule for how that version sends updates. The trend is clear, but compare the small percentages loosely.

Next, I'll run steps of 600, 800 and 1,000 players while recording the CPU, to find the new ceiling.

In the meantime, come play: [jogodeprego.allefgomes.com](https://jogodeprego.allefgomes.com). ⚽
