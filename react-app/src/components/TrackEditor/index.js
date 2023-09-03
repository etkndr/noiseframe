import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Instrument, Track } from "reactronica"
import * as trackActions from "../../store/tracks"
import { getSamples } from "../../store/samples"
import Inst from "../InstEditor/Inst"
import styles from "./Tracks.module.css"

export default function TrackEditor({songId, instId}) {
    const dispatch = useDispatch()
    const [currIdx, setCurrIdx] = useState(1)
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState("")
    const [volume, setVolume] = useState("")
    const samples = useSelector(state => state.samples)

    useEffect(() => {
        dispatch(getSamples(instId))
    })

    function save(e) {
        e.preventDefault()
        const newTrack = {
            instrument_id: instId,
            title,
            notes,
            volume
        }
        const save = dispatch(trackActions.saveTrack(songId, newTrack))
        console.log("success", newTrack)
    }

    return (
        <>
            <form onSubmit={save}>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                <input type="range" min={-10} max={-1} onChange={(e) => setVolume(e.target.value)}/> {volume}
                <button type="submit">save</button>
            </form>
        </>
    )
}