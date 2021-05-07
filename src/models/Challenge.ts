import api from "../services/api"
import { ILocation } from "./Location"

interface IChallenge {

    id?: number
    uuid?: string

    time: number

    createdBy?: number
    createdAt?: Date
    expiresAt?: Date

    locations?: ILocation[] | number
}

class Challenge {

    static readonly route = 'challenges'

    static async create(challenge: IChallenge) {

        const { data } = await api.post(`/${this.route}`, challenge)
        return data
    }
}

export type { IChallenge }
export { Challenge }