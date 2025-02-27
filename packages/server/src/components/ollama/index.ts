import ollama from 'ollama'

const response = await ollama.chat({
  model: 'deepseek-r1:7b',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
})
console.log(response.message.content)