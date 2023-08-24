import { useState, useEffect } from "react"
import Note from "midi-note"
import { Instrument, Track } from "reactronica"

export default function Tracks({note, press}) {
    const [currIdx, setCurrIdx] = useState(0)
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

    let noteArr = [...Object.values(notes).slice(1,17)] // Turn note object into mappable array
    return (
        <>
            {noteArr.map((note, idx) => {
                return <div key={idx}>{idx} {note}</div>
            })}

            <Track steps={noteArr}>
                <Instrument type="synth" envelope={{decay: 1, sustain: 0, release: 0.3}}/>
            </Track>
        </>
    )
}