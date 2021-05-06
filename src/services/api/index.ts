import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_API_BASE_URL : process.env.REACT_APP_PROD_API_BASE_URL
})

interface ApiResult<T> {
    count: number
    next: string
    previous: string
    results: T[]
}

export default api
export type { ApiResult }
