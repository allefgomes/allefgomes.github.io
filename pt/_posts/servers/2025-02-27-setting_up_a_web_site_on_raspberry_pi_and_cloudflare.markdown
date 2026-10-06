---
layout: post
title: "Como hospedar um site em um Raspberry Pi usando a Cloudflare"
date: 2025-02-26 23:45:00 +0000
description: Como publicar um site em um Raspberry Pi com a Cloudflare
img: servers/raspberry_and_cloudflare.jpg
tags: [Raspberry Pi, Cloudflare]
---

Depois de anos estudando engenharia de software, finalmente comprei meu primeiro Raspberry Pi! Hoje vou mergulhar no processo de expor aplicações para o mundo.

Neste guia, vou mostrar como publicar um site em um Raspberry Pi usando a Cloudflare. Meu blog é feito com Jekyll, e é ele que vamos publicar. Se você quer hospedar o seu próprio site em um Raspberry Pi, este guia é para você!

## Começando

Estou usando um **Raspberry Pi 3B+ com 1GB de RAM**, o suficiente para começar. O primeiro passo é rodar minha aplicação Jekyll no Pi.

### 1. Clone o repositório do seu blog Jekyll

Para começar, clone o repositório do seu blog Jekyll usando o Git:

```bash
git clone https://github.com/allefgomes/allefgomes.github.io.git
```

### 2. Instale o Docker e o Docker Compose

Como vou rodar o blog dentro de um container Docker, preciso instalar o Docker e o Docker Compose. O jeito mais fácil é seguir a documentação oficial do Docker:

[Instalar o Docker no Ubuntu](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)

Depois de instalar, verifique a instalação:

```bash
docker --version
docker-compose --version
```

### 3. Faça o build e rode o blog Jekyll no Docker

Entre no repositório clonado e faça o build da imagem Docker:

```bash
cd allefgomes.github.io
docker build -t blog .
```

Agora rode o container, garantindo que ele reinicie automaticamente quando a máquina ligar:

```bash
docker run --restart always -d -p 3001:4000 blog
```

Neste ponto, seu blog Jekyll está rodando na **porta 3001** do seu Raspberry Pi.

## Configurando o Cloudflare Tunnel

Para expor seu Raspberry Pi na internet com segurança, vamos usar o **Cloudflare Tunnel**. Ele permite que o tráfego passe com segurança pela rede da Cloudflare sem precisar expor o IP do seu Pi diretamente.

### 1. Entre na Cloudflare

Acesse o [painel da Cloudflare](https://dash.cloudflare.com/) e faça login.

1. Clique em **Zero Trust** no menu da esquerda.
2. Selecione **Networks > Tunnels**.
3. Clique em **+ Create a Tunnel**.
4. Escolha **Cloudflared**, dê um nome ao túnel e clique em **Save**.

### 2. Instale o Cloudflared no seu Raspberry Pi

Para conectar seu Raspberry Pi à Cloudflare, instale o `cloudflared`:

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && \
sudo dpkg -i cloudflared.deb && \
sudo cloudflared service install eyJhIjoi...
```

O comando `cloudflared service install` faz a autenticação e estabelece a conexão entre o seu Raspberry Pi e a Cloudflare.

### 3. Adicione um Public Hostname

1. Vá até a aba **Public Hostname**.
2. Clique em **+ Add a Public Hostname**.
3. Preencha os dados:
   - **Subdomain:** escolha o subdomínio que quiser.
   - **Domain:** selecione seu domínio principal.
   - **Type:** defina como **HTTP**.
   - **URL:** informe o IP local e a porta do Raspberry Pi (por exemplo, `http://192.168.x.x:3001`).

Salve as configurações e pronto: seu site está no ar!

## Conclusão

Parabéns! 🎉 Seu Raspberry Pi agora hospeda seu blog Jekyll, exposto ao mundo com segurança pelo Cloudflare Tunnel. Essa configuração não só deixa seu site acessível publicamente como também adiciona uma camada extra de segurança.

Foi um projeto divertido, e espero que ajude quem quer hospedar o próprio site em um Raspberry Pi. Se este guia te ajudou, compartilhe sua experiência ou suas melhorias nos comentários!

### 💡 Quer mais?
Me siga no [LinkedIn](https://www.linkedin.com/in/allef-gomes) e acompanhe o blog para mais tutoriais e experimentos com Raspberry Pi!
