class HomesController < ApplicationController
  def index
  end

  def edit
    @menstruation_date = current_user.menstruation_date || Date.today
  end

  def update
    if params[:user][:menstrual_cycle_name]
      minus_day = 7 * User.menstruation.index(params[:user][:menstrual_cycle_name])
      current_user.menstruation_date = Date.today - minus_day.day
    else
      current_user.menstruation_date = params[:user][:menstruation_date]
    end
    if current_user.save
      redirect_to root_path, success: '登録しました。'
    else
      redirect_to root_path, warning: '値が不正です'
    end
  end
end
