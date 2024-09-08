---
layout: post
title: "PT-BR: Como Resolver o Erro de Permissão no Flameshot no Ubuntu 22.04"
date: 2024-09-08 00:00:00 +0300
description: Corrigindo flameshot no Ubuntu 22.04
img: ./flameshot_ubuntu.jpg
tags: [Til, Flameshot, Ubuntu]
---

Após instalar o flameshot no Ubuntu 22.04, ao rodar o CLI `flameshot gui` acontecia o erro de não permissão.

Solução foi abrir o arquivo `/etc/gdm3/custom.conf` e remover o comentário da linha `#WaylandEnable=false` que irá forçar o login do Ubuntu com Xorg.

Após isso, só reiniciar a máquina. 
