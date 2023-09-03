import { useState, useEffect } from "react"
import { Track, Instrument } from "reactronica"
import Toggle from "./Toggle"
import style from "./Sequencer.module.css"

export default function Sequencer({sample}) {

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

    function handleToggle(step, state) {
        setSteps((prev) => ({
            ...prev,
            [step]: state
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

    console.log(steps)

    return (
        <>
        <div>
            {Object.values(steps).map((step, idx) => {
                return (
                    <Toggle handleToggle={handleToggle} step={idx}/>
                )
            })}
        </div>
        <Track steps={Object.values(steps)} onStepPlay={handleStepChange}>
            <Instrument type="sampler" samples={{"C3": sample}}/>
        </Track>
        </>
    )
}