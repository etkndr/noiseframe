import styles from "./Home.module.css"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

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
            <select onChange={(e) => setSelSong(e.target.value)}>
                <option selected disabled>song list</option>
                {songs?.map((song, idx) => {
                    return <option value={song.id} key={idx}>{song.title}</option>
                })}
            </select>
            <button onClick={() => selSong > 0 && history.push(`/songs/${selSong}`)}>edit song</button>
            <select onChange={(e) => setSelInst(e.target.value)}>
                <option selected disabled>instrument list</option>
                {insts?.map((inst, idx) => {
                    return <option value={inst.id} key={idx}>{inst.title}</option>
                })}
            </select>
            <button onClick={() => selInst > 0 && history.push(`/instruments/${selInst}`)}>edit instrument</button>

            <div>
                <button onClick={() => history.push("/songs")}>new song</button>
                <button onClick={() => history.push("/instruments")}>new instrument</button>
            </div>
        </>
    )
}