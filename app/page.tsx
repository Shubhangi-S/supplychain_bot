'use client'

import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState<'askPhone' | 'askName' | 'chat'>('askPhone')
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (step === 'askPhone') {
      setMessages([
        { role: 'assistant', content: 'Welcome! Please enter your phone number to get started.' },
      ])
    }
  }, [step])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    let newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)

    try {
      let body: any = {}

      if (step === 'askPhone') {
        body = { phone: input.trim() }
        setPhone(input.trim())
      } else if (step === 'askName') {
        body = { phone, message: input.trim() }
      } else {
        body = { phone, message: input.trim() }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setMessages([...newMessages, { role: 'assistant', content: data.error || 'Something went wrong.' }])
        return
      }

      if (step === 'askPhone') {
        if (data.found) {
          setName(data.name)
          setStep('chat')
          newMessages = [...newMessages, { role: 'assistant', content: `Welcome back, ${data.name}! Ask me anything.` }]
        } else {
          setStep('askName')
          newMessages = [...newMessages, { role: 'assistant', content: 'Thanks! What is your name?' }]
        }
      } else if (step === 'askName') {
        setName(input.trim())
        setStep('chat')
        newMessages = [...newMessages, { role: 'assistant', content: `Welcome, ${input.trim()}! Ask me anything.` }]
      } else {
        newMessages = [...newMessages, { role: 'assistant', content: data.reply || 'Sorry, I could not understand that.' }]
      }

      setMessages(newMessages)
      setInput('')
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Failed to connect to the server.' }])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 flex flex-col">
        <div className="font-bold text-xl mb-2 text-center">Chatbot</div>
        <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-96">
          {messages.map((msg, i) => (
            <div key={i} className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
