import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { IPage } from ".."
import { Panorama, Map } from "../../contexts/GoogleMaps"
import { Challenge, IChallenge } from "../../models/Challenge"

function ChallengePage() {

    const { key } = useParams<{ key: string }>()

    const [challenge, setChallenge] = useState<IChallenge>()
    const [panorama, setPanorama] = useState<string>()

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

        const locations = challenge.locations.map(location => location.pano)
        
        const nextPanorama = locations[panorama ? locations.indexOf(panorama) + 1 : 0]

        setPanorama(nextPanorama)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {JSON.stringify(challenge)}
            <button onClick={nextPanorama}>Start challenge</button>
            <div style={{ flex: 1, background: 'red' }}>

            </div>
            {panorama &&
                <Panorama pano={panorama} style={{ width: '100%', height: '100%' }} options={{ addressControl: false, showRoadLabels: false }}>
                <Map
                    style={{ width: '400px', height: '200px', position: 'absolute', zIndex: 2 }}
                    options={{
                        clickableIcons: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false
                    }}
                    onMapClick={e => console.log(e)}
                />
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
