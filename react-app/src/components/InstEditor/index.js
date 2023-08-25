import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getInstrument } from "../../store/instruments"
import { Song, Track, Instrument } from "reactronica"
import { editInstrument } from "../../store/instruments"


export default function InstEditor() {
    const dispatch = useDispatch()
    const currUser = useSelector(state => state.session.user)
    const {id} = useParams()
    const inst = useSelector(state => state.instruments)
    const [playing, setPlaying] = useState(false)
    const typeArr = ["amSynth" , "duoSynth" , "fmSynth" , "membraneSynth", "monoSynth" , "pluckSynth" , "sampler"]
    
    useEffect(() => {
        dispatch(getInstrument(id))
    }, [])

    // load settings from instrument
    const [type, setType] = useState(inst?.type)
    const [sample, setSample] = useState(inst?.sample)
    const [osc, setOsc] = useState(inst?.osc)
    const [env, setEnv] = useState(inst?.env)

    function typeChange(e) {
        e.preventDefault()
        setType(e.target.value)
        setPlaying(false)
    }

    console.log(env)

    return (
        <>
            {inst && inst?.title}

            <button onClick={() =>setPlaying(!playing)}>Test</button>
            <select id="type" onChange={typeChange}>
                {typeArr.map((selType, idx) => {
                    return <option key={idx} value={selType}>{selType}</option>
                })}
            </select>
            <Song bpm={120} isPlaying={playing}>
                <Track steps={["C4"]}>
                    <Instrument 
                        type={type}
                        samples={sample && sample}
                        oscillator={osc && osc}
                        envelope={{decay: env, sustain: 0}} />
                </Track>
            </Song>
        </>
    )
}