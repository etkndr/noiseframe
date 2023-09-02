import { useState, useEffect } from "react"
import { Track, Instrument } from "reactronica"

export default function Sequencer() {

    const [steps, setSteps] = useState({})
    let currStep

    useEffect(() => {
        for (let i = 0; i < 16; i++) {
            setSteps(prev => ({
                ...prev,
                [i]: null
            }))
        } 
    }, [])

    function handleStepInput(idx, e) {
        e.preventDefault()
        setSteps(prev => ({
            ...prev,
            [idx]: e.target.value
        }))
    }

    function handleStepChange() {
        if (currStep <= 14) {
            currStep++
        } else {
            currStep = 0
        }
        console.log(currStep)
    }

    // console.log(steps[currStep])
    return (
        <>
        {Object.values(steps).map((step, idx) => {
            return (
                <input key={idx} type="text" onChange={(e) => handleStepInput(idx, e)} value={step}/>
            )
        })}
        <Track steps={["C3", "D3", "E3", "G3"]} onStepPlay={handleStepChange}>
            <Instrument type="fmSynth"/>
        </Track>
        </>
    )
}