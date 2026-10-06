---
layout: post
title: "Um aprendizado importante sobre Docker Compose: build.args vs env_file"
date: 2025-04-30 00:00:00 +0300
description: Quando usar o build.args e o env_file
img: docker/args_e_envs.png
tags: [TIL, Docker, Docker Compose]
---
# 📚 Um aprendizado importante sobre Docker Compose: `build.args` vs `env_file` 🚀

Hoje enquanto preparava o ambiente de **staging** de uma aplicação, me deparei com um comportamento do **Docker Compose** que parecia estranho:

- Eu tinha um `.env.staging` com todas as variáveis certinhas.
- No `docker-compose.yml`, já tinha configurado `env_file: .env.staging`.
- Mas, durante o **build da imagem**, o Rails reclamava que o `SECRET_KEY_BASE` não existia. 😵‍💫

Fiquei alguns minutos investigando... até perceber algo que agora parece óbvio (mas que muita gente também se confunde):

👉 **O `env_file` é lido apenas no `docker-compose up`, não no `build`!**

Durante o `docker-compose build`, o Compose **não** lê o `env_file`.  
Se queremos passar variáveis durante o build (por exemplo para compilar os assets ou configurar alguma build customizada), **precisamos usar `build.args` explicitamente**.

💡 **E mais:** o `.env` padrão (ou `.env.staging`, se usado com `--env-file`) é lido para preencher essas variáveis **só se elas forem mapeadas no `build.args`**.

---

## 🎯 Em resumo:

| Quando | Variáveis disponíveis |
|--------|------------------------|
| `docker-compose build` | Usar `args:` + `--env-file` (ou exportar no terminal) |
| `docker-compose up` | Usar `env_file:` (funciona perfeitamente) |

---

## ⚙️ Como ficou no meu projeto:

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

## E na hora de rodar:
```bash
docker-compose --env-file .env.staging build
docker-compose --env-file .env.staging up
```

🧠 Pequenos detalhes como esse fazem toda a diferença quando configuramos ambientes de staging e produção com confiabilidade e previsibilidade.

#docker #devops #programação #rails #dockercompose #backend #aprendizado
