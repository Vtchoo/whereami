import { ButtonHTMLAttributes } from "react"
import Icon from "../Icon"
import style from './style.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    mode?: 'default' | 'accept' | 'neutral' | 'disabled' | 'danger' | 'warning' | 'wait' | 'dark' | 'light'
    icon?: string
    iconSize?: string | number
}


function Button({ text, icon, iconSize, disabled, className, mode = 'default', ...props}: ButtonProps) {

    return (
        <button
            disabled={disabled}
            className={`${style.button} ${style[mode]} ${disabled && style.disabled} ${className}`}
            {...props}
        >
            <h3>{icon && <Icon icon={icon} size={iconSize}/>} {text}</h3>
        </button>
    )
}

export { Button }