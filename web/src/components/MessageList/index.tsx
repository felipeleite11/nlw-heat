import io from 'socket.io-client'

import styles from './styles.module.scss'

import { api } from '../../services/api'

import logo from '../../assets/logo.svg'
import { useEffect, useState } from 'react'

type Message = {
	id: string
	text: string
	user: {
		name: string
		avatar_url: string
	}	
}

const messagesQueue: Message[] = []

const socket = io('http://localhost:8000')

socket.on('new_message', (message: Message) => {
	messagesQueue.push(message)
})

export function MessageList() {
	const [messages, setMessages] = useState<Message[]>([])
	
	async function loadMessages() {
		const { data } = await api.get<Message[]>('messages/last/3')

		setMessages(data)
	}

	useEffect(() => {
		loadMessages()
	}, [])

	useEffect(() => {
		setInterval(() => {
			if(messagesQueue.length) {
				setMessages(prev => [
					messagesQueue[0],
					...prev.slice(0, 2)
				].filter(Boolean))

				messagesQueue.shift()
			}
		}, 3000)
	}, [])

	return (
		<div className={styles.messageListWrapper}>
			<img src={logo} alt="Do While 2021" />

			<ul className={styles.messageList}>

				{messages.map(message => (
					<li className={styles.message} key={message.id}>
						<p className={styles.messageContent}>{message.text}</p>
						<div className={styles.messageUser}>
							<div className={styles.userImage}>
								<img src={message.user.avatar_url} alt={message.user.name} />
							</div>
							<span>{message.user.name}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	)	
}