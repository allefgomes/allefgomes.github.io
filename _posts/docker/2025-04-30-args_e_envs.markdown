---
layout: post
title: "An important lesson about Docker Compose: build.args vs env_file"
date: 2025-04-30 00:00:00 +0300
description: When to use build.args and when to use env_file
img: docker/args_e_envs.png
tags: [TIL, Docker, Docker Compose]
---
# 📚 An important lesson about Docker Compose: `build.args` vs `env_file` 🚀

Today, while setting up the **staging** environment for an application, I ran into a **Docker Compose** behavior that looked strange:

- I had a `.env.staging` with every variable set correctly.
- In `docker-compose.yml`, I had already configured `env_file: .env.staging`.
- But during the **image build**, Rails complained that `SECRET_KEY_BASE` didn't exist. 😵‍💫

I spent a few minutes digging... until I realized something that now seems obvious (but that trips up a lot of people):

👉 **`env_file` is only read on `docker-compose up`, not on `build`!**

During `docker-compose build`, Compose does **not** read the `env_file`.
If you need variables during the build (for example, to precompile assets or configure a custom build), **you have to pass them explicitly with `build.args`**.

💡 **And also:** the default `.env` (or `.env.staging`, when used with `--env-file`) is read to fill in those variables **only if they're mapped in `build.args`**.

---

## 🎯 In short:

| When | Available variables |
|------|---------------------|
| `docker-compose build` | Use `args:` + `--env-file` (or export them in the shell) |
| `docker-compose up` | Use `env_file:` (works perfectly) |

---

## ⚙️ How my project ended up:

`.env.staging`:
```env
SECRET_KEY_BASE=supersecreta123
RAILS_ENV=staging
```

`docker-compose.yml`:
```yaml
build:
  context: .
  dockerfile: Dockerfile
  args:
    SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    RAILS_ENV: ${RAILS_ENV}

env_file:
  - .env.staging
```

## And when running it:
```bash
docker-compose --env-file .env.staging build
docker-compose --env-file .env.staging up
```

🧠 Small details like this make all the difference when setting up staging and production environments you can rely on and predict.

#docker #devops #programming #rails #dockercompose #backend #learning
