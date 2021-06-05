import api from "../services/api"
import { IChallengeLocation } from "./ChallengeLocation"
import { IGuess } from "./Guess"
import { ILocation } from "./Location"
import { IRegion } from "./Region"

interface IChallenge {

    id: number
    key: string

    time: number

    createdBy: number
    createdAt: Date
    expiresAt?: Date

    regionId?: number
    region?: IRegion

    challengeLocations: IChallengeLocation[]
}

interface IChallengeConfiguration {
    time: number
    locations: ILocation[] | number
    regionId?: number
}

interface ChallengeRequestOptions {
    pregame?: boolean
    showGuesses?: boolean
    showGuessUser?: boolean
}

class Challenge {

    static readonly route = 'challenges'

    static async create(challenge: IChallengeConfiguration) {

        const { data } = await api.post<IChallenge>(`/${this.route}`, challenge)
        return data
    }

    static async findByKey(key: string, options?: ChallengeRequestOptions) {

        const query: { [key: string]: string } = {}
        if (options?.pregame) query.pregame = '1'
        if (options?.showGuesses) query.guesses = '1'
        if(options?.showGuessUser) query.guessuser = '1'

        const urlQuery = new URLSearchParams(query)

        const { data } = await api.get<IChallenge>(`/${this.route}/${key}?${urlQuery.toString()}`)
        return data
    }

    static async submitGuess(challengeKey: string, challengeLocationId: number, guess: IGuess) {

        const { data } = await api.post(`/${this.route}/${challengeKey}/challengelocations/${challengeLocationId}/guesses`, guess)
        return data
    }
}

export type { IChallenge, IChallengeConfiguration }
export { Challenge }