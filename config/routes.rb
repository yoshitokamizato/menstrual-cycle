Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users
  resources :cycle_records
  resources :meals
  resources :exercises
end
