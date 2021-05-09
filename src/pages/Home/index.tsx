import { useState } from "react"
import { useHistory } from "react-router"
import { IPage } from ".."
import { useAlerts } from "../../contexts/AlertsContext"
import { useGoogleMaps } from "../../contexts/GoogleMaps"
import { StreetViewLocation, StreetViewPanorama, StreetViewPanoramaData } from "../../contexts/GoogleMaps/types"
import { Challenge, IChallenge, IChallengeConfiguration } from "../../models/Challenge"
import { IChallengeLocation } from "../../models/ChallengeLocation"
import { ILocation } from "../../models/Location"
import style from './style.module.css'

function Home(props: any) {

    // Hooks
    const { addAlert } = useAlerts()
    const history = useHistory()
    const { getRandomPanorama } = useGoogleMaps()

    // State
    const [showNewChallengeModal, setShowChallengeModal] = useState(false)

    const [creatingChallengeFromExisting, setCreatingChallengeFromExisting] = useState(false)

    const [creatingChallengeFromNew, setCreatingChallengeFromNew] = useState(false)
    const [totalLocations, setTotalLocations] = useState(5)
    const [foundLocations, setFoundLocations] = useState<StreetViewPanoramaData[]>([])

    const [challenge, setChallente] = useState<IChallenge>()

    const [challengeKey, setChallengeKey] = useState('')

    async function handleCreateFromExisting() {

        setCreatingChallengeFromExisting(true)
        
        try {
            
            const challenge: IChallengeConfiguration = {
                locations: 5,
                time: 5 * 60
            }
            
            const result = await Challenge.create(challenge)
            
            addAlert(`New challenge created successfully! Use this code to share with your friends:\n${result.key}`, { title: 'New Challenge!' })
            
        } catch (error) {
            console.log(error)
        }

        setCreatingChallengeFromExisting(false)
    }

    async function handleCreateFromNew() {
        
        setCreatingChallengeFromNew(true)

        try {
            const locations: ILocation[] = []
            for (let i = 0; i < totalLocations; i++) {
                
                const pano = await getRandomPanorama()
                const { location, ...panorama } = pano

                console.log('panorama found:', { location, ...panorama })

                locations.push({
                    pano: location.pano,
                    lat: typeof location.latLng.lat === 'function' ? location.latLng.lat() : location.latLng.lat,
                    lng: typeof location.latLng.lng === 'function' ? location.latLng.lng() : location.latLng.lng,
                    description: location.description,
                    shortdescription: location.description
                })

                setFoundLocations(oldLocations => [...oldLocations, pano])
                // setPanoramas(panoramas => [...panoramas, panorama.location])
            }
    
            const challenge: IChallengeConfiguration = {
                locations,
                time: 2 * 60,
            }

            const result = await Challenge.create(challenge)
            
            addAlert(`New challenge created successfully! Use this code to share with your friends:\n${result.key}`, { title: 'New Challenge!' })
            
            console.log(result)
        } catch (error) {
            console.log(error)
        }

        setFoundLocations([])
        setCreatingChallengeFromNew(false)
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
                    <button
                        className={`${style.button} ${style.primary}`}
                        disabled={creatingChallengeFromNew}
                        onClick={handleCreateFromNew}
                    >
                        {creatingChallengeFromNew ? `${foundLocations.length}/${totalLocations} places found` : `New places` }
                    </button>
                    <button
                        className={`${style.button} ${style.secondary}`}
                        onClick={handleCreateFromExisting}
                        disabled={creatingChallengeFromExisting}
                    >
                        Explored locations
                    </button>
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