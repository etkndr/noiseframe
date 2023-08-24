import { useState, useEffect } from "react"
import Note from "midi-note"
import { Instrument, Track } from "reactronica"
import styles from "./Tracks.module.css"

export default function Tracks({note, press}) {
    const [currIdx, setCurrIdx] = useState(1)
    const [notes, setNotes] = useState({})
    // let env = bpm/1000

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
    console.log("obj", notes)
    console.log("arr", noteArr)
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
        </>
    )
}