import { useState } from "react"
import { IPage } from ".."
import { useGoogleMaps } from "../../contexts/GoogleMaps"
import { StreetViewLocation } from "../../contexts/GoogleMaps/types"

function Home() {

    // Hooks
    const { getRandomPanorama } = useGoogleMaps()

    // State
    const [panoramas, setPanoramas] = useState<StreetViewLocation[]>([])

    async function handleGetRandomPanorama() {
        
        for (let i = 0; i < 5; i++) {
            const panorama = await getRandomPanorama()
            setPanoramas(panoramas => [...panoramas, panorama.location])
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
            <button onClick={handleGetRandomPanorama}>Get random panoramas</button>
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