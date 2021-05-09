import MathUtils from "../utils/MathUtils"

interface Coordinates {
    lat?: number
    lng?: number
}

type Formula = 'INVERSE_QUADRATIC' | 'QUADRATIC' | 'EXPONENTIAL' | 'GAUSS' | 'LINEAR'

class Game {

    static getScore(playerGuess: Coordinates, actualPlace: Coordinates) {

        const maxScore = 1000

        return Game.calculateScore({ lat: playerGuess?.lat, lng: playerGuess?.lng },
            { lat: actualPlace?.lat, lng: actualPlace?.lng },
            'EXPONENTIAL',
            maxScore,
            2000
        )
    }

    static calculateScore(playerGuess: Coordinates, actualPlace: Coordinates, scoreFormula: Formula, baseScore = 10000, referenceDistance = 1000) {

        if (!playerGuess.lat || !playerGuess.lng || !actualPlace.lat || !actualPlace.lng)
            return 0

        const distance = MathUtils.geoDistanceInKm(playerGuess.lat, playerGuess.lng, actualPlace.lat, actualPlace.lng)

        const score = Math.max(Game.scoreFormula[scoreFormula](baseScore, referenceDistance, distance), 0)

        return score
    }

    static scoreFormula: { [key: string]: (base: number, referenceDistance: number, d: number) => number } = {
        'INVERSE_QUADRATIC': (b, r, d) => {
            return b - 100 * Math.pow(2, (d / r))
        },
        'QUADRATIC': (b, r, d) => {
            return d    // TODO
        },
        'EXPONENTIAL': (b, r, d) => {
            return b * Math.pow((1 / 2), d / r)
        },
        'GAUSS': (b, r, d) => {
            return d
        },
        'LINEAR': (b, r, d) => {
            return b - r * d
        }
    }
}

export { Game }