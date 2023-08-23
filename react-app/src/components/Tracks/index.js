import { useState, useEffect } from "react"

export default function Tracks({note}) {
    const [currIdx, setCurrIdx] = useState(0)
    const notes = {
    }


    useEffect(() => {
        if (currIdx < 16) {
            setCurrIdx(currIdx + 1)
            notes[currIdx] = note
        } else {
            setCurrIdx(1)
            notes[currIdx] = note
        }
        console.log(notes)
    }, [note])

    return (
        <>
        {note}
        </>
    )
}