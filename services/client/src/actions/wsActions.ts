import { Action } from 'redux';

export enum WebSocketActionTypes {
  WS_CONNECT = 'WS_CONNECT',
  WS_DISCONNECT = 'WS_DISCONNECT',
  WS_SEND_MESSAGE = 'WS_SEND_MESSAGE',
  WS_MESSAGE_RECEIVED = 'WS_MESSAGE_RECEIVED',
}

export interface WebSocketAction extends Action<WebSocketActionTypes> {
  payload?: any;
}

export const connectWebSocket = (url: string): WebSocketAction => ({
  type: WebSocketActionTypes.WS_CONNECT,
  payload: { url },
});

export const disconnectWebSocket = (): WebSocketAction => ({
  type: WebSocketActionTypes.WS_DISCONNECT,
});

export const sendMessage = (message: string): WebSocketAction => ({
  type: WebSocketActionTypes.WS_SEND_MESSAGE,
  payload: { message },
});

export const messageReceived = (message: string): WebSocketAction => ({
  type: WebSocketActionTypes.WS_MESSAGE_RECEIVED,
  payload: { message },
});
