const JWT = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
	// const authHeader = req.headers["authorization"];
	// const token = authHeader && authHeader.split(" ")[1]; // Bearer Token
	const token = req.header('x-auth-token');

	// If token not found, send error message
	if (!token) {
		return res.status(401).json({
			success: false,
			errors: [
				{
					msg: 'Token not found',
				},
			],
		});
	} else {
		// Authenticate token
		try {
			const user = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.user = user;
			next();
		} catch (error) {
			return res.status(403).json({
				success: false,
				errors: [
					{
						msg: 'Invalid token',
					},
				],
			});
		}
	}
};

module.exports = verifyToken;
