import { Reducer } from 'redux';
import { WebSocketActionTypes, WebSocketAction } from '../actions/wsActions';

interface WebSocketState {
  ws: WebSocket | null;
  isConnected: boolean;
  messages: string[];
}

const initialState: WebSocketState = {
  ws: null,
  isConnected: false,
  messages: [],
};

const wsReducer: Reducer<WebSocketState, WebSocketAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case WebSocketActionTypes.WS_CONNECT:
      return {
        ...state,
        ws: new WebSocket(action.payload.url),
        isConnected: true,
      };

    case WebSocketActionTypes.WS_DISCONNECT:
      if (state.ws) {
        state.ws.close();
      }
      return {
        ...state,
        ws: null,
        isConnected: false,
      };

    case WebSocketActionTypes.WS_SEND_MESSAGE:
      if (state.ws) {
        state.ws.send(action.payload.message);
      }
      return state;

    case WebSocketActionTypes.WS_MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };

    default:
      return state;
  }
};

export default wsReducer;
