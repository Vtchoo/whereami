import { useAuth } from "../../contexts/AuthContext"
import style from './style.module.css'

function Header() {

    const { user } = useAuth()

    return (
        <div className={style.header}>
            .
            <h2>where am i</h2>
            {user?.username}
        </div>
    )
}

export { Header }
