import { useEffect, useState } from "react"
import { IPage } from ".."
import Icon from "../../components/Icon"
import { useAlerts } from "../../contexts/AlertsContext"
import { useAuth } from "../../contexts/AuthContext"
import { Panorama, useGoogleMaps } from "../../contexts/GoogleMaps"
import { ILocation } from "../../models/Location"
import User from "../../models/User"
import style from './style.module.css'

function MyPlaces() {

    // Hooks
    const { user } = useAuth()
    const { addAlert, addToast } = useAlerts()
    const { getStaticPanoramaUrl } = useGoogleMaps()
    
    // State
    const [loading, setLoading] = useState(false)
    
    const [locations, setLocations] = useState<ILocation[]>([])
    const [location, setLocation] = useState<ILocation>()

    // Effects
    useEffect(() => { fetchData() }, [])

    //

    async function fetchData() {

        setLoading(true)
        
        await fetchMyPlaces()

        setLoading(false)
    }
    
    async function fetchMyPlaces() {

        try {
            const { results } = await User.myPlaces()
            setLocations(results)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleRemoveBookmark(location: ILocation) {
        if (location.id === undefined) return
        
        addAlert(
            `Are you sure you want to remove ${location.description || 'this place'} from your bookmarks? This action can't be undone`,
            {
                title: 'Remove bookmark',
                buttons: [{ text: 'Cancel' }, { text: 'Remove', mode: 'danger', onClick: () => removeBookmark(location.id) }]
            }
        )
    }
    
    async function removeBookmark(locationId?: number) {
        
        if (!locationId) return

        try {
            
            await User.removeLocationBookmark(locationId)
            addToast('Bookmark removed successfully', { type: 'success' })
            fetchMyPlaces()
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className={style.container}>
            <div className={style.panoramaContainer}>
                {location ?
                    <Panorama
                        className={style.streetViewPanorama}
                        pano={location.pano}
                        options={{

                        }}
                    /> :
                    <>
                        <h1>My Places</h1>
                        <p>Select a place in the list below to load the Street View panorama</p>
                    </>
                }

            </div>
            <div className={style.locationsList}>
                <div className={style.locationListContentContainer}>
                    {locations.map(location => {
                        const imageSize = 80

                        return (
                            <div key={location.pano} className={style.locationCard}>
                                <img src={getStaticPanoramaUrl({ panoOrLocation: location.pano, size: { width: imageSize, height: imageSize }, fov: 120 })} />
                                <small title={location.description} className={style.description} style={{ maxWidth: imageSize }}>{location.description || `¯\\_(ツ)_/¯`}</small>
                                <div className={style.icons}>
                                    <Icon icon='google-street-view' size='1.75rem' className={style.icon} onClick={() => setLocation(location)}/>
                                    <Icon icon='heart-off' size='1.75rem' className={style.icon} onClick={() => handleRemoveBookmark(location)}/>
                                </div>
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