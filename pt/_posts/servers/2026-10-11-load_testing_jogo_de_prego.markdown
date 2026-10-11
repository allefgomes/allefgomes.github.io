---
layout: post
title: "Quantas pessoas conseguem jogar Jogo de Prego ao mesmo tempo?"
date: 2026-10-11 09:25:43 -0300
description: "Como fiz um teste de carga no servidor do meu jogo, fiz duas mudanças e mais que dobrei quantos jogadores ele aguenta"
img: servers/load_testing_jogo_de_prego.webp
tags: [Load Testing, Performance, Servers]
---

Ontem eu quis responder uma pergunta simples sobre o Jogo de Prego, o meu jogo: **quantas pessoas conseguem jogar ao mesmo tempo?** Então enchi o servidor de produção com jogadores falsos para achar o limite, fiz duas mudanças e testei de novo depois de cada uma. No fim do dia ele aguentava **mais que o dobro de jogadores** que de manhã, no mesmo servidor pequeno.

### O que é um teste de carga

Um programa fingiu ser centenas de celulares. Cada jogador falso abria a conexão do app com o servidor, entrava na fila do Terrão, era pareado com outro jogador falso, mirava, chutava e começava uma nova partida quando uma terminava. É o mesmo trabalho que o servidor faz para jogadores de verdade.

Fui adicionando jogadores em degraus (250, depois 400, depois 600), segurei cada degrau por 2 minutos e observei se o jogo continuava fluido. Alguns termos que vou usar:

- **Atualização:** uma pequena mensagem do servidor dizendo onde estão a moeda e os goleiros. O app desenha o tabuleiro a partir delas, como quadros de um vídeo.
- **Atualização atrasada:** uma atualização que chegou mais de 70 ms depois do esperado. Algumas são normais na internet. Quando a proporção não para de subir, o servidor não está dando conta e os jogadores veem o jogo engasgar.
- **CPU:** o poder de processamento do servidor. Este servidor tem 2 núcleos. Com 100% de uso, tudo começa a fazer fila.

### Os resultados de relance

| Rodada | Resultado |
|---|---|
| 1 · original | **250** jogadores, e aí lotou. Sem CPU sobrando. |
| 2 · primeira mudança | **400** jogadores sem engasgos. Quebrou com 600. |
| 3 · segunda mudança | **600+** jogadores sem engasgos. Limite ainda não encontrado. |

### O que mudei entre as rodadas

**Rodada 1: o original.** O servidor mandava 30 atualizações por segundo para cada jogador, o tempo todo, mesmo quando a moeda estava parada e só os goleiros estavam andando.

**Rodada 2: menos atualizações com a moeda parada.** Caiu para 10 por segundo enquanto os jogadores estão pensando. O app desliza os goleiros suavemente entre as atualizações, então fica igual na tela. Cada atualização também passou a ser preparada uma vez por partida em vez de uma vez por jogador.

**Rodada 3: menos atualizações com a moeda em movimento.** Caiu para 15 por segundo durante um chute. Cada atualização também lista os pontos exatos onde a moeda bateu num prego ou na parede, então o app desenha o caminho real em vez de cortar caminho.

### O jogo continuou fluido?

Atualizações atrasadas em cada número de jogadores (quanto menor, melhor; abaixo de cerca de 1% é ruído normal da internet):

| Jogadores | Rodada 1 | Rodada 2 | Rodada 3 |
|---|---|---|---|
| 250 | 0,73%, subindo (CPU cheia) | 0,59% | 0,29% |
| 400 | não testado | 0,57% | 0,79% |
| 600 | não testado | 8,5% (sobrecarregado) | 0,73% |

A rodada 1 não foi testada acima de 250 jogadores porque o servidor já estava com a CPU cheia. A rodada 2 com 600 jogadores se interrompeu sozinha depois de cerca de um minuto, quando as atualizações atrasadas passaram do limite de segurança de 2%; 8,5% é a média desse minuto, e chegou a 13% no final.

Esse 8,5% é o número importante. Com a primeira mudança, 600 jogadores sobrecarregaram o servidor e o jogo teria engasgado. Com a segunda mudança, 600 jogadores ficaram iguais a 250: menos de 1% de atraso, nenhuma conexão derrubada, nenhum erro.

### Por que melhorou

Atualizações enviadas para cada jogador por segundo, com 250 jogadores:

- **Rodada 1:** 28,4 (30 por segundo o tempo todo, algumas perdidas porque o servidor estava cheio)
- **Rodada 2:** 17,8 (10/s com a moeda parada, 30/s em movimento)
- **Rodada 3:** 10,4 (10/s com a moeda parada, 15/s em movimento)

Cada atualização custa trabalho para o servidor: montar, criptografar, enviar. Cortar o número de mensagens em cerca de dois terços libera a maior parte desse trabalho para mais jogadores. Matchmaking, banco de dados e memória nunca foram o problema; o servidor continuou rápido em responder "encontre uma partida para mim" em todas as rodadas.

A lição para mim: antes de comprar um servidor maior, olhe quanto trabalho você está pedindo para ele fazer. Aqui, a solução não foi mais hardware, foi mandar menos mensagens, e mais inteligentes.

### O que ter em mente

- **O limite real ainda é desconhecido.** A rodada 3 passou com 600 jogadores, o maior degrau que testei. Um teste com 800 e 1.000 jogadores vai mostrar onde ele realmente para.
- **Não registrei a CPU na rodada 3.** Na rodada 2 a CPU estava quase cheia com 400 jogadores. Medir da próxima vez vai mostrar quanto espaço sobra.
- **Jogadores falsos são mais ativos que os reais.** Eles chutam depois de 0,5 a 3 segundos. Pessoas de verdade costumam pensar mais, o que significa menos atualizações, então a capacidade real provavelmente é um pouco maior.
- **As rodadas mediram o atraso de formas um pouco diferentes.** Cada rodada usou a melhor regra para o jeito como aquela versão envia atualizações. A tendência é clara, mas compare as porcentagens pequenas com cautela.
- **Versões antigas do app ficam piores.** Jogadores no app 1.0.2 ou 1.0.3 veem a moeda menos fluida até instalarem a 1.0.4.

### Todos os números

| Rodada | Jogadores | Atualizações/s (total) | Atraso | CPU livre | Resultado |
|---|---|---|---|---|---|
| 1 · original | 100 | 2.960 | 0,24% | alguma | Fluido |
| 1 · original | 250 | 7.100 | 0,73%, subindo | 0% | Lotado |
| 2 · primeira mudança | 250 | 4.450 | 0,59% | ~25% | Fluido |
| 2 · primeira mudança | 400 | 6.900 | 0,57% | ~5–15% | Fluido |
| 2 · primeira mudança | 600 | 5.150 | 8,5% (até 13%) | 0% | Sobrecarregado |
| 3 · segunda mudança | 250 | 2.605 | 0,29% | não medido | Fluido |
| 3 · segunda mudança | 400 | 4.380 | 0,79% | não medido | Fluido |
| 3 · segunda mudança | 600 | 6.871 | 0,73% | não medido | Fluido |

O servidor tem 2 vCPUs e 4 GB de RAM, dividido com outro app. A máquina de teste estava no Brasil e o servidor fica na Finlândia, com cerca de 250 ms de ida e volta. Totais da rodada 3: 1.792 partidas iniciadas, 1.236 finalizadas, 20.124 chutes, 0 conexões derrubadas, 0 erros. Na rodada 2 com 600 jogadores, saíram menos atualizações do que com 400, porque o servidor não dava conta.

### Próximos passos

Encontrar o novo teto: rodar degraus de 600, 800 e 1.000 jogadores, desta vez registrando a CPU do servidor. Quando eu fizer isso, escrevo sobre aqui.

Até mais!
