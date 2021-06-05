import axios from 'axios'
import { createContext, HTMLAttributes, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { GoogleMapsApi, MapOptions, StreetViewPanorama, StreetViewPanoramaData, StreetViewPanoramaOptions, StreetViewService, GoogleMap, MapMouseEvent, MarkerOptions, Marker, PolylineOptions, Polyline, StaticStreetViewPanoramaOptions, GeocodeResponse } from './types'

interface GoogleMapsContextData {
    createStreetView(element: HTMLElement, options?: StreetViewPanoramaOptions): StreetViewPanorama
    createMap(element: HTMLElement, options?: MapOptions): GoogleMap
    createMarker(map: GoogleMap | undefined | null, options?: MarkerOptions): Marker
    createPolyline(map: GoogleMap | undefined | null, options?: PolylineOptions): Polyline
    googleMapsLoaded: boolean
    getRandomPanorama(options?: RandomPanoramaOptions): Promise<StreetViewPanoramaData>
    getStaticPanoramaUrl(options: StaticStreetViewPanoramaOptions): string
    getGeocodeInfo(options: GeocodeRequestOptions): Promise<GeocodeResponse>
}

interface GoogleMapsProviderProps {
    apiKey?: string
    version?: string
    children: ReactNode
}

interface RandomPanoramaOptions {
    range?: { maxLat?: number, minLat?: number, maxLng?: number, minLng?: number }
}

interface GeocodeRequestOptions {
    lat: number
    lng: number
}

const GoogleMapsContext = createContext({} as GoogleMapsContextData)

function GoogleMapsProvider({ apiKey, children, ...props}: GoogleMapsProviderProps) {

    const version = props.version ?? 'weelkly'

    const [googleMaps, setGoogleMaps] = useState<GoogleMapsApi>()
    const [streetViewService, setStreetViewService] = useState<StreetViewService>()

    useEffect(() => {

        if ((window as any).google?.maps)
            return setGoogleMaps((window as any).google.maps)

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&v=${version}`
        script.onload = (e) => {
            console.log('google maps api loaded')
            setGoogleMaps(() => (window as any).google.maps)
        }

        document.body.appendChild(script)

        return () => { document.body.removeChild(script) }

    }, [])

    useEffect(() => {
        if (!googleMaps) return
        
        // console.log(googleMaps.ControlPosition)

        const streetViewService = new googleMaps.StreetViewService()
        setStreetViewService(streetViewService)

    }, [googleMaps])

    function getRandomPanorama(options?: RandomPanoramaOptions): Promise<StreetViewPanoramaData> {

        const minLat = options?.range?.minLat ?? -90
        const maxLat = options?.range?.maxLat ?? 90

        const minLng = options?.range?.minLng ?? -180
        const maxLng = options?.range?.maxLng ?? 180

        const latRng = maxLat - minLat
        const lngRng = maxLng - minLng

        return new Promise((resolve, reject) => {
            if (!streetViewService) throw new Error('No street view service loaded')

            const STREETVIEW_MAX_DISTANCE = 1000
            const position = {
            	lat: minLat + Math.random() * latRng,
            	lng: minLng + Math.random() * lngRng,
            }
            // const position = { lat: 46.9171876, lng: 17.8951832 }
            
            const StreetViewLocationRequest = {
                location: position,
                radius: STREETVIEW_MAX_DISTANCE,
                source: googleMaps?.StreetViewSource.OUTDOOR
            }

            streetViewService.getPanorama(StreetViewLocationRequest, async (data, status) => {
                if (status === googleMaps?.StreetViewStatus.OK)
                    resolve(data)
                else
                    resolve(await getRandomPanorama(options))
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

    function getStaticPanoramaUrl(options: StaticStreetViewPanoramaOptions) {
        
        
        const parameters: { [parameter: string]: string } = {}

        parameters.key = apiKey || ''
        
        parameters.size = `${options.size.width}x${options.size.height}`
        
        if (typeof options.panoOrLocation === 'string')
            parameters.pano = options.panoOrLocation
        else
            parameters.location = `${options.panoOrLocation.lat},${options.panoOrLocation.lng}`
            
        if (options.heading)
            parameters.heading = options.heading.toString()
        
        if (options.fov)
            parameters.fov = options.fov.toString()
        
        if (options.pitch)
            parameters.pitch = options.pitch.toString()
        
        if (options.radius)
            parameters.radius = options.radius.toString()
        
        if (options.source)
            parameters.source = options.source
        
        const query = new URLSearchParams(parameters)
        
        return `https://maps.googleapis.com/maps/api/streetview?${query}`
    }

    async function getGeocodeInfo(options: GeocodeRequestOptions) {

        // console.log(options)
        const { data } = await axios.get<GeocodeResponse>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${options.lat},${options.lng}&key=${apiKey}`)
        return data
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
        if (!googleMaps) throw new Error('GoogleMaps not loaded')

        const streetView = new googleMaps.StreetViewPanorama(element, options)
        return streetView
    }

    function createMap(element: HTMLElement, options?: MapOptions) {

        // if (!googleMaps) return
        if (!googleMaps) throw new Error('GoogleMaps not loaded')
        
        const map = new googleMaps.Map(element, options)
        return map
    }

    function createMarker(map: GoogleMap | undefined, options: MarkerOptions) {
        if (!googleMaps) throw new Error('GoogleMaps not loaded')

        const marker = new googleMaps.Marker({ ...options, map })
        return marker
    }

    function createPolyline(map: GoogleMap | undefined | null, options?: PolylineOptions) {
        if (!googleMaps) throw new Error('GoogleMaps not loaded')
        
        const polyline = new googleMaps.Polyline({ ...options, map })
        return polyline
    }

    return (
        <GoogleMapsContext.Provider value={{
            googleMapsLoaded: !!googleMaps,
            createStreetView,
            createMap,
            createMarker,
            createPolyline,
            getRandomPanorama,
            getStaticPanoramaUrl,
            getGeocodeInfo
        }}>
            {children}
        </GoogleMapsContext.Provider>
    )
}

//
// Street View Panorama
//

interface PanoramaProps extends HTMLAttributes<HTMLDivElement>{
    children?: ReactNode
    options: StreetViewPanoramaOptions
    pano: string
}


function Panorama({ children, options, pano, ...props }: PanoramaProps) {
    
    // Hooks
    const { createStreetView, googleMapsLoaded } = useGoogleMaps()

    // Refs
    const ref = useRef<HTMLDivElement>(null)
    
    // State
    const [streetView, setStreetView] = useState<StreetViewPanorama>()

    useEffect(() => {

        if (!streetView) return

        // Add event listeners here

        // if (!ref.current) return

        // const streetView = createStreetView(ref.current, { ...options, pano })

        // if(!streetView) return

        // setStreetView(streetView)
        
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
    }, [googleMapsLoaded, streetView])

    useEffect(() => {
        if (!ref.current) return
        
        if (!streetView){
            const streetView = createStreetView(ref.current, { ...options, pano })
            return setStreetView(streetView)
        } 
            
        streetView.setPano(pano)
        
    }, [googleMapsLoaded, pano])

    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    )
}

//
// Map
//

interface MapProps extends HTMLAttributes<HTMLDivElement>{
    options?: MapOptions
    onMapClick?: (event: MapMouseEvent) => void 
    onLoadMap?: (map: GoogleMap) => void
}

function Map({ options, onMapClick, onLoadMap, ...props }: MapProps) {

    // Hooks
    const { googleMapsLoaded, createMap } = useGoogleMaps()

    // Refs
    const ref = useRef<HTMLDivElement>(null)

    // State
    const [map, setMap] = useState<GoogleMap>()

    // Effects
    useEffect(() => {

        if (!ref.current) return
        
        if (!map) {
            const newMap = createMap(ref.current, {
                center: { lat: 0, lng: 0 },
                zoom: 1,
               ...options
            })

            setMap(newMap)

            onLoadMap?.(newMap)

            if(onMapClick){
                const listener = newMap?.addListener('click', onMapClick)
                return () => listener.remove()
            }// console.log(newMap)
        }

    }, [googleMapsLoaded, onMapClick])

    useEffect(() => {

        if(onMapClick){
            const listener = map?.addListener('click', onMapClick)
            return () => listener?.remove()
        }
        
    }, [onMapClick])

    return (
        <div ref={ref} {...props}>

        </div>
    )

}

function useGoogleMaps() {
    return useContext(GoogleMapsContext)
}

export { useGoogleMaps, GoogleMapsProvider, Panorama, Map }