import { Route } from "react-router"
import { Header } from "../../components/Header"
import { Sidebar } from "../../components/Sidebar"
import { GoogleMapsProvider } from "../../contexts/GoogleMaps"
import { pages } from "../../pages"
import style from './style.module.css'

function InternalNavigation() {

    return (
        <GoogleMapsProvider
            apiKey={process.env.NODE_ENV === 'development' ?
                process.env.REACT_APP_GOOGLE_MAPS_API_KEY :
                process.env.REACT_APP_GOOGLE_MAPS_API_KEY
            }
            version='3.44.14'
        >
            <div className={style.mainContainer}>
            
                <Header />
                
                <div className={style.container}>
                    <Sidebar />
                    <div className={style.contentContainer}>

                        {pages.map((page, i) => {
                        
                            return <Route key={page.name} path={page.path} exact={page.exact} component={page.component} />
                        })}
                    </div>
                </div>
            </div>
        </GoogleMapsProvider>
    )
}

export { InternalNavigation }