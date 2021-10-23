import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import io from 'socket.io-client'

import { api } from '../../services/api'

import { Message, MessageProps } from '../Message'

import { styles } from './styles'

import { MESSAGES_EXAMPLE } from '../../utils/messages'

const socket = io(String(api.defaults.baseURL))

let messagesQueue: MessageProps[] = MESSAGES_EXAMPLE // []

socket.on('new_message', message => {
	messagesQueue.push(message)
})

export function MessageList() {
	const [messages, setMessages] = useState<MessageProps[]>([])

	useEffect(() => {
		async function fetchMessages() {
			const messagesResponse = await api.get<MessageProps[]>('messages/last/10')

			setMessages(messagesResponse.data)
		}

		fetchMessages()
	}, [])

	useEffect(() => {
		const timer = setInterval(() => {
			if(messagesQueue.length) {
				setMessages(prev => [
					messagesQueue[0],
					...prev.slice(0, 5)
				])

				messagesQueue.shift()
			}
		}, 3000)

		return () => { clearInterval(timer) }
	}, [])

	return (
		<ScrollView 
			style={styles.container}
			contentContainerStyle={styles.content}
			keyboardShouldPersistTaps="never"
		>
			{messages?.map(message => (
				<Message key={message.id} data={message} />
			))}
		</ScrollView>
	)
}