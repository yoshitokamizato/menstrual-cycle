class MoviesController < ApplicationController
  def index
    if current_user.menstruation_date.nil?
      redirect_to movies_edit_path
    else
      @menstruation_cycle = current_user.menstruation
      @movies = Movie.where(name: @menstruation_cycle).order(id: :desc).page(params[:page]).per(10)
    end
  end

  def edit
    @menstruation_date = current_user.menstruation_date || Date.today
  end

  def update
    if params[:user][:menstrual_cycle_name]
      binding.pry
      minus_day = 7 * User.menstruation.index(params[:user][:menstrual_cycle_name])
      current_user.menstruation_date = Date.today - minus_day.day
    else
      current_user.menstruation_date = params[:user][:menstruation_date]
    end
    if current_user.save
      redirect_to movies_path, success: '登録しました。'
    else
      redirect_to movies_edit_path, warning: '値が不正です'
    end
  end
end
