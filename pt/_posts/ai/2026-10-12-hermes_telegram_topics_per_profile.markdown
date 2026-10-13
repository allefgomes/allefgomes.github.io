---
layout: post
title: "Um tópico do Telegram para cada agente de IA: configurando o Hermes com um perfil para cada função"
date: 2026-10-12 20:00:00 -0300
description: Como corrigi um Hermes que usava o provedor errado sem eu perceber e dei a cada tópico do Telegram um perfil especialista, incluindo um grupo privado para dados pessoais
img: software.jpg
tags: [AI, Hermes, Telegram, Agents, Claude]
---

Eu uso o [Hermes](https://hermes-agent.nousresearch.com), um agente que fica por trás de um bot do Telegram. A ideia era simples: um grupo do Telegram para trabalho, com um **tópico para cada especialista** (pesquisa, desenvolvedor, marketing...), para que cada conversa vá para o agente certo. Ontem sentei para deixar isso funcionando e apareceram algumas surpresas. Aqui está tudo o que fiz, em ordem.

## O problema: "por que está usando Copilot?"

Tudo começou com um banner de inicialização que mostrava `Provider: copilot`, quando eu queria usar a minha **assinatura da Anthropic**. Investigando, achei a causa:

- O Hermes tem **perfis**. Cada perfil é um agente completo, com configuração, memória, sessões e credenciais próprias.
- Cinco dos meus seis perfis estavam com `provider: copilot`. Só o `orchestrator` usava `anthropic`.
- Trocar foi uma linha no `config.yaml` de cada perfil. Essa foi a parte fácil.

## "Usar a assinatura, não uma API key"

O Hermes consegue usar a assinatura do Claude por meio de um **token OAuth** (começa com `sk-ant-oat`) em vez de uma API key paga por uso. Eu já tinha um no `.env` principal, e o `hermes auth list` mostrava como credencial `oauth`. Dá para criar um com `hermes auth add anthropic --type oauth` ou com `claude setup-token`.

## O bug de verdade: as credenciais são por perfil

Depois da troca, alguns tópicos continuavam com erro de conexão, enquanto o agente padrão funcionava. Os logs contaram a história: o Gemini estava sem cota, e o fallback do Copilot recusava o nome do modelo Claude. A Anthropic nem chegava a ser tentada.

O motivo: **cada perfil tem o próprio `.env`**, e só o orchestrator tinha uma chave da Anthropic. Os outros cinco não tinham como se autenticar. Copiei o token para o `.env` de cada perfil e os erros acabaram.

Lição: quando você tem vários perfis, "funciona no padrão" não diz nada sobre os outros.

## Reiniciar nem sempre reinicia

Dois detalhes me custaram tempo:

1. O `hermes gateway restart` reiniciou só o **perfil ativo**, não o gateway principal. O comando que eu precisava era `hermes -p default gateway restart`.
2. O gateway lê as **rotas dos tópicos só quando inicia**. Eu adicionei rotas e nada mudou até reiniciar. Um bom sinal: o `gateway.pid` ganha um novo horário e um novo PID.

## Um tópico, um perfil

O roteamento é uma lista no `config.yaml` principal. Cada item liga um `chat_id` e um `thread_id` do Telegram (o tópico) a um perfil:

```yaml
profile_routes:
  - name: topic-developer
    platform: telegram
    profile: developer
    chat_id: "<id do grupo>"
    thread_id: "13"
    enabled: true
```

Para testar, leio os nomes das sessões no `gateway.log`. Uma mensagem no tópico do desenvolvedor aparece como `agent:developer:telegram:group:...:13`. Se aparecer `agent:main`, a mensagem foi para o agente padrão e a rota não está ativa.

O tópico **Geral** do grupo não tem rota, então sempre cai no agente padrão. Isso é esperado.

## Dados pessoais merecem um grupo separado

Depois quis mais dois agentes:

- **financial**: eu mando receitas e despesas em texto livre e peço relatórios.
- **calendar**: ligado ao meu Google Calendar, para ler, mover, criar e apagar compromissos, mais uma mensagem todo dia às 6h com a agenda.

São dados **pessoais**, enquanto os outros tópicos são dados de **trabalho**. Então tomei três decisões:

- Um **grupo privado separado no Telegram**, com tópicos próprios, em vez de novos tópicos no grupo de trabalho.
- Perfis próprios, para que memória, sessões e arquivos não sejam compartilhados com os agentes de trabalho.
- O **modelo mais barato do Gemini** (`gemini-3.5-flash-lite`) com chave própria, já que as tarefas são pequenas. Um modelo gratuito fica como fallback.

Cada perfil também tem um `SOUL.md`, o arquivo que define a personalidade e as regras do agente. O financeiro registra cada lançamento numa planilha, nunca inventa um valor e pergunta quando algo não está claro. O de calendário confirma antes de mover ou apagar qualquer coisa. Os dois são instruídos a nunca mencionar os tópicos de trabalho.

Um aviso honesto: os perfis separam memória e sessões, mas todos rodam na mesma máquina. Uma pasta no meu diretório pessoal pode ser lida por qualquer agente que navegue pelo disco. Para dados realmente privados, mantenha os arquivos dentro da pasta do próprio perfil.

## A cadeia de fallback

Também defini uma ordem clara para quando um provedor falha: **Anthropic primeiro, depois Gemini, depois um modelo gratuito**. Assim, um limite de uso em um provedor deixa de virar "não consegui conectar ao serviço de modelo de IA".

## O que ainda falta

O agente de calendário ainda precisa do **login no Google Calendar**. Esse passo precisa do meu navegador e do meu consentimento, então é comigo. Quando funcionar, a agenda das 6h é um único cron job: `hermes cron create "0 6 * * *"`, com o fuso horário configurado para o meu.

## O que eu diria a mim mesmo ontem de manhã

- Perfis são agentes separados. Confira as credenciais de **cada um**.
- Reinicie o gateway certo e confirme com o PID e o log.
- Leia os nomes das sessões nos logs. Eles mostram qual perfil respondeu.
- Separe dados pessoais e de trabalho em grupos diferentes e dê um modelo mais barato aos agentes pessoais.
