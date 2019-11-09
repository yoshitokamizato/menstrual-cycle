class ApplicationController < ActionController::Base
  # フラッシュの種類を増やすための設定
  add_flash_types :success, :info, :warning, :danger

  # ニックネームも編集できるようにするための設定
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!

  protected

  def configure_permitted_parameters
    update_attrs = [:name, :email, :password, :password_confirmation, :current_password]
    devise_parameter_sanitizer.permit :account_update, keys: update_attrs
  end
end
