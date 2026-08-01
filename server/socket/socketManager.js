import { Server } from 'socket.io';

let ioInstance = null;

/**
 * Initializes Socket.io real-time state machine server.
 *
 * @param {Object} httpServer - Node.js HTTP Server instance
 * @returns {Server} Socket.io server instance
 */
export const initializeSocket = (httpServer) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  ioInstance = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log(`[Socket Connected]: ${socket.id}`);

    // Join scenario room for isolated simulation sessions
    socket.on('join_scenario', ({ userProgressId }) => {
      if (userProgressId) {
        const roomName = `scenario:${userProgressId}`;
        socket.join(roomName);
        console.log(`[Socket ${socket.id}] joined room ${roomName}`);
        socket.emit('joined_room', { room: roomName, status: 'success' });
      }
    });

    // Leave scenario room
    socket.on('leave_scenario', ({ userProgressId }) => {
      if (userProgressId) {
        const roomName = `scenario:${userProgressId}`;
        socket.leave(roomName);
        console.log(`[Socket ${socket.id}] left room ${roomName}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected]: ${socket.id}`);
    });
  });

  return ioInstance;
};

/**
 * Get active Socket.io instance
 */
export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io server has not been initialized');
  }
  return ioInstance;
};

/**
 * Broadcast event to a scenario room
 *
 * @param {string} userProgressId - Scenario session ID
 * @param {string} event - Event name
 * @param {Object} payload - Event payload
 */
export const broadcastToScenario = (userProgressId, event, payload) => {
  if (ioInstance) {
    ioInstance.to(`scenario:${userProgressId}`).emit(event, payload);
  }
};
