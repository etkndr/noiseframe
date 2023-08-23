import { useState, useEffect } from "react"

export default function Tracks({note, press}) {
    const [currIdx, setCurrIdx] = useState(0)
    const [notes, setNotes] = useState({})

    useEffect(() => {
        if (press === 1) {
            if (currIdx < 16) {
                setCurrIdx(currIdx + 1)
                setNotes((prev) => ({
                    ...prev,
                    [currIdx]: note
                }))
            } else {
                setCurrIdx(1)
                setNotes((prev) => ({
                    ...prev,
                    [currIdx]: note
                }))
            }
            console.log(notes)
        }
    }, [press])

    return (
        <>
        {note}
        </>
    )
}