class RoomsController < ApplicationController
  def show
    @monologues = Monologue.all.order(created_at: "DESC")
  end
end
