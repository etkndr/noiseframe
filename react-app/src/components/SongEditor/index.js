import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as trackActions from "../../store/tracks"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import { getSamples } from "../../store/samples"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    // const tracks = useSelector(state => state.tracks)
    const currUser = useSelector(state => state.session.user)
    const song = useSelector(state => state.songs)
    const allInst = useSelector(state => state.instruments)
    const samples = useSelector(state => Object.values(state.samples))
    const [play, setPlay] = useState(false)
    const [currInst, setCurrInst] = useState(1)
    
    useEffect(() => {
        // dispatch(trackActions.getTracks(id))
        dispatch(songActions.getSong(id))
        dispatch(getInstruments())
    }, [])

    useEffect(() => {
        dispatch(getSamples(currInst))
    }, [currInst])
    
    const [title, setTitle] = useState("")
    const [bpm, setBpm] = useState(120)
    
    function save(e) {
        e.preventDefault()
        const newSong = {title, bpm}
        const save = dispatch(songActions.editSong(id, newSong))
        console.log("success")
    }

    function dltSong(e) {
        e.preventDefault()
        const dlt = dispatch(songActions.deleteSong(id))
        console.log("success")
    }

    if (song?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }
    return (
        <>
            <h2>{song?.title}</h2>
            <button onClick={() => setPlay(!play)}>start/stop</button>
            <form onSubmit={save}>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                <input onChange={(e) => setBpm(e.target.value)} placeholder="BPM"/>
                <button type="submit">save</button>
                <button onClick={dltSong}>delete</button>
            </form>
            <Song bpm={bpm} isPlaying={play}>
                {samples?.map((sample) => {
                    return <Sequencer sample={sample.url}/>
                })}
            </Song>
        </>
    )
}