import { useAuth } from "../../contexts/AuthContext"

function Header() {

    const { user } = useAuth()

    return (
        <div>
            {user?.username}
        </div>
    )
}

export { Header }
