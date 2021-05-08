//
// Google Maps api types
//


//
// Base object
//

interface MVCObject {
    addListener(eventName: string, handler: Function): void
}


//
// Street View Service
//

export interface LatLng {
    lat(): number
    lng(): number
}

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
    latLng: LatLng | LatLngLiteral
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

export interface StreetViewPanorama extends MVCObject{
    setPano(pano: string): void
    setPosition(position: LatLngLiteral): void
}

//
// Google Maps
//

export interface GoogleMap extends MVCObject{

}

export interface FullscreenControlOptions {

}

export interface MapTypeControlOptions {
    
}

export interface PanControlOptions {

}

export interface MapRestriction {

}

export interface RotateControlOptions {

}

export interface ScaleControlOptions {

}

export interface StreetViewControlOptions {

}

export interface MapTypeStyle {

}

export interface ZoomControlOptions {

}

export interface MapMouseEvent {
    domEvent: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event
    latLng: LatLng
}

export interface MapOptions {
    center?: { lat: number, lng: number }
    zoom?: number
    backgroundColor?: string
    clickableIcons?: boolean
    controlSize?: number
    disableDefaultUI?: boolean
    disableDoubleClickZoom?: boolean
    draggableCursor?: string
    draggingCursor?: string
    fullscreenControl?: boolean
    fullscreenControlOptions?: FullscreenControlOptions
    gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto'
    heading?: number
    keyboardShortcuts?: number
    mapTypeControl?: boolean
    mapTypeControlOptions?: MapTypeControlOptions
    mapTypeId?: 'HYBRID' | 'ROADMAP' | 'TERRAIN' | 'SATELLITE' | string
    maxZoom?: number
    minZoom?: number
    noClear?: boolean
    panControl?: boolean
    panControlOptions?: PanControlOptions
    restriction?: MapRestriction
    rotateControl?: boolean
    rotateControlOptions?: RotateControlOptions
    scaleControl?: boolean
    scaleControlOptions?: ScaleControlOptions
    scrollwheel?: boolean
    streetView?: StreetViewPanorama
    streetViewControl?: boolean
    streetViewControlOptions?: StreetViewControlOptions
    styles?: MapTypeStyle[]
    tilt?: number
    zoomControl?: boolean
    zoomControlOptions?: ZoomControlOptions
}

// Marker 

export interface Marker {
    setMap(map: GoogleMap): void
    setLabel(label: string): void
    setPosition(latLng: LatLng | LatLngLiteral): void
    setTitle(title: string): void
}

export interface MarkerOptions {

}

//
// Google Maps Api
//

export interface GoogleMapsApi {
    StreetViewPanorama: new (container: HTMLElement, options?: StreetViewPanoramaOptions) => StreetViewPanorama
    StreetViewService: new () => StreetViewService
    StreetViewStatus: StreetViewStatus
    Map: new (container: HTMLElement, options?: MapOptions) => GoogleMap
    Marker: new (options?: MarkerOptions) => Marker
}
