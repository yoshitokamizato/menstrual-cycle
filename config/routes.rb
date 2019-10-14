Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users
  resources :meals
  resources :exercises
end
