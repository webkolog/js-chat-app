const ioc = require('socket.io-client');
const { server, io } = require('../server');

describe('JS Chat App - Socket.io Integration Tests', () => {
  let clientSocket1, clientSocket2;
  let port;

  beforeAll((done) => {
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    io.close();
    server.close(done);
  });

  beforeEach((done) => {
    clientSocket1 = ioc(`http://localhost:${port}`);
    clientSocket2 = ioc(`http://localhost:${port}`);

    let connectedCount = 0;
    const checkConnect = () => {
      connectedCount++;
      if (connectedCount === 2) done();
    };

    clientSocket1.on('connect', checkConnect);
    clientSocket2.on('connect', checkConnect);
  });

  afterEach(() => {
    if (clientSocket1.connected) clientSocket1.disconnect();
    if (clientSocket2.connected) clientSocket2.disconnect();
  });

  test('User should join room and broadcast message', (done) => {
    const testData = {
      room: 'general',
      message: 'Hello World',
      sender: 'Ali',
      msgId: 'msg_123'
    };

    clientSocket1.emit('join_room', 'general');
    clientSocket2.emit('join_room', 'general');

    clientSocket2.on('receive_message', (data) => {
      expect(data.sender).toBe('Ali');
      expect(data.message).toBe('Hello World');
      expect(data.room).toBe('general');
      done();
    });

    setTimeout(() => {
      clientSocket1.emit('send_message', testData);
    }, 50);
  });

  test('Typing status should be broadcasted to other user in room', (done) => {
    clientSocket1.emit('join_room', 'dev-room');
    clientSocket2.emit('join_room', 'dev-room');

    clientSocket2.on('display_typing', (data) => {
      expect(data.user).toBe('Ali');
      expect(data.isTyping).toBe(true);
      done();
    });

    setTimeout(() => {
      clientSocket1.emit('typing', { room: 'dev-room', user: 'Ali', isTyping: true });
    }, 50);
  });

  test('Read receipt (message_read) should notify sender', (done) => {
    clientSocket1.emit('join_room', 'dev-room');
    clientSocket2.emit('join_room', 'dev-room');

    clientSocket1.on('update_read_status', (data) => {
      expect(data.msgId).toBe('msg_999');
      done();
    });

    setTimeout(() => {
      clientSocket2.emit('message_read', { room: 'dev-room', msgId: 'msg_999' });
    }, 50);
  });
});
