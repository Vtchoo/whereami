import api from "../services/api"
import { ILocation } from "./Location"

interface IChallenge {

    id: number
    key: string

    time: number

    createdBy: number
    createdAt: Date
    expiresAt?: Date

    locations: ILocation[]
}

interface IChallengeConfiguration {
    time: number
    locations: ILocation[] | number
}

class Challenge {

    static readonly route = 'challenges'

    static async create(challenge: IChallengeConfiguration) {

        const { data } = await api.post(`/${this.route}`, challenge)
        return data
    }

    static async findByKey(key: string, options?: { pregame?: boolean }) {

        const query: { [key: string]: string } = {}
        if(options?.pregame) query.pregame = '1'

        const urlQuery = new URLSearchParams(query)

        const { data } = await api.get(`/${this.route}/${key}?${urlQuery.toString()}`)
        return data
    }
}

export type { IChallenge, IChallengeConfiguration }
export { Challenge }