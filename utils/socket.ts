import { io } from 'socket.io-client';

const socket = io('http://192.168.0.136:4000', {
	transports: ['websocket'],
});

export default socket;
