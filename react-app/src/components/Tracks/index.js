import { useState, useEffect } from "react"

export default function Tracks({note}) {
    const [currIdx, setCurrIdx] = useState(0)

    useEffect(() => {
        if (currIdx < 15) {
            setCurrIdx(currIdx + 1)
        } else {
            setCurrIdx(0)
        }
        console.log(currIdx, note)
    }, [note])

    return (
        <>
        </>
    )
}