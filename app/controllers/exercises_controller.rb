class ExercisesController < ApplicationController
  before_action :exercise_setting, only: %i[edit update destroy]
  
  def index
    @exercises = current_user.exercises
  end

  def new
    @exercise = current_user.exercises.build
  end

  def create
    current_user.exercises.create(exercise_params)
    redirect_to exercises_path
  end

  def edit
  end

  def update
    @exercise.update(exercise_params)
    redirect_to exercises_path
  end

  def destroy
    @exercise.destroy
    redirect_to exercises_path
  end

  private

  def exercise_params
    params.require(:exercise).permit(:menstrual_cycle, :image, :comment, :user_id)
  end

  def exercise_setting
    @exercise = Exercise.find(params[:id])
  end
end
