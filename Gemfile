source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.4'

gem 'rails', '~> 5.2.3'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 3.11'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
# gem 'coffee-rails', '~> 4.2'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'
gem 'bootsnap', '>= 1.1.0', require: false

# 以下，追加分
gem 'bootstrap', '~> 4.3.1'

# 日本語化，ログイン機能
gem 'activeadmin'
gem 'devise'
gem 'devise-i18n'
gem 'devise-i18n-views'
gem 'devise-bootstrap-views'
gem 'jquery-rails'
gem 'rails-i18n'

# 画像投稿機能
gem 'carrierwave'
gem 'rmagick'

# チャート（折れ線グラフ）
gem 'chart-js-rails'
gem 'gon'

# カレンダーフォーム
gem 'flatpickr'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]

  # 以下，追加分
  gem 'spring-commands-rspec'
  gem 'factory_bot_rails'
  gem 'rspec-rails'
  gem 'pry-rails'
  gem 'pry-byebug'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  gem 'chromedriver-helper'

  # 以下，追加分
  gem 'launchy'
  gem 'webdrivers'
  gem 'rspec_junit_formatter'
end

# Windows環境での開発ではないので削除
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
