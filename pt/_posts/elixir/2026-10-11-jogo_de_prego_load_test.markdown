---
layout: post
title: "Quantas pessoas podem jogar meu jogo ao mesmo tempo? Um teste de carga do Jogo de Prego"
date: 2026-10-11 02:30:03 +0000
description: "Enchi o servidor do meu jogo com jogadores falsos para achar o limite, e mais que dobrei a capacidade enviando menos mensagens"
img: elixir/jogo-de-prego.jpg
tags: [Elixir, Phoenix, Performance, Load Test]
---

Há alguns dias lancei meu primeiro jogo: o [Jogo de Prego](https://jogodeprego.allefgomes.com), o futebol de mesa em que os jogadores são pregos fixos num tabuleiro de madeira e a bola é uma moeda que você peteleca com o dedo. Duas pessoas jogam online, no navegador ou no app Android, e o servidor roda cada partida.

Antes de chamar mais gente, eu queria responder uma pergunta simples: **quantas pessoas conseguem jogar ao mesmo tempo antes do jogo começar a travar?**

Então enchi o servidor de produção com jogadores falsos, achei o limite, fiz duas mudanças e testei de novo depois de cada uma. O resultado: o mesmo servidor pequeno agora aguenta **mais que o dobro de jogadores** que aguentava naquela manhã.

| Rodada | O que mudou | Jogadores com o jogo fluido |
|---|---|---|
| 1 | Nada (original) | **250**, e o servidor já estava no limite |
| 2 | Menos atualizações com a moeda parada | **400** (quebrou em 600) |
| 3 | Menos atualizações com a moeda em movimento | **600+** (limite ainda não encontrado) |

## Como o jogo funciona (versão curta)

O jogo é feito em **Elixir e Phoenix**. Cada partida é um processo próprio no servidor, e a **física roda no servidor**: o app só envia a direção e a força do chute, o servidor simula a moeda batendo nos pregos e depois manda o resultado para os dois jogadores. Assim ninguém consegue trapacear mexendo na moeda.

O porém é que o servidor precisa ficar avisando os dois celulares onde estão a moeda e os goleiros. Cada uma dessas mensagens é uma **atualização**, e o app desenha o tabuleiro a partir delas, como os quadros de um vídeo.

## O que é um teste de carga

Um programa fingiu ser centenas de celulares. Cada jogador falso se conectava ao servidor, entrava na fila, era pareado com outro jogador falso, mirava, chutava e começava uma nova partida quando uma terminava. É o mesmo trabalho que o servidor faz para pessoas de verdade.

Fui adicionando jogadores em etapas (250, depois 400, depois 600), mantive cada etapa por 2 minutos e observei se o jogo continuava fluido. Para medir "fluido" contei as **atualizações atrasadas**: as que chegaram mais de 70 ms depois do previsto. Algumas são normais na internet. Quando essa parcela não para de crescer, o servidor não está dando conta e os jogadores veem o jogo travar.

O servidor é pequeno de propósito: **2 núcleos de CPU e 4 GB de RAM**, dividido com outro app.

## Rodada 1: o original

O servidor mandava para cada jogador **30 atualizações por segundo, o tempo todo**, mesmo com a moeda parada e só os goleiros andando.

Com 100 jogadores, tudo certo. Com 250 jogadores, a CPU estava em 100% e as atualizações atrasadas subindo. Esse era o teto.

## Rodada 2: menos atualizações com a moeda parada

A maior parte de uma partida é gente pensando no próximo chute. Com a moeda parada, baixei para **10 atualizações por segundo**, e o app desliza os goleiros suavemente entre uma atualização e outra, então fica exatamente igual. Também passei a montar cada atualização **uma vez por partida em vez de uma vez por jogador**.

Agora 250 jogadores ficou confortável, com uns 25% de CPU sobrando. 400 jogadores continuou fluido. Com 600 jogadores o servidor sobrecarregou: as atualizações atrasadas passaram do meu limite de segurança de 2% e o teste parou sozinho depois de um minuto (chegou a 13% de atraso no fim).

## Rodada 3: menos atualizações com a moeda em movimento

Durante o chute passei de 30 para **15 atualizações por segundo**. Com menos quadros, o app podia "cortar caminho" ao desenhar uma batida, então cada atualização agora também lista os pontos exatos onde a moeda bateu num prego ou na parede. O app desenha o caminho real em vez de adivinhar.

600 jogadores ficou igual a 250: menos de 1% de atraso, nenhuma conexão caída e nenhum erro. Nessa rodada os jogadores falsos começaram 1.792 partidas e deram 20.124 chutes.

## Por que melhorou

![Mirando um chute no Jogo de Prego](/assets/img/elixir/jogo-de-prego-aiming.jpg)

Cada atualização custa trabalho para o servidor: montar, criptografar, enviar. Veja quantas atualizações cada jogador recebia por segundo com 250 jogadores:

| Rodada | Atualizações por jogador por segundo |
|---|---|
| 1 · original | 28,4 |
| 2 · primeira mudança | 17,8 |
| 3 · segunda mudança | 10,4 |

Cortar umas duas em cada três mensagens liberou a maior parte desse trabalho para mais jogadores. Pareamento, banco de dados e memória nunca foram o problema: o servidor respondeu rápido ao "me acha uma partida" em todas as rodadas.

**A lição:** a mensagem mais rápida é a que você não envia. Eu não precisava de um servidor maior nem de código mais rápido; precisava parar de mandar a mesma informação 30 vezes por segundo quando nada estava mudando.

## Todos os números

| Rodada | Jogadores | Atualizações/s (total) | Atrasadas | CPU sobrando | Resultado |
|---|---|---|---|---|---|
| 1 · original | 100 | 2.960 | 0,24% | alguma | Fluido |
| 1 · original | 250 | 7.100 | 0,73%, subindo | 0% | No limite |
| 2 · primeira mudança | 250 | 4.450 | 0,59% | ~25% | Fluido |
| 2 · primeira mudança | 400 | 6.900 | 0,57% | ~5–15% | Fluido |
| 2 · primeira mudança | 600 | 5.150 | 8,5% (até 13%) | 0% | Sobrecarregado |
| 3 · segunda mudança | 250 | 2.605 | 0,29% | não medido | Fluido |
| 3 · segunda mudança | 400 | 4.380 | 0,79% | não medido | Fluido |
| 3 · segunda mudança | 600 | 6.871 | 0,73% | não medido | Fluido |

A máquina de teste estava no Brasil e o servidor fica na Finlândia, a uns 250 ms de distância. Na rodada 2 com 600 jogadores saíram menos atualizações do que com 400, porque o servidor não dava conta.

## O que ter em mente

- **O limite real ainda é desconhecido.** A rodada 3 passou com 600 jogadores, a maior etapa que testei.
- **Não registrei a CPU na rodada 3**, então ainda não sei quanta folga sobrou.
- **Jogadores falsos são mais ativos que os reais.** Eles chutam depois de 0,5 a 3 segundos. Pessoas de verdade pensam mais, o que significa menos atualizações, então a capacidade real provavelmente é um pouco maior.
- **Cada rodada mediu o atraso de um jeito um pouco diferente**, usando a melhor regra para a forma como aquela versão envia atualizações. A tendência é clara, mas compare as porcentagens pequenas com cuidado.

O próximo passo é rodar etapas de 600, 800 e 1.000 jogadores registrando a CPU, para achar o novo teto.

Enquanto isso, vem jogar: [jogodeprego.allefgomes.com](https://jogodeprego.allefgomes.com). ⚽
