import { serverHttp } from './app'

const port = 8000

serverHttp.listen(port, () => {
	console.log(`Executando na porta ${port}`)
})
