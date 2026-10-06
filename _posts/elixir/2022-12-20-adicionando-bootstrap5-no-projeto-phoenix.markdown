---
layout: post
title: "Adding Bootstrap 5 to a Phoenix project"
date: 2022-12-20 00:00:00 +0300
description: A walkthrough of adding Bootstrap 5 to a Phoenix application
img: elixir/phoenix.png
tags: [TIL, Elixir, Phoenix, Bootstrap]
---

Phoenix applications usually come with Tailwind CSS, but not everyone is familiar with Tailwind, and sometimes you need something faster to ship.

Bootstrap is still widely used in web applications. So the goal of this tutorial is to show how to add Bootstrap to your Phoenix applications quickly.

To use Bootstrap, we'll rely on the [dart_sass](https://hexdocs.pm/dart_sass/DartSass.html) library, an installer and runner for [Sass](https://sass-lang.com/dart-sass).

Let's go... In your `mix.exs` file, inside the private `deps` function, add the following line:
```elixir
{:dart_sass, "~> 0.5.1"}
```
In `config/config.exs`, add the dart_sass configuration:
```elixir
config :dart_sass,
  version: "1.43.1",
  default: [
    args: ~w(css/app.scss ../priv/static/assets/app.css),
    cd: Path.expand("../assets", __DIR__)
  ]
```
In the watchers section of `config/dev.exs`, add the following code so your Phoenix app watches the Sass files:
```elixir
sass: {
      DartSass,
      :install_and_run,
      [:default, ~w(--embed-source-map --source-map-urls=absolute --watch)]
    }
```
Also in `mix.exs`, we'll change the aliases. In `assets.deploy`, add `"sass default --no-source-map --style=compressed"` so it looks like the code below:
```elixir
"assets.deploy": ["esbuild default --minify", "sass default --no-source-map --style=compressed", "phx.digest"]
```

To finish, we'll make three more changes in the `assets` folder. First, run `npm install bootstrap --prefix assets`. Then rename `assets/css/app.css` to `assets/css/app.scss`, delete all of its content and add:
```css
@import "../node_modules/bootstrap/scss/bootstrap";
```
Finally, remove `import "../css/app.css"` from `assets/js/app.js` and add:

```js
import "bootstrap"
```

Now start the application and you'll see the whole home page has changed.
