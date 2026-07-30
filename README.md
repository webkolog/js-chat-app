# JS Chat Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version Required](https://img.shields.io/badge/node-%3E%3D%2018.0.0-339933.svg)](https://nodejs.org)

**Version:** 1.0.0

**Created & Updated Date:** 2026-01-12

**Created By:** Ali Candan ([@webkolog](https://github.com/webkolog))

**Website:** [http://webkolog.net](http://webkolog.net)

**Copyright:** (c) 2026 Ali Candan

**License:** MIT License ([http://mit-license.org](http://mit-license.org))

---

**JS Chat Application** is a lightweight, high-performance real-time chat application built with Node.js, Express 5.x, and Socket.io 4.x. It features dynamic room creation, real-time message broadcasting, typing indicators, and a secure message delivery system with instant "Seen/Read" status tracking. The application is designed to be highly modular, modern, and easily integrable into custom web platforms.

## Features

* ⚡ **Real-Time Communication:** Powered by `Socket.io` and raw `WebSockets` (`ws`) for low-latency, bi-directional event handling.
* 🏨 **Room Isolation:** Users can dynamically type a room name to join private or structured channels seamlessly.
* 💬 **Rich Chat Features:** Built-in message tracking system that logs sender details and timestamps.
* ✍️ **Typing Indicators:** Real-time visibility when a peer is actively typing (`is typing...`), with an automatic 2-second timeout buffer.
* 👁️ **Seen / Read Receipts:** Visual tracking (`✓ Seen`) triggered instantly via event acknowledgements when remote clients receive messages.
* 🌐 **Express 5.x Backbone:** Fast and minimal HTTP routing backend optimized with native async/await error handling.

## Installation & Setup

1. Clone or download the repository to your local machine:
```bash
   git clone https://github.com/webkolog/js-chat-app.git
   cd js-chat-app
```

2. Install the locked production and development dependencies:
```bash
npm install
```


3. Start the real-time server:
```bash
npm start
```


4. Open your web browser and navigate to `http://localhost:3000` (or your custom configured port).

---

## Application Architecture Overview

### Client-Side (Frontend Workflow)

The client interacts with the WebSocket server via an event-driven lifecycle inside `public/index.html`:

* **Joining Channels:** Dispatches a `join_room` action with a payload carrying the target workspace ID.
* **Broadcasting Messages:** Emits a `send_message` payload with unique structural identifiers (`msgId`) to guarantee reliable UI updates.
* **Receipt Tracking:** Automatically listens to foreign inputs and evaluates ownership before bubbling up a `message_read` event to flip states globally.

```javascript
// Example client acknowledgement snippet
socket.on('receive_message', (data) => {
    // Append message to DOM view dynamically
    if(data.sender !== document.getElementById('username').value) {
        socket.emit('message_read', { room: currentRoom, msgId: data.msgId });
    }
});

```

### Server-Side (Event Handlers)

The server listens for standard socket triggers and channels them safely within target rooms:

| Event | Payload Context | Action Behavior |
| --- | --- | --- |
| `join_room` | `roomName` | Subscribes socket context to specific namespace channel. |
| `send_message` | `{ room, message, sender, msgId }` | Emits messages instantly to all clients grouped in the destination room. |
| `typing` | `{ room, user, isTyping }` | Relays ephemeral state shifts to notify room participants. |
| `message_read` | `{ room, msgId }` | Pushes back global updates to update individual node visibility status (`✓ Seen`). |

## Contributing

Contributions are welcome! If you find bugs, security improvements, or want to expand this application into a persistent datastore setup (e.g., SQLite/MongoDB), feel free to open an issue or submit a pull request.

## Support

For questions, troubleshooting, or general inquiries regarding JS Chat Application, please visit the GitHub issues page or contact the author via [http://webkolog.net](http://webkolog.net).

## License

This project is open-source software licensed under the [MIT license](http://mit-license.org/).
