import userEvent from "@testing-library/user-event"
import { useCallback, useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router"
import { IPage } from ".."
import MainLogo from "../../components/MainLogo"
import { useAlerts } from "../../contexts/AlertsContext"
import { useAuth } from "../../contexts/AuthContext"
import { Panorama, Map, useGoogleMaps } from "../../contexts/GoogleMaps"
import { GoogleMap, MapMouseEvent, Marker, Polyline } from "../../contexts/GoogleMaps/types"
import { Game } from "../../game"
import { Challenge, IChallenge } from "../../models/Challenge"
import { ChallengeLocation, IChallengeLocation } from "../../models/ChallengeLocation"
import { Guess, IGuess } from "../../models/Guess"

import style from './style.module.css'

function ChallengePage() {

    // Hooks
    const { key } = useParams<{ key: string }>()
    const history = useHistory()
    const { user } = useAuth()
    const { addAlert } = useAlerts()
    const { createMarker, createPolyline } = useGoogleMaps()

    // Pregame
    const [loading, setLoading] = useState(true)

    // Playing
    const [challenge, setChallenge] = useState<IChallenge>()
    const [currentLocation, setCurrentLocation] = useState<IChallengeLocation>()
    const [map, setMap] = useState<GoogleMap>()
    const [marker, setMarker] = useState<Marker>()
    const [submitting, setSubmitting] = useState(false)
    const [timer, setTimer] = useState<number>()

    // Results
    const [showingResults, setShowingResults] = useState(false)
    const [results, setResults] = useState<IChallengeLocation>()
    const [markers, setMarkers] = useState<Marker[]>([])
    const [lines, setLines] = useState<Polyline[]>([])


    useEffect(() => {
        fetchChallenge()
    }, [])

    useEffect(() => {

        if (timer === undefined)
            return
       
        if (timer === 0) {
            submitGuess()
            return
        }

        const timeout = setTimeout(() => setTimer(timer - 1), 1000)

        return () => clearTimeout(timeout)

    }, [timer])

    useEffect(() => {

        if (!currentLocation) 
            return

        return () => {
            
            if (marker)
                marker.setMap(null)

            setMarker(undefined)
        }

    }, [currentLocation])

    useEffect(() => {

        if (!showingResults) 
            return
        
        showResults()

        return () => {
            markers.forEach(marker => marker.setMap(null))
            setMarkers([])
            lines.forEach(line => line.setMap(null))
            setLines([])
            setResults(undefined)
        }

    }, [showingResults])

    async function fetchChallenge() {

        setLoading(true)

        try {
            
            const challenge = await Challenge.findByKey(key, { pregame: true })

            setChallenge(challenge)

        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    function handleStartChallenge() {

        if (!challenge) 
            return

        nextPanorama()
    }

    function nextPanorama() {

        if (!challenge) return

        const locations = challenge.challengeLocations
        // const locations = challenge.challengeLocations.map(challengeLocation => challengeLocation.location.pano)
        
        const nextLocation = locations[currentLocation ? locations.indexOf(currentLocation) + 1 : 0]
        // const nextPanorama = locations[panorama ? locations.indexOf(panorama) + 1 : 0]

        setCurrentLocation(nextLocation)
        setShowingResults(false)
        setTimer(challenge.time)
        // setPanorama(nextPanorama)
    }

    function handleMapClick(event: MapMouseEvent) {
        
        if (!map) return

        const { latLng } = event
        
        if (marker) return marker.setPosition(latLng)

        const newMarker = createMarker(map, { position: latLng, draggable: true, animation: 'DROP' })
        setMarker(newMarker)
    }

    async function submitGuess() {

        if (!currentLocation) return
        
        setSubmitting(true)

        marker?.setDraggable(false)

        const challengeLocationId = currentLocation.id

        const guess: IGuess = {
            // challengeLocationId,
            lat: marker?.getPosition().lat(),
            lng: marker?.getPosition().lng()
        }

        try {

            const result = await Challenge.submitGuess(key, challengeLocationId, guess)

            setShowingResults(true)

            console.log(result)

        } catch (error) {
            console.log(error)
            addAlert(error.response?.data?.message, { title: 'Error' })
            // alert(error.response?.data?.message)

            if (error.response?.data?.skip)
                setShowingResults(true)
        }

        setSubmitting(false)
    }

    function handleFinishRound() {
        setTimer(0)
    }

    async function showResults() {
        try {
            
            if (!currentLocation || !map) return

            const { guesses, location, ...challengeLocation } = await ChallengeLocation.findById(currentLocation.id, { showGuesses: true, showLocation: true })

            const locationMarker = createMarker(map, {
                position: { lat: location.lat, lng: location.lng },
                icon: `http://maps.google.com/mapfiles/ms/icons/green.png`
            })

            const guessMarkers = guesses?.filter(marker => marker.lat && marker.lng).map(guess => {

                const marker = createMarker(map, { position: { lat: guess.lat || 0, lng: guess.lng || 0 }, label: guess.user?.username })
                return marker
            }) as Marker[]

            const lines = guessMarkers.map(marker => {
                return createPolyline(map, {
                    path: [
                        { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() },
                        { lat: locationMarker.getPosition().lat(), lng: locationMarker.getPosition().lng() }
                    ],
                    geodesic: true
                })
            })

            setResults({ guesses, location, ...challengeLocation })
            setMarkers([locationMarker, ...guessMarkers])
            setLines(lines)

        } catch(error) {
            console.log(error)
        }
    }


    //
    //
    //
    useEffect(() => {
        markers.forEach(marker => marker.setMap(map))
        lines.forEach(line => line.setMap(map))
        marker?.setMap(map)

        return () => {
            markers.forEach(marker => marker.setMap(null))
            lines.forEach(line => line.setMap(null))
            marker?.setMap(null)
        }
    }, [map, marker, markers, lines])


    // If game not found
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

    if (timer === undefined) return (
        <div className={style.container}>
            <div className={style.newChallengeCard}>
                <MainLogo className={style.logo}/>
                <h1>New challenge!</h1>
                <small>{challenge?.key}</small>
                <div className={style.infoCard}>
                    <div>
                        <strong>{challenge.region?.name || 'World'}</strong>
                        <small>region</small>
                    </div>
                    <hr/>
                    <div>
                        <strong>{challenge.challengeLocations.length}</strong>
                        <small>rounds</small>
                    </div>
                    <hr/>
                    <div>
                        <strong>{challenge.time}</strong>
                        <small>seconds</small>
                    </div>
                </div>
                <button className={style.button} onClick={handleStartChallenge}>Start challenge!</button>
            </div>
        </div>
    )

    // Timer display
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0')
    const seconds = Math.floor(timer % 60).toString().padStart(2, '0')

    const isFinalRound = currentLocation && challenge.challengeLocations.indexOf(currentLocation) === challenge.challengeLocations.length - 1



    const renderGameControls = () => {
        return (
            <>
                <div className={style.infoContainer}>
                    <div>
                        <strong>{challenge.region?.name || 'World'}</strong>
                    </div>
                    <hr />
                    <div>
                        <strong>{challenge.challengeLocations.indexOf(currentLocation as IChallengeLocation) + 1}/{challenge.challengeLocations.length}</strong>
                        <small>round</small>
                    </div>
                    <hr />
                    <div>
                        <strong className={`${style.timerText} ${timer <= 30 ? style.outOfTime : ''}`}>{minutes}:{seconds}</strong>
                        <small>{timer > 30 ? 'time left' : 'Hurry up!'}</small>
                                
                        {/*<small>time</small>*/}
                    </div>
                </div>
                <div className={style.minimapContainer}>
                    <Map
                        className={style.minimap}
                        // style={{ width: '400px', height: '200px', position: 'absolute', zIndex: 2}}
                        options={{
                            clickableIcons: false,
                            fullscreenControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            zoomControl: false
                        }}
                        onLoadMap={map => setMap(map)}
                        onMapClick={handleMapClick}
                    />
                    <button
                        className={style.button}
                        onClick={handleFinishRound}
                        disabled={submitting}
                    >
                        {marker ? 'Submit guess' : 'Skip'}
                    </button>
                </div>
            </>
        )
    }

    const renderRoundResults = () => {

        const playerGuess = results?.guesses?.find(guess => guess.guessedBy === user?.id)
        const actualLocation = results?.location

        const maxScore = 1000
        const playerScore = Game.getScore(
            { lat: playerGuess?.lat, lng: playerGuess?.lng },
            { lat: actualLocation?.lat, lng: actualLocation?.lng }
        )

        return (
            <div className={style.resultsContainer}>
                <Map
                    className={style.resultMap}
                    onLoadMap={map => setMap(map)}
                    options={{
                        clickableIcons: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false
                    }}
                />
                <div className={style.roundResults}>

                    <div className={style.playerResult}>
                        <h2>Your score:</h2>
                        <h1>{Math.ceil(playerScore)} points</h1>
                        <div className={style.scoreBar}>
                            <div style={{ width: `${Math.ceil(playerScore / maxScore * 100)}%` }}/>
                        </div>
                    </div>

                    <button className={style.button} onClick={isFinalRound ? () => history.push(`/challenge/${key}/results`) : nextPanorama}>
                        {isFinalRound ?
                            'View results' :
                            'Next round'
                        }
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={style.container}>
            {currentLocation &&
                <Panorama
                    className={style.streetViewPanorama}
                    pano={currentLocation.location.pano}
                    options={{
                        addressControl: false,
                        showRoadLabels: false,
                        fullscreenControl: false,
                        zoomControlOptions: {
                            position: 6
                        },
                        panControlOptions: {
                            position: 6
                        }
                    }}>
                    {!showingResults ?
                        renderGameControls()
                        :
                        renderRoundResults()
                    }
                </Panorama>
            }
        </div>
    )
}

const PageChallenge: IPage = {
    name: 'Challenge',
    path: `/challenge/:key`,
    component: ChallengePage,
    exact: true,
}

export { PageChallenge }
