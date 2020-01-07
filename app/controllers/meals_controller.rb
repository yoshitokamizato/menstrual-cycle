class MealsController < ApplicationController
  before_action :meal_setting, only: %i[edit update destroy]

  def index
    @meals = current_user.meals
  end

  def new
    @meal = current_user.meals.build
  end

  def create
    @meal = current_user.meals.create(meal_params)
    redirect_to meals_path
  end

  def edit
  end

  def update
    @meal.update(meal_params)
    redirect_to meals_path
  end

  def destroy
    @meal.destroy
    redirect_to meals_path
  end

  private

  def meal_params
    params.require(:meal).permit(:menstrual_cycle, :image, :comment, :user_id)
  end

  def meal_setting
    @meal = Meal.find(params[:id])
  end
end
