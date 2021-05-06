import { createContext, HTMLAttributes, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { GoogleMapsApi, StreetViewPanorama, StreetViewPanoramaData, StreetViewPanoramaOptions, StreetViewService } from './types'

interface GoogleMapsContextData {
    createStreetView(element: HTMLElement, options?: StreetViewPanoramaOptions): StreetViewPanorama | undefined
    googleMapsLoaded: boolean
    getRandomPanorama(): Promise<StreetViewPanoramaData>
}

interface GoogleMapsProviderProps {
    apiKey?: string
    children: ReactNode
}

const GoogleMapsContext = createContext({} as GoogleMapsContextData)

const streetViewPanoramaOptions = {
	position: { lat: 46.9171876, lng: 17.8951832 },
	pov: { heading: 100, pitch: 0 },
	zoom: 1,
	addressControl: false,
	showRoadLabels: false,
};

function GoogleMapsProvider({ apiKey, children, ...props}: GoogleMapsProviderProps) {

    const [googleMaps, setGoogleMaps] = useState<GoogleMapsApi>()
    const [streetViewService, setStreetViewService] = useState<StreetViewService>()

    useEffect(() => {

        if ((window as any).google?.maps)
            return setGoogleMaps((window as any).google.maps)

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
        script.onload = (e) => {
            console.log('google maps api loaded')
            setGoogleMaps(() => (window as any).google.maps)
        }

        document.body.appendChild(script)

        return () => { document.body.removeChild(script) }

    }, [])

    useEffect(() => {
        if (!googleMaps) return
        
        const streetViewService = new googleMaps.StreetViewService()
        setStreetViewService(streetViewService)

    }, [googleMaps])

    function getRandomPanorama(): Promise<StreetViewPanoramaData> {
        
        return new Promise((resolve, reject) => {
            if (!streetViewService) throw new Error('No street view service loaded')

            const STREETVIEW_MAX_DISTANCE = 1000
            const position = {
            	lat: Math.random() * 180 - 90,
            	lng: Math.random() * 360 - 180,
            }
            // const position = { lat: 46.9171876, lng: 17.8951832 }
            
            const StreetViewLocationRequest = {
                location: position,
                radius: STREETVIEW_MAX_DISTANCE,
            }

            streetViewService.getPanorama(StreetViewLocationRequest, async (data, status) => {
                if (status === googleMaps?.StreetViewStatus.OK)
                    resolve(data)
                else
                    resolve(await getRandomPanorama())
            })


            //this.streetViewService.getPanoramaByLocation(position, STREETVIEW_MAX_DISTANCE, (streetViewPanoramaData, status) => {
            // streetViewService.getPanorama(StreetViewLocationRequest, (streetViewPanoramaData, status) => {
            //     if (status === this.props.googleMaps.StreetViewStatus.OK) {
            //         console.log('panorama found')
            //         console.log(streetViewPanoramaData)
            //         this.streetView.setPosition(streetViewPanoramaData.location.latLng)
            //     } else {
            //         console.log(`no panorama found at location Lat: ${position.lat} Lng: ${position.lng}`)
            //         this.GetNewPanorama()
            //         // no street view available in this range, or some error occurred
            //     }
            // })
        })
    }

    // useEffect(() => {
        
    //     if (!googleMaps) return
        
    //     const streetViewService = new googleMaps.StreetViewService()

    //     console.log(googleMaps)

    //     const streetViewPanoramaOptions = {
    //         position: { lat: 46.9171876, lng: 17.8951832 },
    //         pov: { heading: 100, pitch: 0 },
    //         zoom: 1,
    //         addressControl: false,
    //         showRoadLabels: false,
    //     };

    //     const streetViewPanoramaRequest = {
    //         location: streetViewPanoramaOptions.position,
    //         radius: 1000
    //     }

    //     streetViewService.getPanorama(streetViewPanoramaRequest, (streetViewPanoramaData, status) => {
    //         if (status === googleMaps.StreetViewStatus.OK) {
    //             console.log('panorama found')
    //             console.log(streetViewPanoramaData)
    //             // streetView.setPosition(streetViewPanoramaData.location.latLng)
    //         } else {
    //             console.log(`no panorama found at location Lat: ${streetViewPanoramaRequest.location.lat} Lng: ${streetViewPanoramaRequest.location.lng}`)
    //             // GetNewPanorama()
    //             // no street view available in this range, or some error occurred
    //         }
    //     })

    // }, [googleMaps])

    function createStreetView(element: HTMLElement, options?: StreetViewPanoramaOptions) {
        if(!googleMaps) return

        const streetView = new googleMaps.StreetViewPanorama(element, options)
        return streetView
    }

    return (
        <GoogleMapsContext.Provider value={{
            createStreetView,
            googleMapsLoaded: !!googleMaps,
            getRandomPanorama
        }}>
            {children}
        </GoogleMapsContext.Provider>
    )
}

interface PanoramaProps extends HTMLAttributes<HTMLDivElement>{
    children?: ReactNode
    options: StreetViewPanoramaOptions
}


function Panorama({ children, options, ...props }: PanoramaProps) {

    const [streetView, setStreetView] = useState<StreetViewPanorama>()

    const { createStreetView, googleMapsLoaded } = useGoogleMaps()

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (!ref.current) return

        const streetView = createStreetView(ref.current, options)

        if(!streetView) return

        setStreetView(streetView)
        
        // if (this.props.googleMaps && this.streetView == null) {
		// 	this.streetView = new this.props.googleMaps.StreetViewPanorama(
		// 		canvas,
		// 		this.props.streetViewPanoramaOptions
        //     );

        //     this.streetViewService = new this.props.googleMaps.StreetViewService()
        //     console.log(this.streetViewService);

		// 	this.streetView.addListener('position_changed',() => {
		// 		if (this.props.onPositionChanged) {
        //             this.props.onPositionChanged(this.streetView.getPosition());
        //         }
        //         console.log('position changed')
		// 	});

		// 	this.streetView.addListener('pov_changed',() => {
		// 		if (this.props.onPovChanged) {
		// 			this.props.onPovChanged(this.streetView.getPov());
		// 		}
        //     });
            
        //     this.props.pano(this.streetView)
		// }
    }, [googleMapsLoaded])

    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    )
}

function useGoogleMaps() {
    return useContext(GoogleMapsContext)
}

export { useGoogleMaps, GoogleMapsProvider, Panorama }