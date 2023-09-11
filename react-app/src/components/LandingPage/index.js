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
        <div className={styles.container}>
            <p className={styles.welcome}>welcome to noiseframe, an app that allows you quickly create patterns of sample-based music</p>
            <p className={styles.welcome}>sign up or log in to get started</p>
        </div>
    )
}