import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { IPage } from ".."
import { Map, useGoogleMaps } from "../../contexts/GoogleMaps"
import { GoogleMap, Marker, Polyline } from "../../contexts/GoogleMaps/types"
import { Game } from "../../game"
import { Challenge, IChallenge } from "../../models/Challenge"
import User, { IUser } from "../../models/User"
import style from './style.module.css'

function ChallengeResults() {

    // Hooks
    const { key } = useParams<{ key: string }>()
    const history = useHistory()
    const { createMarker, createPolyline } = useGoogleMaps()

    // State
    const [loading, setLoading] = useState(false)

    const [challenge, setChallenge] = useState<IChallenge>()
    const [users, setUsers] = useState<IUser[]>([])

    const [map, setMap] = useState<GoogleMap>()

    const [markers, setMarkers] = useState<Marker[]>([])
    const [lines, setLines] = useState<Polyline[]>([])

    useEffect(() => { fetchChallenge() }, [])

    useEffect(() => {

        if (!map) return
        
        const markers: Marker[] = []
        const lines: Polyline[] = []

        challenge?.challengeLocations.forEach(cl => {
            const actualLocation = cl.location
            const locationMarker = createMarker(map, {
                position: { lat: actualLocation.lat, lng: actualLocation.lng },
                icon: `http://maps.google.com/mapfiles/ms/icons/green-dot.png`,
            })

            markers.push(locationMarker)

            cl.guesses?.forEach(guess => {
                if (!guess.lat || !guess.lng)
                    return

                const guessMarker = createMarker(map, {
                    position: { lat: guess.lat, lng: guess.lng },
                    icon: `http://maps.google.com/mapfiles/ms/icons/red-dot.png`,
                    label: users.find(user => user.id === guess.guessedBy)?.username
                })

                const line = createPolyline(map, {
                    path: [
                        guessMarker.getPosition(),
                        locationMarker.getPosition()
                    ]
                })

                lines.push(line)
                markers.push(guessMarker)
            })
        })

        return () => {
            markers.forEach(marker => marker.setMap(null))
            lines.forEach(line => line.setMap(null))
        }

    }, [map])

    async function fetchChallenge() {
        setLoading(true)

        try {
            
            const challenge = await Challenge.findByKey(key, { showGuesses: true })

            const userIds: number[] = []
            challenge.challengeLocations.forEach(cl => {
                cl.guesses?.forEach(guess => {
                    if (!guess.guessedBy) return

                    if (!userIds.includes(guess.guessedBy))
                        userIds.push(guess.guessedBy)
                })
            })

            const users = await User.findByIds(userIds)

            setUsers(users)

            setChallenge(challenge)

        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    if (loading) return (
        <div className={style.container}>
            <h3>Loading challenge...</h3>
        </div>
    )

    if (!challenge) return (
        <div className={style.container}>
            <h3>Challenge not found</h3>
        </div>
    )

    return (
        <div className={style.container}>
            <h2>Challenge Results:</h2>
            <Map
                className={style.resultsMap}
                onLoadMap={map => setMap(map)}
                options={{
                    clickableIcons: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    zoomControl: false
                }}
            />
            <div className={style.usersList}>
                <div className={style.userInfo}>
                    <div>Player</div>
                    <div>Total score</div>
                </div>
                {users.map(user => {
                    
                    const userScore = challenge.challengeLocations.reduce((totalScore, cl) => {
                        const score = cl.guesses?.
                            filter(guess => guess.guessedBy === user.id).
                            reduce((total, guess) => {
                                return total + Game.getScore({ lat: guess.lat, lng: guess.lng }, { lat: cl.location.lat, lng: cl.location.lng })
                            }, 0)
                        return totalScore + (score || 0)
                    }, 0)

                    return (
                        <div key={user.id} className={style.userInfo}>
                            <div>{user.username}</div>
                            <div>{Math.ceil(userScore)}</div>
                        </div>
                    )
                })}
            </div>
            <button className={`${style.button} ${style.primary}`} onClick={() => history.replace('/')}>{'< Home'}</button>
            {/* {JSON.stringify(challenge, null, '\t')} */}
        </div>
    )
}

const PageChallengeResults: IPage = {
    name: 'Challenge Results',
    path: '/challenge/:key/results',
    component: ChallengeResults,
    exact: true
}

export { PageChallengeResults }
