import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Song, Track, Instrument } from "reactronica"
import * as instrumentActions from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import Inst from "./Inst"
import "./Instrument.css"


export default function InstEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const currUser = useSelector(state => state.session.user)
    const inst = useSelector(state => state.instruments[id])
    const samples = useSelector(state => Object.values(state.samples))

    const [playing, setPlaying] = useState(false)
    const [title, setTitle] = useState("loading...")
    const [sample, setSample] = useState("")
    const [sampleName, setSampleName] = useState("")
    const [sampleLoading, setSampleLoading] = useState(false)
    const [currSample, setCurrSample] = useState("")
    const [err, setErr] = useState({})
    
    useEffect(() => {
        dispatch(instrumentActions.getInstrument(id))
        dispatch(sampleActions.getSamples(id))
    }, [dispatch])
    
    useEffect(() => {
        const getTitle = inst?.title
        setTitle(getTitle)
    }, [inst])

    useEffect(() => {
        if (sampleName) {
            setErr((prev) => ({
                ...prev,
                1: null
            }))
        } 
        if (sample) {
            setErr((prev) => ({
                ...prev,
                2: null
            }))
        } 
    }, [sample, sampleName])

    const handleFocus = (i) => {
        setPlaying(true)
        setCurrSample(i)
    }
    
    const save = (e) => {
        e.preventDefault()
        const newInst = {
            title,
            type: "sampler",
            osc: "",
            env: 1
        }
        const saveEdit = dispatch(instrumentActions.editInstrument(id, newInst))
        .then(() => setSampleName(""))
        console.log({"success": newInst})
    }

    const addSample = (e) => {
        e.preventDefault()

        if (!sampleName) {
            setErr((prev) => ({
                ...prev,
                1: "please enter a name for your sound"
            }))
        } 
        if (!sample) {
            setErr((prev) => ({
                ...prev,
                2: "please select a file to upload"
            }))
        }
        if (sample && sampleName) {
            setErr({})
        }

        let formData = new FormData()
        formData.append("name", sampleName)
        formData.append("sample", sample)
        setSampleLoading(true)

        dispatch(sampleActions.newSample(id, formData))
        .then(() => setSampleLoading(false))
        .then(() => {
            setSample("")
            setSampleName("")
        })
    }

    const dltSample = (e, id) => {
        e.preventDefault()
        dispatch(sampleActions.deleteSample(id))
        .then(() => dispatch(sampleActions.getSamples(inst?.id)))
    }

    if (inst?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }

    return (
        <>
        <div className="home-left">
            <input className="inst-title" 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="title" 
                value={title}
                onBlur={save}/>
            <div className="inst-samples">
                {samples?.map((sample, idx) => {
                    return (
                        <li key={idx}>{sample.name}
                    <button onClick={() => {
                        if (playing && currSample === idx) {
                            setPlaying(false)
                        } else {
                            handleFocus(idx)
                        }
                        }}>
                            {playing && currSample === idx && "stop"}
                            {!playing && "play"}
                            {playing && currSample !== idx && "play"}
                    </button>
                    {/* <button onClick={() => setPlaying(false)}>stop</button> */}
                    <button onClick={(e) => dltSample(e, sample.id)}>delete</button>
                    </li>
                    )
                })}
                {sampleLoading && "uploading..."}
            </div>
            <Song isPlaying={playing} bpm={120}>
                {samples?.map((sample, idx) => {
                    return (
                        <Track steps={["C3"]} mute={currSample !== idx} volume={0.7}>
                            <Inst sample={sample.url}/>
                        </Track>
                    )
                })}
            </Song>
            <form className="sample-form" onSubmit={addSample} encType="multipart/form-data">
                <input className="sample-input" type="text" onChange={(e) => setSampleName(e.target.value)} placeholder="sample name" value={sampleName}/>
                <input className="sample-input" type="file" accept="audio/*" onChange={(e) => setSample(e.target.files[0])} placeholder="sample file"/>
                <button type="submit">upload</button>
            </form>
            <div className="err-container">
                <div className="err">
                <p>
                    {err[1] && err[1]}
                </p>
                </div>
                <div className="err">
                <p>
                    {err[2] && err[2]}
                </p>
                </div>
            </div>
            </div>
            <div className="home-right">
                <h3>instructions</h3>
                <p>
                    to load sounds into your instrument, enter a sample name 
                    (the name can be anything you'd like, it's only used to help you identify the sound after uploading).
                    next, select a sound file from your computer and press "upload". allowed file types are *.wav, *.mp3, and *.aif, 
                    and short sounds such as percussion work best. each sound is automatically saved to the instrument upon upload.
                </p>
                <p>
                    good sources for sound files include <a href="http://freesound.org">freesound.org</a> and <a href="http://tidalcycles.org">tidal's</a> <a href="https://github.com/tidalcycles/Dirt-Samples">dirt-samples</a> pack.
                </p>
            </div>
            </>
    )
}