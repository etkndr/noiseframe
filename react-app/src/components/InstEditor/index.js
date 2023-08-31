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
    const sampleArr = inst?.Samples
    const [sample, setSample] = useState("")
    const [sampleName, setSampleName] = useState("")
    const [pitch, setPitch] = useState("C3")
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

    const addSample = (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append("name", sampleName)
        formData.append("pitch", pitch)
        formData.append("sample", sample)
        setSampleLoading(true)
        console.log(formData)

        dispatch(instrumentActions.newSample(id, formData))
    }

    const dltSample = (e, id) => {
        e.preventDefault()
        dispatch(instrumentActions.deleteSample(id))
    }

    if (inst?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }

    return (
        <>
            {inst?.title}
            <div>
                samples: 
                {sampleArr?.map((file, idx) => {
                    return <li key={idx}>{file.name} <button onClick={(e) => dltSample(e, file.id)}>delete</button></li>
                })}
            </div>
            <button onClick={() => setPlaying(!playing)}>play/pause</button>
                <Song bpm={120} isPlaying={playing}>
                        <Track steps={["C3"]}>
                            <Inst sample={sampleArr[0]?.url} />
                        </Track>
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