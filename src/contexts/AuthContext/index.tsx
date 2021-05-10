import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import jwt from 'jsonwebtoken'
import { IUser } from '../../models/User'

interface AuthResponse {
    token: string
    refreshToken: string
    user?: IUser
}

interface AuthProviderProps {
    children: ReactNode
}

interface AuthContextData {
    user?: IUser
    login(username: string, password: string): Promise<void>
    logout(): Promise<void>
    loggedIn: boolean
    authenticating: boolean
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider(props: AuthProviderProps) {

    const [authenticating, setAuthenticating] = useState(true)

    const [user, setUser] = useState<IUser>()

    const [token, setToken] = useState<string>()
    const [refreshToken, setRefreshToken] = useState<string>()

    useEffect(() => { authenticate() }, [])

    useEffect(() => {
    }, [refreshToken])
    
    useEffect(() => {
        if (!token) {
            delete api.defaults.headers.common.authorization
            return
        }

        // Set api header
        api.defaults.headers.common.authorization = `Bearer ${token}`
        
        const decode = jwt.decode(token) as {[key: string]: any}
        
        const expireTime = decode.exp * 1000
        const now = new Date().getTime()
        const nextRefresh = expireTime - now - (60 * 1000) // expireTime - 1 minute
        
        const timer = setTimeout(() => refresh(), nextRefresh)

        return () => clearTimeout(timer)
    }, [token])
    
    async function login(username: string, password: string) {

        setAuthenticating(true)

        try {
            
            const { data } = await api.post<AuthResponse>('/login', { username, password })
            
            localStorage.setItem('whereami-refreshToken', data.refreshToken)
            setRefreshToken(data.refreshToken)

            // api.defaults.headers.common.authorization = `Bearer ${data.token}`
            setToken(data.token)
            
            setUser(data.user)

        } catch (error) {
            // console.log(error)
            throw error
        } finally {
            setAuthenticating(false)
        }
    }
    
    async function authenticate() {

        setAuthenticating(true)

        const refreshToken = localStorage.getItem('whereami-refreshToken')

        if (user || !refreshToken) return setAuthenticating(false)
        
        try {
            const { data } = await api.post<AuthResponse>('/refresh?user=1', { refreshToken })

            setRefreshToken(data.refreshToken)
            
            // api.defaults.headers.common.authorization = `Bearer ${data.token}`
            setToken(data.token)
            // console.log('Got refresh token', data.refreshToken)

            setUser(data.user)

        } catch (error) {
            console.log(error)
        }
        
        setAuthenticating(false)
    }
    
    async function refresh() {

        try {
            const { data } = await api.post<AuthResponse>('/refresh', { refreshToken })
            
            // api.defaults.headers.common.authorization = `Bearer ${data.token}`
            setToken(data.token)

        } catch (error) {
            console.log(error)

            if (error.response.status === 401 || error.response.status === 403) {
                alert('Sessão expirou, faça login novamente')

                setToken(undefined)

                localStorage.removeItem('whereami-refreshToken')
                setRefreshToken(undefined)

                setUser(undefined)
            }
        }
    }

    async function logout() {

        try {
            
            await api.post('/logout', { refreshToken })

            setToken(undefined)
    
            localStorage.removeItem('whereami-refreshToken')
            setRefreshToken(undefined)
            
            setUser(undefined)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loggedIn: !!user,
            authenticating
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    return useContext(AuthContext)
}
export { AuthProvider, AuthContext, useAuth }