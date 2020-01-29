class MonologuesController < ApplicationController
  MAX_MONOLOGUE_NUM = 100
  DESTROY_MONOLOGUE_NUM = 20

  def index
    @monologues = current_user.monologues.recent
  end

  def create
    @monologue = current_user.monologues.create!(monologue_params)
    destroy_monologues
  end

  private

  def monologue_params
    params.require(:monologue).permit(:content)
  end

  def destroy_monologues
    if current_user.monologues.count >= MAX_MONOLOGUE_NUM
      current_user.monologues.order(created_at: :asc).limit(DESTROY_MONOLOGUE_NUM).destroy_all
    end
  end
end
