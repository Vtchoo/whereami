import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import User, { IUser } from '../../models/User'
import style from '../.styles/external.module.css'
import { useDebounce } from '../../hooks/useDebounce'

function SignUp() {

    const [user, setUser] = useState({} as IUser)

    const [usernameMessage, setUsernameMessage] = useState('')

    const [confirmPassword, setConfirmPassword] = useState<string>()
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('')

    const [message, setMessage] = useState('')

    function changeUser(user: Partial<IUser>) {
        setUser(oldUser => ({ ...oldUser, ...user }))
    }

    //
    useDebounce(() => {
        verifyUsername()
    }, 1500, [user.username])

    async function verifyUsername() {
        if(!user.username) return
        
        try {
            const result = await User.verify(user.username)
            console.log(result)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={style.mainContainer}>
            <div className={style.background}/>
            <div className={style.loginbox}>
                <div className={style.formContainer}>
                    <div className={style.header}>
                        <h1 className={style.title}>Sign up</h1>
                    </div>

                    <div className={style.inputs}>
                        <div className={style.inputContainer}>
                            <Icon icon='user' size='1.5rem' color='grey'/>
                            <input value={user.username} placeholder='Username' className={style.input} onChange={e => changeUser({ username: e.target.value })}/>
                        </div>
                        <span>{usernameMessage}</span>
                        <div className={style.inputContainer}>
                            <Icon icon='at' size='1.5rem' color='grey'/>
                            <input value={user.email} placeholder='Email' className={style.input} />
                        </div>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input value={user.password} placeholder='Password' className={style.input} type='password' />
                        </div>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input placeholder='Confirm your password' className={style.input} type='password' />
                        </div>
                        <span>{confirmPasswordMessage}</span>
                    </div>

                    <span>{message}</span>

                    <div className={style.buttons}>
                        <button className={`${style.button} ${style.login}`}>Login</button>
                        <Link to='/login' className={`${style.button} ${style.signup}`}>
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { SignUp }