//
// Street View Service
//

export interface LatLngLiteral {
    lat: number
    lng: number
}

export interface StreetViewLocationRequest {
    location?: LatLngLiteral
    radius?: number
}

export interface StreetViewPanoRequest {
    pano: string
}

export interface Size {
    width: number
    height: number
}

export interface StreetViewTileData {
    centerHeading: number
    tileSize: Size
    worldSize: Size
}

export interface StreetViewLink {
    description?: string
    heading?: number
    pano?: string
}

export interface StreetViewLocation {
    pano: string
    description?: string
    latLng: LatLngLiteral
    shortDescription?: string
}

export interface StreetViewPanoramaData {
    tiles: StreetViewTileData
    copyright?: string
    imageDate?: string
    links?: StreetViewLink[]
    location: StreetViewLocation
    time?: { pano: string, mh: Date }[]
}

export interface StreetViewResponse {
    data: StreetViewPanoramaData
}

export interface StreetViewService {
    getPanorama(request: StreetViewLocationRequest | StreetViewPanoRequest, callback?: (data: StreetViewPanoramaData, status: keyof StreetViewStatus) => void): Promise<StreetViewResponse>
}

export interface StreetViewStatus {
    "OK": "OK",
    "UNKNOWN_ERROR": "UNKNOWN_ERROR",
    "ZERO_RESULTS": "ZERO_RESULTS"
}

//
// Street View Panorama
//

export interface StreetViewAddressControlOptions {

}

export interface FullscreenControlOptions {

}

export interface MotionTrackingControlOptions {

}

export interface PanControlOptions {
    
}

export interface StreetViewPov {

}

export interface ZoomControlOptions {

}

export interface StreetViewPanoramaOptions {
    addressControl?: boolean
    addressControlOptions?: StreetViewAddressControlOptions
    clickToGo?: boolean
    controlSize?: number
    disableDefaultUI?: boolean
    disableDoubleClickZoom?: boolean
    enableCloseButton?: boolean
    fullScreenControl?: boolean
    fullScreenControlOptions?: FullscreenControlOptions
    imageDateControl?: boolean
    linksControl?: boolean
    motionTracking?: boolean
    motionTrackingControl?: boolean
    motionTrackingControlOptions?: MotionTrackingControlOptions
    panControl?: boolean
    panControlOptions?: PanControlOptions
    pano?: string
    position?: LatLngLiteral
    pov?: StreetViewPov
    scrollwheel?: boolean
    showRoadLabels?: boolean
    visible?: boolean
    zoom?: number
    zoomControl?: boolean
    zoomControlOptions?: ZoomControlOptions
}

export interface StreetViewPanorama {
    setPano(pano: string): void
    setPosition(position: LatLngLiteral): void
}

//
// Google Maps Api
//

export interface GoogleMapsApi {
    StreetViewPanorama: new (container: HTMLElement, options?: StreetViewPanoramaOptions) => StreetViewPanorama
    StreetViewService: new () => StreetViewService
    StreetViewStatus: StreetViewStatus
}
