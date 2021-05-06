import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import User, { IUser } from '../../models/User'
import style from '../.styles/external.module.css'
import { useDebounce } from '../../hooks/useDebounce'

function SignUp() {

    const [user, setUser] = useState({} as IUser)

    const [usernameIsValid, setUsernameIsValid] = useState<boolean>()
    const [usernameMessage, setUsernameMessage] = useState('')

    const [emailMessage, setEmailMessage] = useState('')

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
        if (!user.username) {
            setUsernameIsValid(undefined)
            setUsernameMessage('')
            return
        }

        try {
            const { count } = await User.verify(user.username)
            
            setUsernameIsValid(count === 0)
            setUsernameMessage(count ? `Username ${user.username} is already taken` : `Username ${user.username} is available`)
            
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
                        <div className={style.inputContainer} style={{ borderColor: usernameIsValid === false ? 'red' : usernameIsValid ? 'green' : undefined }}>
                            <Icon icon='user' size='1.5rem' color='grey'/>
                            <input value={user.username || ''} placeholder='Username' className={style.input} onChange={e => changeUser({ username: e.target.value })}/>
                        </div>
                        <small>{usernameMessage}</small>
                        <div className={style.inputContainer}>
                            <Icon icon='at' size='1.5rem' color='grey'/>
                            <input value={user.email || ''} placeholder='Email' className={style.input} />
                        </div>
                        <small>{emailMessage}</small>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input value={user.password || ''} placeholder='Password' className={style.input} type='password' />
                        </div>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input placeholder='Confirm your password' className={style.input} type='password' />
                        </div>
                        <small>{confirmPasswordMessage}</small>
                    </div>

                    <span>{message}</span>

                    <div className={style.buttons}>
                        <button className={`${style.button} ${style.login}`}>Create account</button>
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