---
layout: post
title: PT-BR - Adicionando bootstrap 5 no projeto phoenix
date: 2022-12-20 00:00:00 +0300
description: Exemplificando como adicionar boostrap 5 em uma aplicação Phoenix
img: elixir/phoenix.png
tags: [Til, Elixir, Phoenix, Bootstrap]
---

Normalmente quando se fala de aplicação phoenix, se fala também de tailwindcss, mas nem todo mundo tem familiaridade com o tailwindcss e precisa de algo mais rápido para entregar.

Já o bootstrap ainda continua sendo bastante utilizado em aplicações web. Então a ideia desse tutorial é demostrar como aplicar o bootstrap nas suas aplicações phoenix de maneira rápida.

Para utilizarmos o boostrap, faremos a utilização da lib [dart_sass](https://hexdocs.pm/dart_sass/DartSass.html) que é um instalador e "executor" para [sass](https://sass-lang.com/dart-sass).

Então vamos lá... No seu arquivo `mix.exs` na função privada `deps`, adicione a seguinte linha:
```elixir
{:dart_sass, "~> 0.5.1"}
```
No arquivo `config/config.exs` adicione o código para adicionar as configurações do dart_sass: 
```elixir
config :dart_sass,
  version: "1.43.1",
  default: [
    args: ~w(css/app.scss ../priv/static/assets/app.css),
    cd: Path.expand("../assets", __DIR__)
  ]
```
Na parte de watchers no arquivo `config/dev.exs` iremos adicionar o seguinte código para que nossa aplicação phoenix possa assistir os arquivos sass:
```elixir
sass: {
      DartSass,
      :install_and_run,
      [:default, ~w(--embed-source-map --source-map-urls=absolute --watch)]
    }
```
Também no arquivo `mix.exs` iremos alterar os aliases. Na parte chamada `assets.deploy` iremos adicionar o código `"sass default --no-source-map --style=compressed"` onde ficará parecido com o código abaixo:
```elixir
"assets.deploy": ["esbuild default --minify", "sass default --no-source-map --style=compressed", "phx.digest"]
```

Para finalizar, faremos mais três alterações na pasta `assets`. A primeira é rodar o comando `npm install boostrap --prefix assets` e após isso, renomear o arquivo `assets/css/app.css` para `assets/css/app.scss` e iremos apagar todo o conteúdo do arquivo e adicionar o código 
```css
@import "../node_modules/bootstrap/scss/bootstrap";
```
E por fim, iremos remover o código `import "../css/app.css"` do arquivo `assets/js/app.js` e adicionar o código

```js
import "bootstrap"
```

Agora você pode subir a aplicação e ver que toda a sua tela inicial foi alterada.