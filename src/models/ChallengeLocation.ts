import api from "../services/api";
import { IChallenge } from "./Challenge";
import { IGuess } from "./Guess";
import { IHiddenLocation, ILocation } from "./Location";

interface IChallengeLocation {

    id: number

    challengeId?: number
    locationId?: number

    challenge?: IChallenge
    location: ILocation
    guesses?: IGuess[]
}

class ChallengeLocation {

    static readonly route = 'challengelocations'

    static async findById(id: number, options?: { showGuesses?: boolean, showLocation?: boolean }) {

        const query: { [key: string]: string } = {}
        if (options?.showGuesses) query.guesses = '1'
        if (options?.showLocation) query.location = '1'

        const urlQuery = new URLSearchParams(query)

        const { data } = await api.get<IChallengeLocation>(`/${this.route}/${id}?${urlQuery.toString()}`)

        return data
    }

}

export type { IChallengeLocation }
export { ChallengeLocation }
