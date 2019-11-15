App.room = App.cable.subscriptions.create("RoomChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server
    console.log('connected')
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(monologue) {
    // Called when there's incoming data on the websocket for this channel
    const monologues = document.getElementById('monologues')
    monologues.innerHTML += `<p>${monologue}</p>`
  },

  speak: function(content) {
    return this.perform('speak', {monologue: content});
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('chat-input')
  const button = document.getElementById('button')
  button.addEventListener('click', function() {
    const content = input.value
    App.room.speak(content)
    input.value = ''
  })
})
