import { useState, useEffect } from "react"
import { Track, Instrument } from "reactronica"
import Toggle from "./Toggle"
import useKeyPress from "../../hooks/useKeyPress"
import "./Sequencer.css"

export default function Sequencer({url, sample, saveTrack, track, play, idx}) {
    const [steps, setSteps] = useState({})
    const [mute, setMute] = useState(false)
    const [savedSteps, setSavedSteps] = useState(track?.steps)
    const [currSample, setCurrSample] = useState(url)
    const [seed, setSeed] = useState(1);
    const [currStep, setCurrStep] = useState(-1)

    const muteKey = useKeyPress(idx.toString())

    useEffect(() => {
        setMute(muteKey)
    }, [muteKey]) 

    useEffect(() => {
        if (!play) {
            setCurrStep(-1)
        }
    }, [play])
    
    useEffect(() => {
        setSavedSteps(track?.steps)
        return
    }, [track])
    
    useEffect(() => {
        setSeed(Math.random());
        setCurrSample(url)
        return
    }, [url, sample])

    useEffect(() => {
        const joinSteps = Object.values(steps)?.map((step) => {
            if (step === null) {
                return "null"
            } else {
                return step
            }
        })

        if (steps && joinSteps.length && track) {
            saveTrack(track?.id, joinSteps?.join(" "))
        }
    }, [steps])
    
    useEffect(() => {
        if (savedSteps) {
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

    }, [savedSteps])

    useEffect(() => {
        if (currStep > 15) {
            setCurrStep(0)
        }
    }, [currStep])

    function handleToggle(step, state) {
        setSteps({
            ...steps,
            [step]: state
        })
    }

    function handleStepChange() {
            setCurrStep((prev) => {return prev + 1})
    }

    return (
        <>
        <div className="sample-name">
            {idx}. {sample?.name}
        </div>
        <div className="seq">
        <div className="seq-row">
            {steps && Object.values(steps)?.map((step, idx) => {
                const on = step !== null
                let curr
                currStep === idx ? curr = "active-step" : curr = ""
                return (
                    <Toggle
                        handleToggle={handleToggle}
                        step={idx} 
                        on={on}
                        key={idx}
                        curr={curr}
                    />
                )
            })}
        </div>
            <button className="mute" onClick={() => setMute(!mute)}>
                <span className="muted">{mute && <span className="material-symbols-outlined">volume_off</span>}</span> 
                {!mute && <span className="material-symbols-outlined">volume_up</span>}
            </button>
        <Track steps={Object.values(steps)} onStepPlay={handleStepChange} mute={mute} key={`track-${seed}`}>
            <Instrument type="sampler" samples={{"C3": currSample}} key={seed}/>
        </Track>
        </div>
        </>
    )
}