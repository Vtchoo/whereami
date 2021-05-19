import api, { ApiResult } from "../services/api"

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

class Location {

    static readonly route = 'locations'

    static async find() {

        const { data } = await api.get<ApiResult<ILocation>>(`/${Location.route}`)
        return data
    }
}

export { Location }
export type { ILocation, IHiddenLocation }