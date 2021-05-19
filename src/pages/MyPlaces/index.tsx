import { useEffect, useState } from "react"
import { IPage } from ".."
import { useAuth } from "../../contexts/AuthContext"
import { useGoogleMaps } from "../../contexts/GoogleMaps"
import { ILocation } from "../../models/Location"
import User from "../../models/User"
import style from './style.module.css'

function MyPlaces() {

    // Hooks
    const { user } = useAuth()
    const { getStaticPanoramaUrl } = useGoogleMaps()
    
    // State
    const [loading, setLoading] = useState(false)
    
    const [locations, setLocations] = useState<ILocation[]>([])

    // Effects
    useEffect(() => { fetchMyPlaces() }, [])

    async function fetchMyPlaces() {

        setLoading(true)
        
        try {
            
            const { results } = await User.myPlaces()

            setLocations(results)
            console.log(results)
            
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }
    
    return (
        <div className={style.container}>
            <h1>My Places</h1>
            <div className={style.panoramaContainer}>

            </div>
            <div className={style.locationsList}>
                <div className={style.locationListContentContainer}>
                    {locations.map(location => {
                        const imageSize = 100

                        return (
                            <div key={location.pano} className={style.locationCard}>
                                <img src={getStaticPanoramaUrl({ panoOrLocation: location.pano, size: { width: imageSize, height: imageSize }, fov: 120 })} />
                                <small title={location.description} className={style.description} style={{ maxWidth: imageSize }}>{location.description || `¯\\_(ツ)_/¯`}</small>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const PageMyPlaces: IPage = {
    name: 'My Places',
    path: `/myplaces`,
    component: MyPlaces,
    exact: true,
}

export { PageMyPlaces }