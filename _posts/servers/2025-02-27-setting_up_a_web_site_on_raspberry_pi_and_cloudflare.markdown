---
layout: post
title: EN - Setting up a web site on raspberry pi and cloudflare
date: 2025-02-26 23:45:00 +0000
description: How to set up a web site on raspberry pi and cloudflare
img: servers/raspberry_and_cloudflare.jpg
tags: [Raspberry Pi, Cloudflare]
---

After years of learning about software engineering, I bought my first raspberry pi and today I'm learning how to expose my applications to the world.

I'm going to explain you how to set up a web site on raspberry pi and cloudflare. My blog is written on jekyll and it's what we'll expose to the world.

I hope you like it!

The raspberry pi that I'm using is a 3b+ with 1gb of ram. It's enough for me to start. First, I need run my application, so I used git to get the source code like this:
```bash
git clone https://github.com/allefgomes/allefgomes.github.io.git
```
Then, I need to install docker and docker-compose. I followed this [link](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script) to install docker and docker-compose.

So, I enter on allefgomes.github.io.git directory and run this command:
```
docker build -t blog .
```
Now, I need run using this command:
```
docker run -d -p 3001:4000 blog
```

to be continued...

