---
layout: post
title: EN - How to Host a Website on a Raspberry Pi Using Cloudflare
date: 2025-02-26 23:45:00 +0000
description: How to set up a web site on raspberry pi and cloudflare
img: servers/raspberry_and_cloudflare.jpg
tags: [Raspberry Pi, Cloudflare, EN]
---

After years of learning about software engineering, I finally bought my first Raspberry Pi! Today, I'm diving into the process of exposing applications to the world.

In this guide, I'll show you how to set up a website on a Raspberry Pi using Cloudflare. My blog is built with Jekyll, and that's what we'll be deploying. If you're looking to host your own site using a Raspberry Pi, this guide is for you!

## Getting Started

I'm using a **Raspberry Pi 3B+ with 1GB of RAM**—enough to get started. The first step is to run my Jekyll application on the Pi.

### 1. Clone Your Jekyll Blog Repository

To get started, clone your Jekyll blog repository using Git:

```bash
git clone https://github.com/allefgomes/allefgomes.github.io.git
```

### 2. Install Docker and Docker Compose

Since I'll be running my blog inside a Docker container, I need to install Docker and Docker Compose. The easiest way is by following the official Docker documentation:

[Install Docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)

Once installed, verify the installation:

```bash
docker --version
docker-compose --version
```

### 3. Build and Run Your Jekyll Blog in Docker

Navigate to the cloned repository and build the Docker image:

```bash
cd allefgomes.github.io
docker build -t blog .
```

Now, run the container and ensure it restarts automatically on boot:

```bash
docker run --restart always -d -p 3001:4000 blog
```

At this point, your Jekyll blog is running on **port 3001** of your Raspberry Pi.

## Setting Up Cloudflare Tunnel

To expose your Raspberry Pi to the internet securely, we'll use **Cloudflare Tunnel**. This allows traffic to be securely routed through Cloudflare's network without needing to expose your Pi's IP directly.

### 1. Log Into Cloudflare

Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and log in.

1. Click on **Zero Trust** in the left menu.
2. Select **Networks > Tunnels**.
3. Click **+ Create a Tunnel**.
4. Choose **Cloudflared**, enter a name for your tunnel, and click **Save**.

### 2. Install Cloudflared on Your Raspberry Pi

To connect your Raspberry Pi to Cloudflare, install `cloudflared` using Docker:

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && \
sudo dpkg -i cloudflared.deb && \
sudo cloudflared service install eyJhIjoi...
```

The `cloudflared service install` command will authenticate and establish a connection between your Raspberry Pi and Cloudflare.

### 3. Add a Public Hostname

1. Navigate to the **Public Hostname** tab.
2. Click **+ Add a Public Hostname**.
3. Fill in the details:
   - **Subdomain:** Choose your desired subdomain.
   - **Domain:** Select your main domain.
   - **Type:** Set it to **HTTP**.
   - **URL:** Enter the Raspberry Pi's local IP and port (e.g., `http://192.168.x.x:3001`).

Save your settings, and your website is now live on the internet!

## Conclusion

Congratulations! 🎉 Your Raspberry Pi is now hosting your Jekyll blog and is securely exposed to the world through Cloudflare Tunnel. This setup not only makes your site publicly accessible but also adds an extra layer of security.

This was a fun project, and I hope it helps others looking to self-host their websites on a Raspberry Pi. If you found this helpful, share your experience or improvements in the comments!

### 💡 Want More?
Follow me on [LinkedIn](https://www.linkedin.com/in/allef-gomes) and my blog for more tech tutorials and Raspberry Pi experiments!

