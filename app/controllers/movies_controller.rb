class MoviesController < ApplicationController
  def index
    if current_user.menstruation_date.nil?
      redirect_to edit_homes_path
    else
      @menstruation_cycle = current_user.menstruation
      @movies = Movie.where(name: @menstruation_cycle).order(id: :desc).page(params[:page]).per(10)
    end
  end
end
