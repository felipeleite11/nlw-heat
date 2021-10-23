import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
	sub: string
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const { authorization: authToken } = req.headers

	if(!authToken) {
		return res.status(401).json({ 
			msg: 'Usuário não autorizado.',
			errorCode: 'token.invalid'
		})
	}

	const [, token] = authToken.split(' ')

	try {
		const { sub } = verify(token, process.env.JWT_SECRET) as IPayload

		req.user_id = sub

		return next()
	} catch(e) {
		return res.status(401).json({ 
			errorCode: 'token.expired',
			msg: 'Token expirado.' 
		})
	}
}