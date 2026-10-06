---
layout: post
title: "How to fix Flameshot's permission error on Ubuntu 22.04"
date: 2024-09-08 00:00:00 +0300
description: Fixing Flameshot on Ubuntu 22.04
img: ./flameshot_ubuntu.jpg
tags: [TIL, Flameshot, Ubuntu]
---

After installing Flameshot on Ubuntu 22.04, running the `flameshot gui` command failed with a permission error.

The fix was to open `/etc/gdm3/custom.conf` and uncomment the line `#WaylandEnable=false`, which forces Ubuntu to log in with Xorg instead of Wayland.

After that, just restart the machine.
