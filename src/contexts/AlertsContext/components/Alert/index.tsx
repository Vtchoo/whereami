import { Button } from "../../../../components/Button";
import Icon from "../../../../components/Icon";
import Modal from "../../../../components/Modal";
import style from './style.module.css'

interface IAlert {
    title?: string
    text: string
    buttons?: {
        text: string
        onClick?: () => void
        mode?: 'default' | 'accept' | 'neutral' | 'disabled' | 'danger' | 'warning' | 'wait' | 'dark' | 'light'
    }[]
}

interface AlertProps {
    alert: IAlert
    onDismiss: () => void
}

function Alert({ onDismiss, ...props }: AlertProps) {

    const { alert } = props

    return (
        <Modal>
            <div className={style.container}>
                <div>
                    <div className={style.header}>
                        <h3>{alert.title}</h3>
                        <Icon className={style.icon} icon='close' size='2rem' onClick={onDismiss} />
                    </div>
                    <hr />
                </div>
                <p className={style.text}>{alert.text}</p>
                <div className={style.buttons}>
                    {alert.buttons ?
                        alert.buttons.map((button, i) => <Button className={style.button} key={i} text={button.text} mode={button.mode} onClick={() => { button.onClick?.(); onDismiss() }} />)
                        :
                        <Button text='Ok' mode='light' onClick={onDismiss} className={style.button} />
                    }
                </div>
            </div>
        </Modal>
    )
}

export { Alert }
export type { IAlert }