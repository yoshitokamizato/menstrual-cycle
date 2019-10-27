Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users
  resources :meals
  resources :exercises
  resources :rooms, only: [:show]
  mount ActionCable.server => '/cable'
end
