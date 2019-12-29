// App.room = App.cable.subscriptions.create("RoomChannel", {
//     connected: function () {
//         // Called when the subscription is ready for use on the server
//     },
//
//     disconnected: function () {
//         // Called when the subscription has been terminated by the server
//     },
//
//     received: function (monologue) {
//         // Called when there's incoming data on the websocket for this channel
//         const monologues = document.getElementById('monologues')
//         monologues.innerHTML += `<p>${monologue}</p>`
//         window.scroll(0, $(document).height());
//     },
//
//     speak: function (content) {
//         return this.perform('speak', {monologue: content});
//     }
// });
