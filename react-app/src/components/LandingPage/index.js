import "./LandingPage.css"
import * as session from "../../store/session"
import SignupFormModal from "../SignupFormModal"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function LandingPage() {
    const history = useHistory()
    const user = useSelector(state => state.session.user)

    if (user) history.push("/home")

    return (
    <>
        <div className="home-left landing">
            <p className="welcome">welcome to noiseframe, an app that allows you to quickly create patterns of sample-based music.</p>
            <p className="welcome">noiseframe is currently still in active development, 
            with new features and functionality being added periodically. 
            if you have a feature request or run into any bugs, please <a href="mailto:etkndr@gmail.com">let me know!</a></p>
            <p className="welcome">to use the sampler, you will need to upload sound files from your computer. if you're looking for samples, <a href="https://drive.google.com/file/d/1weu8xEPFEoAcULftz0P8TkVcm7qBfgp7/view" target="_blank">here are a few to get you started</a>.</p>
            <p className="welcome">have fun!</p>
        </div>
        <div className="home-right landing">
            <SignupFormModal/>
        </div>
    </>
    )
}