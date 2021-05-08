import { PageChallenge } from "./Challenge"
import { PageHome } from "./Home"

interface IPage {
    name: string
    path: string
    component: () => JSX.Element
    exact?: boolean
    permission?: string
}

interface ISection {
    id: number
    title: string
    path?: string
    component?: React.ReactNode
    pages?: IPage[]
    permission?: string
    icon?: string
}

const pages: IPage[] = [
    PageHome,
    PageChallenge,
]

export { pages }
export type { IPage, ISection }