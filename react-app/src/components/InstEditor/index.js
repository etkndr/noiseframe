import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getInstrument } from "../../store/instruments"
import { Song, Track, Instrument } from "reactronica"
import { editInstrument } from "../../store/instruments"
import clap from "../../assets/samples/clap.wav"
import synth from "../../assets/samples/synth.wav"
import kick from "../../assets/samples/kick.wav"
import Inst from "./Inst"


export default function InstEditor() {
    const dispatch = useDispatch()
    const currUser = useSelector(state => state.session.user)
    const {id} = useParams()
    const inst = useSelector(state => state.instruments[id])
    const [playing, setPlaying] = useState(false)
    
    useEffect(() => {
        dispatch(getInstrument(id))
    }, [])
    
    // load settings from instrument
    const [title, setTitle] = useState("Loading")
    const sampleArr = [clap, synth, kick]
    const [samples, setSamples] = useState(sampleArr[0])
    const [currInst, setCurrInst] = useState("")
    
    useEffect(() => {
        const getTitle = inst?.title
        setTitle(getTitle)
    }, [inst])

    const handleFocus = (i) => {
        setCurrInst(i)
    }

    const save = (e) => {
        e.preventDefault()
        const newInst = {
            title,
            type: "sampler",
            sample: sampleArr.join(" "),
            osc: "",
            env: 1
        }
        const saveEdit = dispatch(editInstrument(id, newInst))
        console.log({"success": newInst})
    }

    return (
        <>
            {inst?.title}
            {samples}
            <button onClick={() => setPlaying(!playing)}>Test</button>
                <Song bpm={120} isPlaying={playing}>
                    {sampleArr.map((sample, idx) => {
                        return (
                            <div key={idx} onClick={() => handleFocus(idx)}>
                                Track {idx}
                                <Track steps={[{name: "C3", duration: 1}]} mute={idx !== currInst}>
                                    <Inst sample={sample} />
                                </Track>
                            </div>
                        )})}
                </Song>
                <form onSubmit={save}>
                    <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                    <button type="submit">save instrument</button>
                </form>
            </>
    )
}