import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Song, Track, Instrument } from "reactronica"
import * as instrumentActions from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import Inst from "./Inst"


export default function InstEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const currUser = useSelector(state => state.session.user)
    const inst = useSelector(state => state.instruments[id])
    const samples = useSelector(state => Object.values(state.samples))
    const [playing, setPlaying] = useState(false)

    // load settings from instrument
    const [title, setTitle] = useState("Loading...")
    const [sample, setSample] = useState("")
    const [sampleName, setSampleName] = useState("")
    const [pitch, setPitch] = useState("C3")
    const [sampleLoading, setSampleLoading] = useState(false)
    const [currSample, setCurrSample] = useState("")
    
    useEffect(() => {
        dispatch(instrumentActions.getInstrument(id))
        dispatch(sampleActions.getSamples(id))
        .then(() => setSampleLoading(false))
    }, [])
    
    useEffect(() => {
        const getTitle = inst?.title
        setTitle(getTitle)
    }, [inst])

    const handleFocus = (i) => {
        setPlaying(true)
        setCurrSample(i)
    }
    
    const save = (e) => {
        e.preventDefault()
        const newInst = {
            title,
            type: "sampler",
            sample: [],
            osc: "",
            env: 1
        }
        const saveEdit = dispatch(instrumentActions.editInstrument(id, newInst))
        console.log({"success": newInst})
    }

    const addSample = (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append("name", sampleName)
        formData.append("pitch", pitch)
        formData.append("sample", sample)
        setSampleLoading(true)

        dispatch(sampleActions.newSample(id, formData))
    }

    const dltSample = (e, id) => {
        e.preventDefault()
        dispatch(sampleActions.deleteSample(id))
    }

    if (inst?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }

    return (
        <>
            {inst?.title}
            <div>
                samples:
                {sampleLoading && "loading..."}
                {samples?.map((sample, idx) => {
                    return (
                    <li key={idx}>{sample.name}
                    <button onClick={() => handleFocus(idx)}>play</button>
                    <button onClick={(e) => dltSample(e, sample.id)}>delete</button>
                    </li>
                    )
                })}
            </div>
            <button onClick={() => setPlaying(false)}>stop audio</button>
            <Song isPlaying={playing} bpm={120}>
                {samples?.map((sample, idx) => {
                    return (
                        <Track steps={[sample.pitch]} mute={currSample !== idx} volume={0.7}>
                            <Inst sample={sample.url}/>
                        </Track>
                    )
                })}
            </Song>
            <form onSubmit={save}>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                <button type="submit">save instrument</button>
            </form>
            <form onSubmit={addSample} encType="multipart/form-data">
                <input type="text" onChange={(e) => setSampleName(e.target.value)} placeholder="sample name" value={sampleName}/>
                <input type="text" onChange={(e) => setPitch(e.target.value)} placeholder="base pitch" value={pitch}/>
                <input type="file" accept="audio/*" onChange={(e) => setSample(e.target.files[0])} placeholder="sample file"/>
                <button type="submit">upload</button>
            </form>
            </>
    )
}