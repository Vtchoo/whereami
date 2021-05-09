//
// Google Maps api types
//


//
// Base object
//

interface MVCObject {
    addListener(eventName: string, handler: Function): MapsEventListener
}

interface MapsEventListener {
    remove(): void
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
    source?: keyof StreetViewSource
}

export interface StreetViewSource {
    'OUTDOOR': 'OUTDOOR'
    'DEFAULT': 'DEFAULT'
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
    position?: keyof ControlPosition | number
}

export interface StreetViewPov {

}

export interface ZoomControlOptions {
    position?: keyof ControlPosition | number
}

export interface ControlPosition {
    'BOTTOM_CENTER': 11
    'BOTTOM_LEFT': 10
    'BOTTOM_RIGHT': 12
    'LEFT_BOTTOM': 6
    'LEFT_CENTER': 4
    'LEFT_TOP': 5
    'RIGHT_BOTTOM': 9
    'RIGHT_CENTER': 8
    'RIGHT_TOP': 7
    'TOP_CENTER': 2
    'TOP_LEFT': 1
    'TOP_RIGHT': 3
}

export interface StreetViewPanoramaOptions {
    addressControl?: boolean
    addressControlOptions?: StreetViewAddressControlOptions
    clickToGo?: boolean
    controlSize?: number
    disableDefaultUI?: boolean
    disableDoubleClickZoom?: boolean
    enableCloseButton?: boolean
    fullscreenControl?: boolean
    fullscreenControlOptions?: FullscreenControlOptions
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

// Marker 

export interface Marker {
    setMap(map?: GoogleMap | null): void
    setLabel(label: string): void
    setPosition(latLng: LatLng | LatLngLiteral): void
    setTitle(title: string): void
    setDraggable(flag: boolean): void
    getPosition(): LatLng
}

export interface MarkerOptions {
    position?: LatLng | LatLngLiteral
    animation?: 'BOUNCE' | 'DROP'
    map?: GoogleMap

    clickable?: boolean
    crossOnDrag?: boolean
    cursor?: string
    draggable?: boolean
    icon?: string
    label?: string | MarkerLabel
    opacity?: number
    optimized?: boolean
    shape?: MarkerShape
    title?: string
    visible?: boolean
    zIndex?: number
}

export interface MarkerLabel {
    text: string
    className?: string
    color?: string
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
}

export interface MarkerShape {
    coords: number[]
    type: string
}

//
// Polyline
//

export interface Polyline {
    setMap(map?: GoogleMap | null): void
}

export interface PolylineOptions {
    clickable?: boolean
    draggable?: boolean
    editable?: boolean
    geodesic?: boolean
    map?: GoogleMap | null
    path?: LatLng[] | LatLngLiteral[]
    strokeColor?: string
    strokeOpacity?: number
    strokeWeight?: number
    visible?: boolean
    zIndex?: number
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
    Polyline: new (options?: PolylineOptions) => Polyline
    StreetViewSource: StreetViewSource
    ControlPosition: ControlPosition
}
