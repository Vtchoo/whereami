import { useState } from "react"
import { useHistory } from "react-router"
import { IPage } from ".."
import { useGoogleMaps } from "../../contexts/GoogleMaps"
import { StreetViewLocation } from "../../contexts/GoogleMaps/types"
import { Challenge, IChallenge, IChallengeConfiguration } from "../../models/Challenge"
import { ILocation } from "../../models/Location"
import style from './style.module.css'

function Home(props: any) {

    // Hooks
    const { getRandomPanorama } = useGoogleMaps()
    const history = useHistory()

    // State
    const [panoramas, setPanoramas] = useState<StreetViewLocation[]>([])

    const [challengeKey, setChallengeKey] = useState('')

    async function handleGetRandomPanorama() {
        
        try {
            const locations: ILocation[] = []
            for (let i = 0; i < 5; i++) {
                const { location, ...panorama } = await getRandomPanorama()

                console.log('panorama found:', { location, ...panorama })

                locations.push({
                    pano: location.pano,
                    lat: typeof location.latLng.lat === 'function' ? location.latLng.lat() : location.latLng.lat,
                    lng: typeof location.latLng.lng === 'function' ? location.latLng.lng() : location.latLng.lng,
                    description: location.description,
                    shortdescription: location.description
                })
                // setPanoramas(panoramas => [...panoramas, panorama.location])
            }
    
            const challenge: IChallengeConfiguration = {
                locations,
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
        <div className={style.container}>
            <div className={`${style.challengeCard} ${style.horizontal}`}>
                <div className={style.content} style={{ flex: 1 }}>
                    <h2>Start new challenge!</h2>
                    <p>Create new random challenge from anywhere in the world</p>
                </div>
                <hr/>
                <div style={{ display: "flex", flexDirection: "column", gap: '1rem' }}>
                    <h3>Create challenge</h3>
                    <button className={`${style.button} ${style.primary}`}>New places</button>
                    <button className={`${style.button} ${style.secondary}`}>Explored locations</button>
                </div>
            </div>

            <div className={`${style.challengeCard} ${style.horizonal}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <div>
                        <h2>Play existing challenge</h2>
                        <p>Play with your friends (or enemies)</p>
                    </div>
                    <div className={style.inlineContainer}>
                        <span>Insert the game code here:</span>
                        <input className={style.challengeInput} value={challengeKey} onChange={e => setChallengeKey(e.target.value)} />
                        <button className={`${style.button} ${style.primary}`} onClick={handlePlayChallenge}>Play challenge</button>
                    </div>
                </div>  
            </div>
                
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