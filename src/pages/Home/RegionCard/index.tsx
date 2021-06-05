import axios from 'axios'
import { useState } from 'react'
import { useHistory } from 'react-router'
import { useAlerts } from '../../../contexts/AlertsContext'
import { useGoogleMaps } from '../../../contexts/GoogleMaps'
import { Challenge, IChallengeConfiguration } from '../../../models/Challenge'
import { ILocation } from '../../../models/Location'
import { IRegion } from '../../../models/Region'
import style from './style.module.css'

interface RegionCardProps {
    region: IRegion
}

function RegionCard({ region, ...props }: RegionCardProps) {

    // Hooks
    const { getRandomPanorama, getGeocodeInfo } = useGoogleMaps()
    const { addAlert } = useAlerts()
    const history = useHistory()

    // State
    const [totalLocations, setTotalLocations] = useState(5)

    const [foundLocations, setFoundLocations] = useState<number>(0)
    const [creatingChallenge, setCreatingChallenge] = useState(false)

    async function generateChallenge() {

        try {
            
            setCreatingChallenge(true)

            let range
            if (region.squares?.length) {
                range = region.squares.reduce((range, square) => {
                    
                    range.minLat = Math.min(range.minLat, square.minLat)
                    range.maxLat = Math.max(range.maxLat, square.maxLat)
                    range.minLng = Math.min(range.minLng, square.minLng)
                    range.maxLng = Math.max(range.maxLng, square.maxLng)

                    return range
                }, { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 })
            }

            const locations: ILocation[] = []

            do {
                
                const pano = await getRandomPanorama({ range })
                
                const { location, ...panorama } = pano

                const coords = {
                    lat: location.latLng.lat(),
                    lng: location.latLng.lng(),
                }

                let isValidLocation = true

                // Check if location is in at least one square
                if (region.squares?.length) {
                    isValidLocation = region.squares.some(square => {
                        return (
                            coords.lat >= square.minLat && coords.lat <= square.maxLat &&
                            coords.lng >= square.minLng && coords.lng <= square.maxLng
                        )
                    })
                }

                // Check if location matches selected region definition
                if (isValidLocation && region.regionCode && region.regionType) {
                    
                    const data = await getGeocodeInfo({ lat: coords.lat, lng: coords.lng })
                    
                    const regionInfo = data.results[0].address_components.find(component => component.types[0] === region.regionType)
                    
                    //console.log(regionInfo)
                    isValidLocation = regionInfo?.short_name === region.regionCode
                }

                if (isValidLocation) {

                    locations.push({
                        pano: location.pano,
                        lat: location.latLng.lat(),
                        lng: location.latLng.lng(),
                        description: location.description,
                        shortdescription: location.description
                    })

                    setFoundLocations(prev => prev + 1)
                }
            } while (locations.length < totalLocations);

            const challenge: IChallengeConfiguration = {
                locations,
                time: 5 * 60,
                regionId: region.id
            }

            const result = await Challenge.create(challenge)

            addAlert(
                `New challenge created successfully! Use this code to share with your friends:\n${result.key}`,
                {
                    title: 'New Challenge!',
                    buttons: [
                        { text: 'Ok' },
                        { text: 'Play >', mode: 'accept', onClick: () => history.push(`/challenge/${result.key}`) }
                    ]
                }
            )

        } catch (error) {
            console.log(error)
        }

        setCreatingChallenge(false)
        setFoundLocations(0)
    }

    return (
        <div className={style.card}>
            <h3>{region.name}</h3>
            <button
                onClick={generateChallenge}
                disabled={creatingChallenge}
                className={`${style.button} ${style.primary}`}
            >
                {creatingChallenge ? `${foundLocations}/${totalLocations} locations found...` : `Play >`}
            </button>
        </div>
    )
}

export { RegionCard }
