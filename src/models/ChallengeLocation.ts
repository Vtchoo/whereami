import { IChallenge } from "./Challenge";
import { ILocation } from "./Location";

interface IChallengeLocation {

    id?: number

    challengeId?: number
    locationId?: number

    challenge?: IChallenge
    location: ILocation
}

export type { IChallengeLocation }
