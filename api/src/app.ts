import 'dotenv/config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

import { routes } from './routes'

const app = express()

app.use(cors())

app.use(express.json())

app.use(routes)

app.get('/github', (req, res) => {
	return res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

app.get('/signin/callback', (req, res) => {
	const { code } = req.query

	return res.json(code)
})

const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
	cors: {
		origin: '*'
	}
})

io.on('connection', socket => {
	console.log(`Usuário conectado: ${socket.id}`)
})

export { serverHttp, io }