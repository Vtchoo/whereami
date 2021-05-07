import { useState } from "react"
import { IPage } from ".."
import { useGoogleMaps } from "../../contexts/GoogleMaps"
import { StreetViewLocation } from "../../contexts/GoogleMaps/types"
import { Challenge, IChallenge } from "../../models/Challenge"
import { ILocation } from "../../models/Location"

function Home() {

    // Hooks
    const { getRandomPanorama } = useGoogleMaps()

    // State
    const [panoramas, setPanoramas] = useState<StreetViewLocation[]>([])

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
    
            const challenge: IChallenge = {
                locations: 5,
                time: 3 * 60 * 1000,
            }

            alert('sending challenge data')

            const result = await Challenge.create(challenge)
            
            console.log(result)
        } catch (error) {
            console.log(error)
        }
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
            {panoramas.map((panorama, i) =>
                <div key={i}>
                    {panorama.pano}
                </div>
            )}
        </div>
    )
}

const PageHome: IPage = {
    name: 'Home',
    path: '/',
    exact: true,
    component: Home
}

export { PageHome }