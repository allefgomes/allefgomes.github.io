---
layout: post
title: "Agentic Autonomy Levels: Da Sugestão à Orquestração"
date: 2026-10-16 00:00:00 +0000
description: Entenda os 6 níveis de autonomia de agentes de IA, da assistência básica até a orquestração completa
img: ai/agentic-autonomy.png
tags: [AI, Agentes, Autonomia, LLM]
---

## Introdução

Agentes de IA não são uma coisa só. Existem diferentes graus de autonomia, e você precisa entender qual nível sua tarefa realmente precisa. Baseado no trabalho de [Addy Osmani](https://addyosmani.com/blog/agentic-autonomy-levels), aqui estão os 6 níveis.

---

## Level 0: Assist

O agente **sugere**. Você sempre decide.

- ✓ Sugestões geralmente boas, mas você decide se usa
- ✓ Autocomplete, inline suggestions no editor
- ✓ Sem execução automática

**Na prática:**
1. Você descreve a mudança que precisa
2. O agente propõe uma solução
3. Você aprova ou rejeita

**Exemplo:** Um LLM que sugere completar seu código enquanto você digita.

---

## Level 1: Supervised Action

O agente **edita ou executa, mas pede aprovação**.

- ✓ O agente faz ações em seu nome
- ✓ Sempre pede aprovação antes de mudanças consequentes
- ✓ Padrão para maioria das pessoas hoje

**Na prática:**
1. Você manda um prompt: "Refatore essa função"
2. O agente gera o código refatorado
3. Você revisa e aprova
4. O agente executa o commit

**Exemplo:** OpenCode gerando testes e pedindo confirmação antes de fazer push.

---

## Level 2: Scoped Task Delegation

Tarefa **limitada com objetivo claro**.

- ✓ Você delega com constraints bem definidas
- ✓ Agente trabalha autonomamente dentro desses limites
- ✓ Entrega com evidência de conclusão
- ✓ Centro da engenharia IA-assistida

**Na prática:**
1. Você delega: "Adicione testes com 90% coverage para o módulo X"
2. O agente cria testes e roda coverage
3. Prova: testes passam, coverage validado
4. Você valida e integra (ou pede ajustes)

**Exemplo:** Um agente que implementa testes automaticamente até atingir a meta de coverage.

---

## Level 3: Goal-Driven Autonomy

O agente faz o que for **necessário até atingir o objetivo**.

- ✓ Você define o objetivo (ex: "Reduza LCP abaixo de 1s")
- ✓ O agente faz ciclos: plan → act → test → review
- ✓ Continua até objetivo ser atingido
- ✓ Condição de parada deve ser mensurável

**Na prática:**
1. Objetivo: "Alcance 95% de coverage no módulo auth"
2. O agente entra em loop: escreve teste → roda → analisa gaps → repete
3. Quando coverage atinge 95%, agente para
4. Resultado pronto com evidência automatizada

**Exemplo:** Um agente que melhora performance de um site, testando diferentes otimizações até atingir a meta.

---

## Level 4: Parallel Delegation

**Muitos agentes trabalham em paralelo**.

- ✓ Múltiplos agentes, cada um em seu slice isolado
- ✓ Decomposição correta evita merge conflicts
- ✓ Suporta: subagents, worktrees, background sessions

**Na prática:**
1. Feature X = tarefa auth + tarefa API + tarefa DB
2. 3 agentes trabalham simultaneamente em worktrees
3. Você observa progresso de cada agente
4. Merge automático com testes validando tudo

**Exemplo:** 3 agentes desenvolvendo 3 features diferentes em paralelo, cada um em sua branch.

---

## Level 5: Managed-by-Exception Orchestration

Um **manager agent orquestra tudo**. Você só intervém em exceções.

- ✓ Agent manager: emite work, monitora, verifica, reexecuta
- ✓ Issue tracker como input, PRs resolvidas como output
- ✓ Você intervém apenas quando coisas dão errado
- ✓ Máxima economia de tempo humano

**Na prática:**
1. Manager agent lê GitHub Issues todos os dias
2. Para cada issue, spawna agentes worker especializados
3. Manager monitora progress, trata deadlocks
4. PRs prontas pra revisar (~5 min vs horas antes)

**Exemplo:** Um manager agent que lê um backlog, cria tarefas e distribui para workers que desenvolvem features do zero.

---

## Qual nível usar?

| Level | Quando usar | Risco | Benefício |
|-------|------------|-------|-----------|
| 0 | Exploração, ideação | Baixo | Rápido feedback |
| 1 | Tarefas pequenas | Baixo | Produtividade |
| 2 | Features bem definidas | Médio | Autonomia controlada |
| 3 | Objetivos mensuráveis | Médio-Alto | Menos iterações |
| 4 | Grandes features | Alto | Paralelização |
| 5 | Roadmap inteiro | Muito Alto | Automação completa |

---

## Segurança & Permissões

Quanto mais autonomia, mais você precisa de controles:

- **Harness**: infraestrutura que mantém o agente seguro (permissões, bloqueios)
- **Sandbox**: ambiente isolado onde o agente roda
- **Feedback loops**: validar saídas antes de integrar

A chave é: **nunca dê mais autonomia do que você consegue auditar**.

---

## Conclusão

Agentes não são tudo-ou-nada. Use o nível que sua tarefa realmente precisa. Comece small (Level 0-1), aprenda, ganhe confiança, e suba os níveis conforme necessário.

A melhor equipe será aquela que combina **humano + agentes** nos níveis certos.
