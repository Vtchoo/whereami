import { useAuth } from "../../contexts/AuthContext"
import style from './style.module.css'

function Header() {

    const { user } = useAuth()

    return (
        <div className={style.header}>
            <div>

            </div>
            <div>
                <h2>where am i</h2>
            </div>
            <div>
                {user?.username}
            </div>
        </div>
    )
}

export { Header }
