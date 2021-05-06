import { SVGProps } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import style from '../.styles/external.module.css'

function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"  width="24" height="24" viewBox="0 0 24 24" {...props}>
            <path fill="white" d="M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4M11,6H13V11H11V6M11,13H13V15H11V13Z" />
        </svg>
    )
}

function Login() {

    return (
        <div className={style.mainContainer}>
            <div className={style.background}/>
            <div className={style.loginbox}>
                <div className={style.formContainer}>

                    <div className={style.header}>
                        <Logo className={style.AppLogo} style={{ width: 100, height: 100 }} />
                        <h1 className={style.title}>whereami</h1>
                    </div>

                    <div className={style.inputs}>
                        <div className={style.inputContainer}>
                            <Icon icon='user' size='1.5rem' color='grey'/>
                            <input placeholder='User' />
                        </div>
                        <div className={style.inputContainer}>
                            <Icon icon='key-variant' size='1.5rem' color='grey'/>
                            <input placeholder='Password'type='password' />
                        </div>
                    </div>

                    <div className={style.buttons}>
                        <button className={`${style.button} ${style.login}`}>Login</button>
                        <Link to='/signup' className={`${style.button} ${style.signup}`}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Login }

