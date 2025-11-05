import { useEffect, useRef } from "react";
import { useBPMN } from "../lib/stores/useBPMN";
import type { BPMNProcess } from "../lib/bpmnParser";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const { setUsers, setCurrentUserId, setProcess, process, currentUserId } = useBPMN();
  const processRef = useRef<BPMNProcess | null>(process);
  const currentUserIdRef = useRef<string>(currentUserId);
  const shouldBroadcastRef = useRef<boolean>(true);

  useEffect(() => {
    processRef.current = process;
  }, [process]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'welcome':
            console.log('Received welcome:', data.userId, data.userName);
            setCurrentUserId(data.userId);
            break;

          case 'users':
            console.log('Received users update:', data.users.length, 'users');
            setUsers(data.users);
            break;

          case 'process':
            if (data.fromUserId !== currentUserIdRef.current) {
              console.log('Applying process update from another user');
              shouldBroadcastRef.current = false;
              setProcess(data.process);
            }
            break;

          default:
            console.log('Unknown WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [setUsers, setCurrentUserId, setProcess]);

  useEffect(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !process || !currentUserId) {
      return;
    }

    if (shouldBroadcastRef.current) {
      console.log('Broadcasting local process update');
      wsRef.current.send(JSON.stringify({
        type: 'process',
        process,
        fromUserId: currentUserId,
      }));
    } else {
      console.log('Skipping broadcast for remote process update');
      shouldBroadcastRef.current = true;
    }
  }, [process, currentUserId]);

  return wsRef;
}
