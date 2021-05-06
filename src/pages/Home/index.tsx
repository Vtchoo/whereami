import { IPage } from ".."

function Home() {

    return (
        <div>
            <h1>Home</h1>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
            <h3>home</h3>
        </div>
    )
}

const PageHome: IPage = {
    name: 'Home',
    path: '/',
    exact: true,
    component: Home
}

export { PageHome }