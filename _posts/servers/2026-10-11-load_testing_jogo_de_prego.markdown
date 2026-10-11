---
layout: post
title: "How many people can play Jogo de Prego at once?"
date: 2026-10-11 09:25:43 -0300
description: "How I load tested my game server, made two changes, and more than doubled how many players it handles"
img: servers/load_testing_jogo_de_prego.webp
tags: [Load Testing, Performance, Servers]
---

Yesterday I wanted to answer a simple question about Jogo de Prego, my game: **how many people can play at once?** So I filled the production server with fake players to find its limit, made two changes, and tested again after each one. By the end of the day it handled **more than twice as many players** as in the morning, on the same small server.

### What a load test is

A program pretended to be hundreds of phones. Each fake player opened the app's connection to the server, joined the Terrão queue, got matched with another fake player, aimed, shot, and started a new match when one ended. That is the same work the server does for real players.

I added players in steps (250, then 400, then 600), held each step for 2 minutes, and watched whether the game stayed smooth. A few terms I'll use:

- **Update:** a small message from the server saying where the coin and the goalkeepers are. The app draws the board from these, like frames of a video.
- **Late update:** an update that arrived more than 70 ms after it was due. A few are normal on the internet. When the share keeps rising, the server can't keep up and players see the game stutter.
- **CPU:** the server's processing power. This server has 2 cores. At 100% busy, everything starts to queue up.

### The results at a glance

| Run | Result |
|---|---|
| 1 · original | **250** players, then it was full. No CPU to spare. |
| 2 · first change | **400** players smooth. Broke down at 600. |
| 3 · second change | **600+** players smooth. Limit not found yet. |

### What I changed between runs

**Run 1: the original.** The server sent every player 30 updates a second, all the time, even when the coin was standing still and only the goalkeepers were walking.

**Run 2: fewer updates while the coin is still.** Down to 10 a second while players are thinking. The app slides the goalkeepers smoothly between updates, so it looks the same. Each update is also prepared once per match instead of once per player.

**Run 3: fewer updates while the coin moves.** Down to 15 a second during a shot. Each update also lists the exact spots where the coin bounced off a prego or the wall, so the app draws the real path instead of cutting corners.

### Did the game stay smooth?

Late updates at each number of players (lower is better; under about 1% is normal internet noise):

| Players | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| 250 | 0.73%, rising (CPU full) | 0.59% | 0.29% |
| 400 | not tested | 0.57% | 0.79% |
| 600 | not tested | 8.5% (overloaded) | 0.73% |

Run 1 wasn't tried past 250 players because the server was already at full CPU. Run 2 at 600 players stopped itself after about a minute, when late updates passed the 2% safety limit; 8.5% is the average of that minute, and it reached 13% at the end.

That 8.5% is the important number. With the first change, 600 players overloaded the server and the game would have stuttered. With the second change, 600 players looked the same as 250: under 1% late, no dropped connections, no errors.

### Why it got better

Updates sent to each player per second, with 250 players:

- **Run 1:** 28.4 (30 a second all the time, some lost because the server was full)
- **Run 2:** 17.8 (10/s while still, 30/s while moving)
- **Run 3:** 10.4 (10/s while still, 15/s while moving)

Every update costs the server work: build it, encrypt it, send it. Cutting the number of messages by about two thirds frees most of that work for more players. Matchmaking, the database and memory were never the problem; the server stayed fast at answering "find me a match" in every run.

The lesson for me: before buying a bigger server, look at how much work you're asking it to do. Here, the fix wasn't more hardware, it was sending fewer, smarter messages.

### What to keep in mind

- **The real limit is still unknown.** Run 3 passed at 600 players, the highest step I tried. A test at 800 and 1,000 players will show where it really stops.
- **I didn't record CPU in run 3.** In run 2 the CPU was nearly full at 400 players. Measuring it next time will show how much room is left.
- **Fake players are busier than real ones.** They shoot after 0.5 to 3 seconds. Real people usually think longer, which means fewer updates, so real capacity is probably a bit higher.
- **The runs measured lateness slightly differently.** Each run used the best rule for how that version sends updates. The trend is clear, but compare the small percentages loosely.
- **Old app versions look worse.** Players on app 1.0.2 or 1.0.3 see a less smooth coin until they install 1.0.4.

### All the numbers

| Run | Players | Updates/s (total) | Late | Spare CPU | Result |
|---|---|---|---|---|---|
| 1 · original | 100 | 2,960 | 0.24% | some | Smooth |
| 1 · original | 250 | 7,100 | 0.73%, rising | 0% | Full |
| 2 · first change | 250 | 4,450 | 0.59% | ~25% | Smooth |
| 2 · first change | 400 | 6,900 | 0.57% | ~5–15% | Smooth |
| 2 · first change | 600 | 5,150 | 8.5% (to 13%) | 0% | Overloaded |
| 3 · second change | 250 | 2,605 | 0.29% | not measured | Smooth |
| 3 · second change | 400 | 4,380 | 0.79% | not measured | Smooth |
| 3 · second change | 600 | 6,871 | 0.73% | not measured | Smooth |

The server has 2 vCPUs and 4 GB of RAM, shared with one other app. The test machine was in Brazil and the server is in Finland, about 250 ms round trip. Run 3 totals: 1,792 matches started, 1,236 finished, 20,124 shots, 0 dropped connections, 0 errors. In run 2 at 600 players, fewer updates got out than at 400, because the server couldn't keep up.

### Next steps

Find the new ceiling: run steps of 600, 800 and 1,000 players, this time recording the server's CPU. When I do, I'll write about it here.

See ya!
