FROM ruby:3.3-slim

RUN apt-get update && apt-get install -y --no-install-recommends build-essential git && rm -rf /var/lib/apt/lists/*
WORKDIR /srv/jekyll
COPY Gemfile jekyll-theme-simple-texture.gemspec ./
RUN bundle install
EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload"]

