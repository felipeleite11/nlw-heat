import { Router } from 'express'

import { authenticate } from './middleware/auth'

import { AuthenticateUserController } from './controllers/AuthenticateUserController'
import { CreateMessageController } from './controllers/CreateMessageController'
import { ListMessagesController } from './controllers/ListMessagesController'
import { ProfileUserController } from './controllers/ProfileIUserController'

const routes = Router()

routes.post('/authenticate', new AuthenticateUserController().handle)

routes.post('/messages', authenticate, new CreateMessageController().handle)

routes.get('/messages/last/:take', new ListMessagesController().handle)

routes.get('/profile', authenticate, new ProfileUserController().handle)

export { routes }