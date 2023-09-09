import "./Home.css"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import classnames from "classnames"

export default function Home() {
    const history = useHistory()
    const dispatch = useDispatch()
    const songs = useSelector(state => Object.values(state.songs))
    const insts = useSelector(state => Object.values(state.instruments))

    const [selSong, setSelSong] = useState("")
    const [selInst, setSelInst] = useState("")

    useEffect(() => {
        dispatch(songActions.getSongs())
        dispatch(instrumentActions.getInstruments())
    }, [dispatch])

    

    return (
        <>
        <div className="lists">
            <div className="list">
                {songs?.map((song, idx) => {
                    let select = ""
                    if (song.id === selSong) {
                        select = "select"
                    }
                    return <li 
                        onClick={() => setSelSong(song.id)} 
                        className={select}
                        key={idx}>
                    {song.title}</li>
                })}
            </div>
            <button onClick={() => selSong > 0 && history.push(`/songs/${selSong}`)}>edit song</button>
            <div className="list">
                {insts?.map((inst, idx) => {
                    let select = ""
                    if (inst.id === selInst) {
                        select = "select"
                    }
                    return <li 
                        onClick={() => setSelInst(inst.id)} 
                        className={select}
                        key={idx}>{inst.title}</li>
                })}
            </div>
            <button onClick={() => selInst > 0 && history.push(`/instruments/${selInst}`)}>edit instrument</button>
            </div>
            <div>
                <button onClick={() => history.push("/songs")}>new song</button>
                <button onClick={() => history.push("/instruments")}>new instrument</button>
            </div>
        </>
    )
}