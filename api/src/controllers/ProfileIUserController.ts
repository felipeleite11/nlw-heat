import { Request, Response } from 'express'

import { ProfileUserService } from '../services/ProfileUserService'

class ProfileUserController {
	async handle(req: Request, res: Response) {
		const service = new ProfileUserService()

		const user = await service.execute(req.user_id)

		return res.json(user)
	}
}

export { ProfileUserController }