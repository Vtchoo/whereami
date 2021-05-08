import { ReactNode, useEffect, useState } from "react"
import { BrowserRouter, Redirect, Route, RouteProps, Switch, useHistory, useLocation } from "react-router-dom"
import Modal from '../components/Modal'
import { useAuth } from '../contexts/AuthContext'
import { Login } from '../pages/Login'
import { SignUp } from "../pages/SignUp"
import RouterUtils from "../utils/RouterUtils"
import { InternalNavigation } from "./internal"
// import Signin from "../../pages/Signin"
// import InternalNavigation from "../Internal"
// import ForgotPassword from "../../pages/ForgotPassword"
// import RedefinePassword from "../../pages/RedefinePassword"

function PrivateRoute({ children, ...props }: { children?: ReactNode } & RouteProps) {

    const { user, loggedIn, authenticating } = useAuth()

    const location = useLocation()

    if (authenticating) return <Modal>Logging in</Modal>

    if (!loggedIn) return <Redirect to={{ pathname: '/login', search: `?from=${location.pathname}` }} />

    return (
        <Route {...props}>
            {children}
        </Route>
    )
}

function ExternalRoute({ children, ...props }: { children?: ReactNode } & RouteProps) {
 
    const { user, loggedIn, authenticating } = useAuth()
    
    const { search } = useLocation()

    const from = RouterUtils.parseQuery(search).from
    
    // if (authenticating) return <Modal>Logging in</Modal>
    // const from = state?.from

    if (loggedIn) return <Redirect to={{ pathname: from ?? '/' }} />

    return (
        <Route {...props}>
            {children}
        </Route>
    )
}

function MainNavigation() {
    return (
        <BrowserRouter>
            <Switch>
                <ExternalRoute exact path='/login' component={Login}/>
                <ExternalRoute exact path='/signup' component={SignUp}/>
                {/* <ExternalRoute exact path='/forgotpassword'>
                    <ForgotPassword />
                </ExternalRoute>
                <ExternalRoute exact path='/redefinepassword'>
                    <RedefinePassword />
                </ExternalRoute> */}
                <PrivateRoute path='/' component={InternalNavigation}/>
            </Switch>
        </BrowserRouter>
    )
}

export default MainNavigation