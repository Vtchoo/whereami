import { useCallback, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { IPage } from ".."
import MainLogo from "../../components/MainLogo"
import { Panorama, Map, useGoogleMaps } from "../../contexts/GoogleMaps"
import { GoogleMap, MapMouseEvent, Marker } from "../../contexts/GoogleMaps/types"
import { Challenge, IChallenge } from "../../models/Challenge"
import { ChallengeLocation, IChallengeLocation } from "../../models/ChallengeLocation"
import { Guess, IGuess } from "../../models/Guess"

import style from './style.module.css'

function ChallengePage() {

    // Hooks
    const { key } = useParams<{ key: string }>()
    const { createMarker } = useGoogleMaps()

    // State
    const [loading, setLoading] = useState(true)

    const [challenge, setChallenge] = useState<IChallenge>()
    const [currentLocation, setCurrentLocation] = useState<IChallengeLocation>()
    const [map, setMap] = useState<GoogleMap>()
    const [marker, setMarker] = useState<Marker>()

    const [timer, setTimer] = useState<number>()

    useEffect(() => {
        fetchChallenge()
    }, [])

    useEffect(() => {

        if (timer === undefined)
            return
       
        if (timer === 0) {
            return
        }

        const timeout = setTimeout(() => setTimer(timer - 1), 1000)

        return () => clearTimeout(timeout)

    }, [timer])

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

        if(!challenge) 
            return

        nextPanorama()
        setTimer(challenge.time)
    }

    function nextPanorama() {

        if (!challenge) return

        const locations = challenge.challengeLocations
        // const locations = challenge.challengeLocations.map(challengeLocation => challengeLocation.location.pano)
        
        const nextLocation = locations[currentLocation ? locations.indexOf(currentLocation) + 1 : 0]
        // const nextPanorama = locations[panorama ? locations.indexOf(panorama) + 1 : 0]

        setCurrentLocation(nextLocation)
        // setPanorama(nextPanorama)
    }

    function handleMapClick(event: MapMouseEvent) {
        
        if (!map) return

        const { latLng } = event
        
        if (marker) return marker.setPosition(latLng)

        const newMarker = createMarker(map, { position: latLng, draggable: true, animation: 'DROP' })
        setMarker(newMarker)
    }

    async function handleSubmitGuess() {

        if (!marker || !currentLocation) return
        
        marker.setDraggable(false)

        const challengeLocationId = currentLocation.id

        const position = marker.getPosition()
        const guess: IGuess = {
            // challengeLocationId,
            lat: position.lat(),
            lng: position.lng()
        }

        try {

            const result = await Challenge.submitGuess(key, challengeLocationId, guess)

            console.log(result)

        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message)
        }
    }

    function handleSkip() {

    }

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
                    <>
                        <div className={style.infoContainer}>
                            <div>
                                <strong>{challenge.region?.name || 'World'}</strong>
                            </div>
                            <hr/>
                            <div>
                                <strong>{challenge.challengeLocations.indexOf(currentLocation) + 1}/{challenge.challengeLocations.length}</strong>
                                <small>round</small>
                            </div>
                            <hr/>
                            <div>
                                <p className={`${style.timerText} ${timer <= 30 ? style.outOfTime : ''}`}>
                                    <strong>{minutes}:{seconds}</strong>
                                </p>
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
                                onClick={marker ? handleSubmitGuess : handleSkip}
                            >
                                {marker ? 'Submit guess' : 'Skip'}
                            </button>
                        </div>
                    </>
                </Panorama>
            }
        </div>
    )
}

const PageChallenge: IPage = {
    name: 'Challenge',
    path: `/challenge/:key`,
    component: ChallengePage
}

export { PageChallenge }
