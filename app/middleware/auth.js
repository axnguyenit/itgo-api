const JWT = require('jsonwebtoken');

const authToken = async (req, res, next) => {
	const token = req.header('x-auth-token');

	// If token not found, send error message
	if (!token) {
		return res.status(401).json({
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
			req.user = user.email;
			next();
		} catch (error) {
			return res.status(403).json({
				errors: [
					{
						msg: 'Invalid token',
					},
				],
			});
		}
	}
};

module.exports = authToken;
