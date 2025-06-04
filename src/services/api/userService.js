import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let users = [...userData]

const userService = {
  async getAll() {
    await delay(250)
    return [...users]
  },

  async getById(id) {
    await delay(200)
    const user = users.find(u => u.id === id)
    return user ? { ...user } : null
  },

  async create(userData) {
    await delay(400)
    const newUser = {
      ...userData,
      id: Date.now().toString()
    }
    users.push(newUser)
    return { ...newUser }
  },

  async update(id, updates) {
    await delay(300)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    users[index] = {
      ...users[index],
      ...updates
    }
    return { ...users[index] }
  },

  async delete(id) {
    await delay(250)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    const deletedUser = users.splice(index, 1)[0]
    return { ...deletedUser }
  }
}

export default userService