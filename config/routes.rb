Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users
  resources :periodic_records
end
