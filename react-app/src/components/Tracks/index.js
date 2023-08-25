import { useState, useEffect } from "react"
import Note from "midi-note"
import { Instrument, Track } from "reactronica"
import styles from "./Tracks.module.css"
import * as trackActions from "../../store/tracks"
import { useSelector, useDispatch } from "react-redux"
import AudioKeys from "audiokeys"

export default function Tracks({songId, focus}) {
    const dispatch = useDispatch()
    const [currIdx, setCurrIdx] = useState(1)
    const [notes, setNotes] = useState({})
    const [inst, setInst] = useState("")
    const [title, setTitle] = useState("")
    const [volume, setVolume] = useState(-3)
    const [note, setNote] = useState("")
    const keys = new AudioKeys() // Create midi map from user keyboard

    
    // add note on key press
    if (!focus) {
        keys.down((note) => {
                setNote(note.note)
            })
    } else {
        keys.down((note) => {
            note = ""
            console.log(note)
        })
    }

    useEffect(() => {
        if (note) {
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
    }, [note])

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
                <input type="range" defaultValue={volume} min={-10} max={-1} onChange={(e) => setVolume(e.target.value)}/> {volume}
                <button type="submit">save</button>
            </form>
        </>
    )
}