class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    monologue = Monologue.create!(content: data['monologue'])
    template = ApplicationController.renderer.render(partial: 'monologues/monologue', locals: {monologue: monologue})
    ActionCable.server.broadcast 'room_channel', template
  end
end
