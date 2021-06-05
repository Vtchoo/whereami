import api, { ApiResult } from "../services/api"

interface ISquare {
    minLat: number
    maxLat: number
    minLng: number
    maxLng: number
}

interface IRegion {
    id: number
    name: string
    regionType?: string
    regionCode?: string
    squares?: ISquare[]
}

interface RegionRequestOptions {
    showSquares?: boolean
    showPolygons?: boolean
}

class Region {

    static readonly route = 'regions'

    static async find(options?: RegionRequestOptions) {

        const query: { [key: string]: string } = {}
        if (options?.showSquares) query.squares = '1'
        if (options?.showPolygons) query.polygons = '1'

        const urlQuery = new URLSearchParams(query)

        const { data } = await api.get<ApiResult<IRegion>>(`/${Region.route}?${urlQuery}`)
        return data
    }
}

export { Region }
export type { IRegion }
