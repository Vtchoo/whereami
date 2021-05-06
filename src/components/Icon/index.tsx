import { SVGProps } from "react"
import dictionary from "./dictionary"

interface Props extends SVGProps<SVGSVGElement>{
    icon: string
    size?: number | string
}

function Icon(props: Props) {

    const { size = 20, icon, d, style, ...rest } = props

    return (
        <svg style={{ width: size, height: size, ...style }} {...rest} viewBox="0 0 24 24">
            <path fill={rest.color || 'currentcolor'} d={dictionary[icon] || dictionary['question-mark']}/>
        </svg>
    )
}

export default Icon