class MoviesController < ApplicationController
  def index
    if current_user.menstruation_date.nil?
      redirect_to movies_edit_path
    else
      @menstruation = Menstruation.my_menstruation(current_user.menstruation_date)
      @movies = @menstruation.movies.order(id: :desc).page(params[:page]).per(10)
    end
  end

  def edit
    @menstrual_cycles = Menstruation.all
  end

  def update
    if params[:user][:menstrual_cycle_name]
      minus_day = 7 * Menstruation.ids.index(params[:user][:menstrual_cycle_name].to_i)
      current_user.menstruation_date = Date.today - minus_day
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
