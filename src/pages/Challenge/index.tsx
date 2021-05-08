import { useCallback, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { IPage } from ".."
import { Panorama, Map, useGoogleMaps } from "../../contexts/GoogleMaps"
import { GoogleMap, MapMouseEvent, Marker } from "../../contexts/GoogleMaps/types"
import { Challenge, IChallenge } from "../../models/Challenge"

import style from './style.module.css'

function ChallengePage() {

    const { key } = useParams<{ key: string }>()

    const { createMarker } = useGoogleMaps()

    const [challenge, setChallenge] = useState<IChallenge>()
    const [panorama, setPanorama] = useState<string>()
    const [map, setMap] = useState<GoogleMap>()
    const [marker, setMarker] = useState<Marker>()

    useEffect(() => {
        fetchChallenge()
    }, [])

    async function fetchChallenge() {
        try {
            
            const challenge = await Challenge.findByKey(key, { pregame: true })

            setChallenge(challenge)

        } catch (error) {
            console.log(error)
        }
    }

    function nextPanorama() {

        if (!challenge) return

        const locations = challenge.challengeLocations.map(challengeLocation => challengeLocation.location.pano)
        
        const nextPanorama = locations[panorama ? locations.indexOf(panorama) + 1 : 0]

        setPanorama(nextPanorama)
    }

    function handleMapClick(event: MapMouseEvent) {
        
        if (!map) return

        const { latLng } = event
        
        if (marker) return marker.setPosition(latLng)

        const newMarker = createMarker(map, { position: latLng, draggable: true, animation: 'DROP' })
        setMarker(newMarker)
    }

    function handleSubmitGuess() {

        if (!marker) return
        
        marker.setDraggable(false)




    }

    function handleSkip() {

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {JSON.stringify(challenge)}
            <button onClick={nextPanorama}>Start challenge</button>
            <div style={{ flex: 1, background: 'red' }}>

            </div>
            {panorama &&
                <Panorama
                    className={style.streetViewPanorama}
                    pano={panorama}
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
                            className={style.guessButton}
                            onClick={marker ? handleSubmitGuess : handleSkip}
                        >
                            {marker ? 'Submit guess' : 'Skip'}
                        </button>
                    </div>
                    {/* <Map
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
                    /> */}
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
