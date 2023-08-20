import styles from"./LandingPage.module.css"
import button from "../../modules/Button.module.css"
import * as session from "../../store/session"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function LandingPage() {
    const history = useHistory()
    const user = useSelector(state => state.session.user)

    if (user) history.push("/home")

    return (
        <>
            welcome to noiseframe
        </>
    )
}