import { useState, useEffect } from "react"

export default function Tracks({note, press}) {
    const [currIdx, setCurrIdx] = useState(0)
    const [notes, setNotes] = useState({})

    useEffect(() => {
        if (press === 1) {
            if (currIdx < 16) {
                setNotes((prev) => ({
                    ...prev,
                    [currIdx]: note
                }))
                setCurrIdx(currIdx + 1)
            } if (currIdx === 16) {
                setCurrIdx(1)
                setNotes((prev) => ({
                    ...prev,
                    [currIdx]: note
                }))
            }
            console.log(notes)
        }
    }, [press])

    let noteArr = [...Object.values(notes).slice(0,16)] // Turn note object into mappable array
    return (
        <>
            {noteArr.map((note, idx) => {
                return <div key={idx}>{idx} {note}</div>
            })}
        </>
    )
}