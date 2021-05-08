interface ILocation {
    id?: number

    pano: string
    lat: number
    lng: number

    description?: string
    shortdescription?: string
}

interface IHiddenLocation {
    id: number
    pano: string
}

export type { ILocation, IHiddenLocation }