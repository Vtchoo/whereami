import { IChallenge } from "./Challenge";
import { IHiddenLocation, ILocation } from "./Location";

interface IChallengeLocation {

    id?: number

    challengeId?: number
    locationId?: number

    challenge?: IChallenge
    location: ILocation | IHiddenLocation
}

class ChallengeLocation {

    static readonly route = 'challengelocations'

}

export type { IChallengeLocation }
export { ChallengeLocation }
