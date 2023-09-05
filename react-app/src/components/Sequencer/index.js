import { useState, useEffect } from "react"
import { Track, Instrument } from "reactronica"
import Toggle from "./Toggle"
import style from "./Sequencer.module.css"

export default function Sequencer({url, sample, savedSteps, saveTrack, muted}) {

    const [steps, setSteps] = useState({})
    const [mute, setMute] = useState(false)
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

    useEffect(() => {
        const joinSteps = Object.values(steps).map((step) => {
            if (step === null) {
                return "null"
            } else {
                return step
            }
        })
        saveTrack(sample, joinSteps.join(" "))
    }, [steps])

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

    return (
        <>
        <div>
            {sample?.name}
            {Object.values(steps).map((step, idx) => {
                return (
                    <Toggle 
                        handleToggle={handleToggle} 
                        step={idx} 
                        on={step !== null} 
                        key={idx}
                    />
                )
            })}
            <button onClick={() => setMute(!mute)}>{mute && `unmute`} {!mute && `mute`}</button>
        </div>
        <Track steps={Object.values(steps)} onStepPlay={handleStepChange} mute={mute}>
            <Instrument type="sampler" samples={{"C3": url}}/>
        </Track>
        </>
    )
}