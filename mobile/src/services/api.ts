import axios from 'axios'

export const api = axios.create({
	baseURL: 'http://192.168.43.35:8000'
})