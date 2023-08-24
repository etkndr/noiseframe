import { useState, useEffect } from "react"
import Note from "midi-note"
import { Instrument, Track } from "reactronica"
import styles from "./Tracks.module.css"
import * as trackActions from "../../store/tracks"
import { useSelector, useDispatch } from "react-redux"

export default function Tracks({note, press, songId}) {
    const [currIdx, setCurrIdx] = useState(1)
    const [notes, setNotes] = useState({})
    const [inst, setInst] = useState("")
    const [title, setTitle] = useState("")
    const [volume, setVolume] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        if (press === 1) {
            if (currIdx < 16) {
                setNotes((prev) => ({
                    ...prev,
                    [currIdx]: Note(note)
                }))
                setCurrIdx(currIdx + 1)
            } if (currIdx === 16) {
                setCurrIdx(1)
                setNotes((prev) => ({
                    ...prev,
                    [currIdx]: Note(note)
                }))
            }
        }
    }, [press])

    let noteArr = [...Object.values(notes)] // Turn note object into mappable array

    function save(e) {
        e.preventDefault()
        const newTrack = {
            instrument_id: inst,
            title,
            notes: noteArr.join(" "),
            volume
        }
        const save = dispatch(trackActions.saveTrack(songId, newTrack))
        console.log("success", newTrack)
    }

    return (
        <>
            <div className={styles.notes}>
                {noteArr.map((note, idx) => {
                    return <div key={idx}>{note}</div>
                })}
            </div>

            <Track steps={noteArr}>
                <Instrument type="synth" envelope={{decay: 1, sustain: 0, release: 0.3}}/>
            </Track>
            <form onSubmit={save}>
                <input onChange={(e) => setInst(e.target.value)} placeholder="instrument id"/>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                <input type="range" min={-10} max={-1} onChange={(e) => setVolume(e.target.value)}/> {volume}
                <button type="submit">save</button>
            </form>
        </>
    )
}