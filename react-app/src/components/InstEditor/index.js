import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Song, Track, Instrument } from "reactronica"
import * as instrumentActions from "../../store/instruments"
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
        dispatch(instrumentActions.getInstrument(id))
    }, [])
    
    // load settings from instrument
    const [title, setTitle] = useState("Loading")
    const sampleArr = [clap, synth, kick]
    const [sample, setSample] = useState("")
    const [sampleLoading, setSampleLoading] = useState(false)
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
        const saveEdit = dispatch(instrumentActions.editInstrument(id, newInst))
        console.log({"success": newInst})
    }

    const addSample = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("sample", sample)

        setSampleLoading(true)

        await dispatch(instrumentActions.newSample(id, formData))
        console.log(formData)
    }

    console.log(inst)

    return (
        <>
            {inst?.title}
            <div>
                sample: {sample.url}
            </div>
            <button onClick={() => setPlaying(!playing)}>play/pause</button>
                <Song bpm={120} isPlaying={playing}>
                    {/* {sampleArr.map((sample, idx) => {
                        return (
                            <div key={idx} onClick={() => handleFocus(idx)}>
                                sample {idx+1}
                                <Track steps={[{name: "C3", duration: 1}]} mute={idx !== currInst}>
                                    <Inst sample={sample} />
                                </Track>
                            </div>
                        )})} */}
                        <Track steps={["C3"]}>
                            <Inst sample={sample.url} />
                        </Track>
                </Song>
                <form onSubmit={save}>
                    <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                    <button type="submit">save instrument</button>
                </form>
                <form onSubmit={addSample} encType="multipart/form-data">
                    <input type="file" accept="audio/*" onChange={(e) => setSample(e.target.files[0])} placeholder="upload sample"/>
                    <button type="submit">upload</button>
                </form>
            </>
    )
}