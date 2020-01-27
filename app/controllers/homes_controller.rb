class HomesController < ApplicationController
  def index
    @menstruation = current_user.menstruation_top
    @message = Cycle.find_by(cycle: current_user.menstruation).content
  end

  def edit
    @menstruation_date = current_user.menstruation_date || Date.today
  end

  def update
    if params[:user][:menstrual_cycle_name]
      minus_day = 7 * Cycle.menstruation.index(params[:user][:menstrual_cycle_name])
      current_user.menstruation_date = Date.today - minus_day.day
    else
      current_user.menstruation_date = params[:user][:menstruation_date]
    end
    if current_user.save
      redirect_to root_path, success: '生理周期を登録しました。'
    else
      redirect_to root_path, warning: 'エラーが発生しました。'
    end
  end
end
