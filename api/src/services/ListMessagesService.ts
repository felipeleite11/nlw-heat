import prismaClient from "../prisma"

class ListMessagesService {
	async execute(takeMessages: number) {
		const lastMessages = prismaClient.message.findMany({
			take: takeMessages,
			orderBy: { created_at: 'desc' },
			include: {
				user: true
			}			
		})

		return lastMessages
	}
}

export { ListMessagesService }