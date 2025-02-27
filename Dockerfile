# Use uma imagem Ruby slim como base
FROM ruby:2.5.5-slim

# Instale dependências necessárias, como ferramentas de compilação e Node.js (para assets, se necessário)
RUN apt-get update && apt-get install -y \
  build-essential \
  nodejs \
  && rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho
WORKDIR /srv/jekyll

# Copie o Gemfile e o Gemfile.lock (se existir) para aproveitar o cache do Docker
COPY Gemfile* ./

# Instale as gems definidas no Gemfile
RUN gem install bundler -v 2.1.4 && bundle install

# Copie o restante dos arquivos do seu site
COPY . .

# Exponha a porta padrão do Jekyll
EXPOSE 4000

# Comando para iniciar o Jekyll no modo "serve" e vincular a todas as interfaces
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]

