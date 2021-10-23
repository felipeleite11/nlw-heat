import { Request, Response } from 'express'

import { ListMessagesService } from '../services/ListMessagesService'

class ListMessagesController {
	async handle(req: Request, res: Response) {
		const service = new ListMessagesService()

		const take = Number(req.params.take)

		const lastMessages = await service.execute(take)

		return res.json(lastMessages)
	}
}

export { ListMessagesController }