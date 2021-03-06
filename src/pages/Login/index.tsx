import { FormEvent, FormEventHandler, SVGProps, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import MainLogo from '../../components/MainLogo'
import { useAuth } from '../../contexts/AuthContext'
import style from '../.styles/external.module.css'


function Login() {

    // Hooks
    const { login } = useAuth()

    // State
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')


    async function handleLogin(e: FormEvent<HTMLFormElement>) {

        e.preventDefault()

        if (!username) return setMessage('Inform your username')
        if (!password) return setMessage('Inform your password too')
        
        setMessage('')

        try {
            
            await login(username, password)

        } catch (error) {
            console.log(error)
            setMessage(error.response?.data?.message)
        }
    }

    return (
        <div className={style.mainContainer}>
            <div className={style.background}/>
            <div className={style.loginbox}>
                <form className={style.formContainer} onSubmit={handleLogin}>

                    <div className={style.header}>
                        <MainLogo className={style.AppLogo} style={{ width: 100, height: 100 }} />
                        <h1 className={style.title}>whereami</h1>
                    </div>

                    <div className={style.inputs}>
                        <div className={style.inputContainer}>
                            <Icon icon='user' size='1.5rem' color='grey'/>
                            <input placeholder='User' value={username} onChange={e => setUsername(e.target.value)}/>
                        </div>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                        </div>
                    </div>

                    <span style={{ color: 'white' }}>{message}</span>

                    <div className={style.buttons}>
                        <button className={`${style.button} ${style.login}`} type='submit'>Login</button>
                        <Link to='/signup' className={`${style.button} ${style.signup}`}>
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { Login }

