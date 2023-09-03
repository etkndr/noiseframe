import { useState, useEffect } from "react"
import { Track, Instrument } from "reactronica"
import Toggle from "./Toggle"
import style from "./Sequencer.module.css"

export default function Sequencer({sample, savedSteps}) {

    const [steps, setSteps] = useState({})
    let currStep

    useEffect(() => {
        if (!savedSteps) {
            for (let i = 0; i < 16; i++) {
                setSteps(prev => ({
                    ...prev,
                    [i]: null
                }))
            } 
        } else {
            savedSteps.split(" ").forEach((step, idx) => {
                if (step === "null") {
                    setSteps(prev => ({
                        ...prev,
                        [idx]: null
                    }))
                } else {
                    setSteps(prev => ({
                        ...prev,
                        [idx]: step
                    }))
                }
            })
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
    }

    console.log(steps)

    return (
        <>
        <div>
            {Object.values(steps).map((step, idx) => {
                return (
                    <Toggle handleToggle={handleToggle} step={idx} on={step !== null} key={idx}/>
                )
            })}
        </div>
        <Track steps={Object.values(steps)} onStepPlay={handleStepChange}>
            <Instrument type="sampler" samples={{"C3": sample}}/>
        </Track>
        </>
    )
}