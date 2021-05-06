import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Icon from '../../components/Icon'
import User, { IUser } from '../../models/User'
import style from '../.styles/external.module.css'
import { useDebounce } from '../../hooks/useDebounce'
import { useAuth } from '../../contexts/AuthContext'

function SignUp() {

    // Hooks
    const history = useHistory()

    // State
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

    async function handleCreateAccount() {

        if (!user.username) return setMessage(`Username required`)
        if (!user.email) return setMessage('Email required')
        if (!user.password) return setMessage('Password required')
        if(user.password !== confirmPassword) return setMessage('Passwords don\'t match')
        
        setMessage('')

        try {
            
            const result = await User.create(user)

            alert('User created successfully!')

            history.replace('/login')

        } catch (error) {
            console.log(error)
            setMessage(error.response?.data?.message)
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
                            <input value={user.email || ''} placeholder='Email' className={style.input} onChange={e => changeUser({ email: e.target.value }) }/>
                        </div>
                        <small>{emailMessage}</small>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input value={user.password || ''} placeholder='Password' className={style.input} type='password' onChange={e => changeUser({ password: e.target.value })}/>
                        </div>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input placeholder='Confirm your password' className={style.input} type='password' onChange={e => setConfirmPassword(e.target.value)}/>
                        </div>
                        <small>{confirmPasswordMessage}</small>
                    </div>

                    <span style={{ color: 'red' }}>{message}</span>

                    <div className={style.buttons}>
                        <button className={`${style.button} ${style.login}`} onClick={handleCreateAccount}>Create account</button>
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