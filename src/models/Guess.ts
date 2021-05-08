import api from "../services/api";
import { IUser } from "./User";

interface IGuess {

    id?: number

    challengelocationId: number

    lat?: number
    lng?: number

    guessedBy?: number
    guessedAt?: Date
    user?: IUser
}

class Guess {

    static readonly route = 'guesses'

    static async submit(guess: IGuess) {

    }
}

export type { IGuess }
export { Guess }
