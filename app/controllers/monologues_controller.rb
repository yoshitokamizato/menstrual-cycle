class MonologuesController < ApplicationController
  def index
    @monologues = current_user.monologues
  end

  def create
    @monologue = current_user.monologues.create!(monologue_params)
  end

  private

  def monologue_params
    params.require(:monologue).permit(:content)
  end
end
