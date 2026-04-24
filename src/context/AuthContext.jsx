import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(email, password) {
    setLoading(true)
    setError('')

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.message || 'Erro ao autenticar.')
      setLoading(false)
      throw new Error(data.message || 'Erro ao autenticar.')
    }

    setLoading(false)
    return data
  }

  return (
    <AuthContext.Provider value={{ login, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
