---
layout: post
title: "Conceitos de Programação Funcional"
date: 2020-04-29 00:00:00 +0300
description: Programação funcional é um paradigma de programação.
img: software.jpg
tags: [TIL, Programação Funcional, Software]
---

Programação funcional é um paradigma de programação. Um paradigma de programação é o conjunto de regras e princípios de design para construir software; é uma forma de pensar sobre uma linguagem de programação. O paradigma funcional foca em construir software usando funções puras, organizadas de um jeito que descreve o que o software deve fazer, e não como deve fazer.

## Funções de primeira classe e de ordem superior

Funções de ordem superior são funções que podem receber outras funções como argumentos ou retorná-las como resultado. No cálculo, um exemplo de função de ordem superior é o operador diferencial _d/dx_, que retorna a derivada de uma função _f_.

A diferença entre os dois termos é sutil: "ordem superior" descreve um conceito matemático de funções que operam sobre outras funções, enquanto "primeira classe" é um termo da ciência da computação para entidades de uma linguagem que não têm restrições de uso.

## Imutabilidade

Todos os valores são imutáveis. Uso a linguagem _Elixir_ neste exemplo:

```elixir
list = [1, 2, 3, 4]
List.delete_at(list, -1)
# => [4]

list ++ [1]
# => [1, 2, 3, 4, 1]

IO.inspect(list)
# => # => [1, 2, 3, 4]
```

## Funções puras

Funções puras têm estas propriedades:

* Os valores são imutáveis
* O resultado da função depende apenas dos seus argumentos
* A função não gera efeitos além do valor que retorna

Um exemplo simples:

```elixir
add2 = fn (n) -> n + 2 end add2.(2)
# => 4
```

## Código declarativo

Programar de forma declarativa costuma gerar menos código do que programar de forma imperativa. Menos código significa menos coisas para escrever, mais coisas feitas e menos bugs.

Para ver a diferença entre imperativo e declarativo, vamos olhar um exemplo simples que transforma uma lista de strings em maiúsculas.

Este exemplo usa a mentalidade imperativa com JavaScript
```javascript
var list = ["we", "learning", "about fp"];

function upcase(list) {
    var newList = [];
    for (var i = 0; i < list.length; i++) {
        newList.push(list[i].toUpperCase());
    }
    return newList;
}

upcase(list);
// => ["WE", "LEARNING", "ABOUT FP"]
```

e este exemplo usa a mentalidade declarativa com Elixir
```elixir
defmodule StringList do
  def upcase([]), do: []
  def upcase([first | rest]), do: [String.upcase(first) | upcase(rest)]
end

StringList.upcase(["we", "learning", "about fp"])
# => ["WE", "LEARNING", "ABOUT FP"]
```
