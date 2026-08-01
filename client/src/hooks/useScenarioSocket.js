import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Custom hook for scenario WebSockets real-time state machine communication.
 *
 * @param {string} sessionId - UserProgress session ID
 */
export const useScenarioSocket = (sessionId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [npcMessage, setNpcMessage] = useState(null);
  const [lastCompletedTicket, setLastCompletedTicket] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    // Connect to Socket.io server
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_scenario', { userProgressId: sessionId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('EVALUATION_STARTED', (data) => {
      setIsEvaluating(true);
      setLogs((prev) => [...prev, `[System]: Evaluation started for ticket ${data.ticketId}...`]);
    });

    socket.on('EVALUATION_LOG', (data) => {
      if (data.log) {
        setLogs((prev) => [...prev, data.log]);
      }
    });

    socket.on('EVALUATION_COMPLETED', (data) => {
      setIsEvaluating(false);
      if (data.npcMessage) {
        setNpcMessage(data.npcMessage);
      }
      if (data.success) {
        setLastCompletedTicket(data.ticketId);
        setLogs((prev) => [
          ...prev,
          `[System]: Ticket ${data.ticketId} evaluation PASSED! (+${data.earnedXp} XP)`,
        ]);
      } else {
        setLogs((prev) => [...prev, `[System]: Ticket ${data.ticketId} evaluation FAILED.`]);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave_scenario', { userProgressId: sessionId });
        socket.disconnect();
      }
    };
  }, [sessionId]);

  const clearLogs = useCallback(() => setLogs([]), []);
  const clearNpcMessage = useCallback(() => setNpcMessage(null), []);

  return {
    isConnected,
    isEvaluating,
    logs,
    npcMessage,
    lastCompletedTicket,
    clearLogs,
    clearNpcMessage,
  };
};

export default useScenarioSocket;
