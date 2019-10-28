class MealsController < ApplicationController

  def index
    @meals = Meal.all
  end

  def new
    @meal = Meal.new
  end

  def create
    Meal.create(menstrual_cycle: meal_params[:menstrual_cycle], image: meal_params[:image], comment: meal_params[:comment], user_id: current_user.id)
    redirect_to :action => "index"
  end

  def edit
    @meal = Meal.find(params[:id])
  end

  def update
    meal = Meal.find(params[:id])
    meal.update(meal_params)
    redirect_to :action => "index"
  end

  def destroy
    meal = Meal.find(params[:id])
    meal.destroy
    redirect_to :action => "index"
  end

  private

  def meal_params
    params.require(:meal).permit(:menstrual_cycle, :image, :comment, :user_id)
  end
end
