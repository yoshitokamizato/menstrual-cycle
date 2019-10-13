class ExercisesController < ApplicationController
  def index
    @exercises = Exercise.all
  end

  def new
    @exercise = Exercise.new
  end

  def create
    Exercise.create(menstrual_cycle: exercise_params[:menstrual_cycle], image: exercise_params[:image], comment: exercise_params[:comment], user_id: current_user.id)
    redirect_to :action => "index"
  end

  def edit
    @exercise = Exercise.find(params[:id])
  end

  def update
    exercise = Exercise.find(params[:id])
    exercise.update(menstrual_cycle: exercise_params[:menstrual_cycle], image: exercise_params[:image], comment: exercise_params[:comment], user_id: current_user.id)
    redirect_to :action => "index"
  end

  def destroy
    exercise = Exercise.find(params[:id])
    exercise.destroy
    redirect_to :action => "index"
  end

  private

  private

  def exercise_params
    params.require(:exercise).permit(:menstrual_cycle, :image, :comment, :user_id)
  end
end
