---
layout: post
title: "Skills vs Agents, explicado como se você tivesse cinco anos"
date: 2026-10-06 00:00:00 -0300
description: A explicação mais simples possível da diferença entre skills e agents em assistentes de IA como o Claude Code
img: software.jpg
tags: [AI, Claude, Agents, Skills]
---

Se você começou a usar assistentes de código com IA, como o Claude Code, provavelmente já ouviu duas palavras o tempo todo: **skills** e **agents**. Parecem a mesma coisa. Não são. Vamos deixar isso o mais simples possível.

## A cozinha

Imagine que a IA é **um cozinheiro numa cozinha**. Você é o cliente pedindo comida.

### Uma skill é uma ficha de receita 📄

Uma **skill** é uma ficha de receita que você entrega ao cozinheiro.

- O cozinheiro continua sendo **o mesmo cozinheiro**.
- Ele lê a ficha e agora sabe *como* fazer a lasanha do jeito que você gosta.
- Ele faz o trabalho **na sua frente**, na mesma cozinha.

A skill não faz nada sozinha. É só papel. Ela **ensina** o cozinheiro.

### Um agent é um segundo cozinheiro 👩‍🍳

Um **agent** (muitas vezes chamado de *subagent*) é **outro cozinheiro** que você chama para ajudar.

- É **outra pessoa**, trabalhando em **outra cozinha**.
- Você passa uma tarefa: *"vai comprar e picar todos os legumes"*.
- Ele vai, faz tudo sozinho e volta com **só o resultado**: uma tigela de legumes picados.
- Você não vê a bagunça que ele fez. Só recebe a tigela.

O agent **faz** o trabalho por você.

## A versão em uma frase

> Uma **skill** ensina a IA *como* fazer algo.
> Um **agent** é *outra IA* que faz algo por você.

## Lado a lado

| | Skill 📄 | Agent 👩‍🍳 |
|---|---|---|
| O que é? | Instruções | Um ajudante |
| Quem faz o trabalho? | A mesma IA | Uma IA separada |
| Onde o trabalho acontece? | Na sua conversa atual | Em uma conversa própria, separada |
| O que você vê? | Cada passo | Só a resposta final |
| Bom para | "Faça *desse* jeito" | "Vai fazer *isso* e me conta o que achou" |

## Por que eu deveria me importar?

**Memória.** Uma IA só consegue guardar uma certa quantidade de coisas na cabeça ao mesmo tempo (isso se chama *janela de contexto*).

- Quando você usa uma **skill**, tudo o que a IA lê e faz ocupa espaço na **sua** conversa. Tudo bem, você quer ver isso.
- Quando você usa um **agent**, ele lê 50 arquivos, faz a bagunça e volta com um resumo curto. A **sua** conversa continua limpa.

Então:

- Use uma **skill** quando quiser que a IA siga uma receita: "escreva commits nesse formato", "siga as cores da nossa marca", "revise o código usando esse checklist".
- Use um **agent** quando tiver um trabalho grande e barulhento que você não quer acompanhar: "procure no projeto inteiro onde tratamos pagamentos", "pesquise essas três bibliotecas e compare".

## No Claude Code, na prática

- Uma **skill** é uma pasta com um arquivo `SKILL.md` dentro. É literalmente um arquivo de texto com instruções. O Claude lê quando a tarefa combina e continua trabalhando com você.
- Um **agent** é definido em `.claude/agents/` (ou é um já embutido, como o `Explore`). O Claude inicia ele, ele trabalha sozinho e devolve um relatório.

E eles funcionam juntos: um agent pode usar skills. O segundo cozinheiro também sabe ler ficha de receita. 😉

## TL;DR

- **Skill = receita.** Mesmo cozinheiro, agora mais esperto.
- **Agent = cozinheiro extra.** Outro cozinheiro, faz o serviço e traz o resultado.

Pronto. Agora você sabe mais do que muita gente discutindo isso na internet.
