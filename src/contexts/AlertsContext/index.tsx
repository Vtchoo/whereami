import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { BottomToast } from './components/BottomToast'
import { Toast, ToastProps } from './components/Toast'
import style from './style.module.css'
import { v4 as uuid } from 'uuid'
import { Alert, IAlert } from './components/Alert'

interface IToast {
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title?: string
    text: string
    autoDismissTimeout?: number
    autoDismiss?: boolean
    onClick?(): void
    actionIcon?: string
}

interface ToastContextData {
    addBottomToast: (message: string, timeout?: number) => void
    addToast: (text: string, options?: Partial<IToast>) => void
    addAlert: (text: string, options?: Partial<IAlert>) => void
}

interface ToastProviderProps {
    children: ReactNode
    autoDismiss?: boolean
    autoDismissTimeout?: number
    position?: 'top' | 'bottom'
}

const ToastContext = createContext({} as ToastContextData)

const testToasts: IToast[] = [
    { type: 'success', title: 'Success', text: 'Teste sucesso', id: uuid() },
    { type: 'info', title: 'info', text: 'Teste info', id: uuid()  },
    { type: 'error', title: 'error', text: 'Teste erro', id: uuid()  },
    { type: 'warning', title: 'warning', text: 'Teste aviso', id: uuid()  },
    { type: 'warning', title: 'warning', text: 'Teste aviso', id: uuid()  },
    { type: 'info', text: 'Toast without title', id: uuid() }
]

function AlertsProvider({ children, position = 'top', ...props }: ToastProviderProps) {

    //
    // Defaults
    //
    const defaultToastTimeout = props.autoDismissTimeout || 5000

    //
    // Side toasts manager
    //
    const [toasts, setToasts] = useState<IToast[]>([])
    const [toastTimeout, setToastTimeout] = useState(defaultToastTimeout)

    function handleDelete(id: string) {

        setToasts(toasts => toasts.filter(toast => toast.id !== id))
    }

    function addToast(text: string, options?: Partial<IToast>) {

        const newToast: IToast = {
            text,
            ...options,
            type: options?.type || 'info',
            autoDismiss: options?.autoDismiss ?? true,
            id: uuid(),
        }

        setToasts(toasts => [...toasts, newToast])
    }

    //
    // Bottom Toast manager
    //
    const [bottomToastVisible, setBottomToastVisible] = useState(false)
    const [bottomToastMessage, setBottomToastMessage] = useState('')
    const [bottomToastTimeout, setBottomToastTimeout] = useState(defaultToastTimeout)

    function addBottomToast(message: string, timeout?: number) {
        setBottomToastMessage(message)
        
        setBottomToastTimeout(timeout ?? defaultToastTimeout)
        
        setBottomToastVisible(true)
    }

    useEffect(() => {
        const timeout = setTimeout(() => setBottomToastVisible(false), bottomToastTimeout)
        return () => clearTimeout(timeout)
    }, [bottomToastVisible, bottomToastMessage, bottomToastTimeout])

    //
    // Alert manager
    //

    const [alerts, setAlerts] = useState<IAlert[]>([])

    function addAlert(text: string, alert?: Partial<IAlert>) {
        setAlerts(alerts => [...alerts, { text, ...alert }])
    }

    function handleRemoveAlert(alert: IAlert) {
        setAlerts(alerts => alerts.filter(_alert => alert !== _alert))
    }

    return (
        <ToastContext.Provider value={{
            addBottomToast,
            addToast,
            addAlert
        }}>
            {/* Original content */}
            {children}
            
            {/* Bottom toast */}
            <BottomToast text={bottomToastMessage} active={bottomToastVisible} />
            
            {/* Side toasts */}
            <div className={`${style.toastViewport} ${style[position]}`}>
                <div className={`${style.toastContainer} ${style[position]}`}>
                    {toasts.map((toast, i) => 
                        <Toast
                            key={toast.id}
                            type={toast.type}
                            title={toast.title}
                            text={toast.text}
                            onDelete={() => handleDelete(toast.id)}
                            autoDismiss={toast.autoDismiss}
                            autoDismissTimeout={toast.autoDismissTimeout || toastTimeout}
                            onClick={toast.onClick}
                            actionIcon={toast.actionIcon}
                        />
                    )}
                </div>
            </div>

            {/* Alerts */}
            {alerts.map((alert, i) => <Alert key={i} alert={alert} onDismiss={() => handleRemoveAlert(alert)}/>)}
        </ToastContext.Provider>
    )
}

function useAlerts() {
    return useContext(ToastContext)
}

export { AlertsProvider, useAlerts }