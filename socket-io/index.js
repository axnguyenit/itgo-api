const socket = require('socket.io');

const socketIO = (server) => {
	const io = socket(server, {
		cors: {
			origin: '*',
		},
	});
	io.on('connection', (socket) => {
		console.log('socket established');
	});
};

module.exports = socketIO;
