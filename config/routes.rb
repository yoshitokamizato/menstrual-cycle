Rails.application.routes.draw do
  root 'homes#index'
  # 新規登録できなくするための設定を含む
  devise_for :users, skip: :registrations
  devise_scope :user do
    get 'users/edit', to: 'devise/registrations#edit', :as => 'edit_user_registration'
    patch 'users', to: 'devise/registrations#update', :as => 'user_registration'
    put 'users', to: 'devise/registrations#update', :as => nil
    delete 'users', to: 'devise/registrations#destroy', :as => nil
  end
  # 管理者画面
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # 生理記録管理画面
  resources :cycle_records, only: %i[index new create]
  # editとupdateを，idを渡さずに使えるようにする
  get 'cycle_records/edit', to: 'cycle_records#edit'
  post 'cycle_records/update', to: 'cycle_records#update'

  resources :movies, only: :index
  get 'movies/edit', to: 'movies#edit'
  patch 'movies/update', to: 'movies#update'

  resources :meals
  resources :exercises
  resources :rooms, only: [:show]
  mount ActionCable.server => '/cable'
end
