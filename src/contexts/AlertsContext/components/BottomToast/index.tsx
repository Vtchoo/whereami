import { ReactNode, useEffect, useState } from "react"
import style from './style.module.css'

interface ToastProps {
    text: string
    icon?: string
    time?: number
    children?: ReactNode
    active: boolean
}

function BottomToast({ active, ...props}: ToastProps) {

    // const [active, setActive] = useState(false)

    useEffect(() => {

        // if (!props.text) {
        //     setActive(false)
        //     return
        // }

        // setActive(true)

        // const timeout = setTimeout(() => setActive(false), props.time ?? 2000)

        // return () => clearTimeout(timeout)

    }, [props.text])

    return (
        <div className={`${style.toastContainer} ${!!props.text && active && style.active}`}>
            <div className={`${style.toast} ${!!props.text && active && style.active}`}>
                <span>{props.text}</span>
            </div>
        </div>
    )
}

export { BottomToast }