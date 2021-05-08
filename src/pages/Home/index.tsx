import { useState } from "react"
import { useHistory } from "react-router"
import { IPage } from ".."
import { useGoogleMaps } from "../../contexts/GoogleMaps"
import { StreetViewLocation } from "../../contexts/GoogleMaps/types"
import { Challenge, IChallenge, IChallengeConfiguration } from "../../models/Challenge"
import { ILocation } from "../../models/Location"

function Home(props: any) {

    // Hooks
    const { getRandomPanorama } = useGoogleMaps()
    const history = useHistory()

    // State
    const [panoramas, setPanoramas] = useState<StreetViewLocation[]>([])

    const [challengeKey, setChallengeKey] = useState('')

    async function handleGetRandomPanorama() {
        
        try {
            // const locations: ILocation[] = []
            // for (let i = 0; i < 5; i++) {
            //     const { location, ...panorama } = await getRandomPanorama()

            //     console.log('panorama found:', { location, ...panorama })

            //     locations.push({
            //         pano: location.pano,
            //         lat: typeof location.latLng.lat === 'function' ? location.latLng.lat() : location.latLng.lat,
            //         lng: typeof location.latLng.lng === 'function' ? location.latLng.lng() : location.latLng.lng,
            //         description: location.description,
            //         shortdescription: location.description
            //     })
            //     // setPanoramas(panoramas => [...panoramas, panorama.location])
            // }
    
            const challenge: IChallengeConfiguration = {
                locations: 5,
                time: 2 * 60,
            }

            alert('sending challenge data')

            const result = await Challenge.create(challenge)
            
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    function handlePlayChallenge() {
        history.push(`/challenge/${challengeKey}`)
    }

    return (
        <div>
            <h1>Home</h1>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <button onClick={handleGetRandomPanorama}>Create challenge</button>
            <input value={challengeKey} onChange={e => setChallengeKey(e.target.value)} />
            <button onClick={handlePlayChallenge}>Play challenge</button>
        </div>
    )
}

const PageHome: IPage = {
    name: 'Home',
    path: '/',
    exact: true,
    component: Home as () => JSX.Element
}

export { PageHome }