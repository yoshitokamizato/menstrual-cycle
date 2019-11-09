class RoomsController < ApplicationController
  def show
    @monologues = Monologue.all
  end
end
