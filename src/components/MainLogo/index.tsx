import { SVGProps } from "react"
import style from './style.module.css'

interface MainLogoProps extends SVGProps<SVGSVGElement> {
    floating?: boolean
    color?: string
}

function MainLogo({ color, floating, className, ...props }: MainLogoProps) {
    return (
        <svg className={`${style.AppLogo} ${floating ? 'float' : ''} ${className}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"  width="24" height="24" viewBox="0 0 24 24" {...props}>
            <path fill={color || 'currentColor'} d="M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4M11,6H13V11H11V6M11,13H13V15H11V13Z" />
        </svg>
    )
}

export default MainLogo
