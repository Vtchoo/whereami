import { HtmlHTMLAttributes, ReactNode, useEffect } from 'react'
import style from './style.module.css'

interface ModalProps extends HtmlHTMLAttributes<HTMLDivElement> {
    children: ReactNode
    timeout?: number
    onTimeout?(): void
}

function Modal(props: ModalProps) {

    const { children, className, timeout, onTimeout, ...rest } = props

    useEffect(() => {
        if (timeout && onTimeout) {
            const handler = setTimeout(onTimeout, timeout)
            return () => clearTimeout(handler)
        }
    }, [])

    return (
        <div className={style.overlay}>
            {props.children}
        </div>
    )
}

export default Modal