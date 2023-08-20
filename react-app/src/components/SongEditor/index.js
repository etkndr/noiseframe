import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as trackActions from "../../store/tracks"
import * as songActions from "../../store/songs"
import {getInstruments} from "../../store/instruments"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const tracks = useSelector(state => state.tracks)
    const song = useSelector(state => state.songs)
    const insts = useSelector(state => state.instruments)

    const [title, setTitle] = useState()
    const [bpm, setBpm] = useState()
    
    useEffect(() => {
        dispatch(trackActions.getTracks(id))
        dispatch(songActions.getSong(id))
        dispatch(getInstruments())
    }, [])
    
    async function submit(e) {
        e.preventDefault()
        const newSong = {title, bpm}
        const save = await dispatch(songActions.saveSong(newSong))
        console.log("success")
    }

    return (
        <>
            song editor
            <form onSubmit={submit}>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="title"/>
                <input onChange={(e) => setBpm(e.target.value)} placeholder="BPM"/>
                <button type="submit">submit</button>
            </form>
        </>
    )
}