import { useEffect, useLayoutEffect, useState } from 'react'
import Icon from '../../../../components/Icon'
import style from './style.module.css'

interface ToastProps {
    type: 'success' | 'error' | 'info' | 'warning'
    title?: string
    text: string
    autoDismiss?: boolean
    autoDismissTimeout?: number
    onDelete?(): void
    onClick?(): void
    actionIcon?: string
}

const iconMap = {
    success: 'check-circle',
    error: 'close-circle', //'alert-circle',
    info: 'information',
    warning: 'alert'
}

function Toast({ type = 'info', title, text, ...props }: ToastProps) {

    const [active, setActive] = useState(false)
    
    useEffect(() => {
        setTimeout(() => setActive(true), 10)

        if (!props.autoDismiss)
            return

        const timeout = setTimeout(() => {
            props.onDelete?.()
        }, props.autoDismissTimeout)

        return () => clearTimeout(timeout)
    }, [])

    function handleDelete() {
        props.onDelete?.()
    }

    return (
        <div className={`${style.toast} ${style[type]} ${active && style.active}`}>
            <Icon icon={iconMap[type]} size='2rem' />
            <div className={style.content} onClick={props.onClick} style={{ cursor: props.onClick ? 'pointer' : 'unset' }}>
                {title && <p>{title}</p>}
                <small>{text}</small>
            </div>
            <div className={style.actions}>
                <Icon icon='close-thick' size='1rem' className={style.close} onClick={handleDelete} />
                
                {props.onClick &&
                    <Icon icon={props.actionIcon || 'cursor-pointer'} size='1rem' onClick={props.onClick} className={style.actionIcon}/>
                }
            </div>
        </div>
    )
}

export { Toast }
export type { ToastProps }
