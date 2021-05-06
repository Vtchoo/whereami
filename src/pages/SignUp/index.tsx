import { Link } from 'react-router-dom'
import style from '../.styles/external.module.css'

function SignUp() {



    return (
        <div className={style.mainContainer}>
            <div className={style.background}/>
            <div className={style.loginbox}>
                <div className={style.formContainer}>
                    <h1 className={style.title}>Sign up</h1>
                    <input placeholder='User' className={style.input} />
                    <input placeholder='Password' className={style.input} type='password' />
                    <button className={`${style.button} ${style.login}`}>Login</button>
                    <Link to='/signup'>
                        <div className={`${style.button} ${style.signup}`}>Sign up</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export { SignUp }