import { NavLink, useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Song, Track, Instrument } from "reactronica"
import * as instrumentActions from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import { saveSong } from "../../store/songs"
import Inst from "./Inst"
import "./Instrument.css"


export default function InstEditor({loader}) {
    const dispatch = useDispatch()
    const history = useHistory()
    const resetFile = useRef(null)
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
    const [formVals, setFormVals] = useState({})
    const [seed, setSeed] = useState(1)
    
    useEffect(() => {
        dispatch(instrumentActions.getInstrument(id))
        dispatch(sampleActions.getSamples(id))
        .then((res) => {
            const names = {}
            Object.values(res).forEach((sample, idx) => {
                names[idx] = sample.name
            })
            setFormVals({...names})
        })
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

    function dltInst() {
        if (window.confirm("delete instrument and all associated songs?")) {
            const dlt = dispatch(instrumentActions.deleteInstrument(id))
            .then(() => history.push("/home"))
        }
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

        if (sample && sampleName) {
            setSampleLoading(true)
        }

        dispatch(sampleActions.newSample(id, formData))
        .then(() => {setSampleLoading(false)})
        .then(() => {
            setSample("")
            setSampleName("")

            if (resetFile.current) {
                resetFile.current.value = "";
                resetFile.current.type = "text";
                resetFile.current.type = "file";
            }
        })
        .then(() => dispatch(sampleActions.getSamples(id)))
        .then((res) => {
            const names = {}
            Object.values(res).forEach((sample, idx) => {
                names[idx] = sample.name
            })
            setFormVals({...names})
        })
    }

    const nameChange = (sampleName, sampleId) => {
        const newName = {
            name: sampleName
        }
        const save = dispatch(sampleActions.editSample(sampleId, newName))
        .then((res) => console.log(res))
    }

    const dltSample = (e, id) => {
        e.preventDefault()
        dispatch(sampleActions.deleteSample(id))
        .then(() => dispatch(sampleActions.getSamples(inst?.id)))
        .then((res) => {
            const names = {}
            Object.values(res).forEach((sample, idx) => {
                names[idx] = sample.name
            })
            setFormVals({...names})
        })
        .then(() => setSeed(Math.random()))
    }

    const songFromInst = () => {
        const newSong = {
            instrument_id: id,
            title: `song from ${title}`,
            bpm: 120
        }

        const save = dispatch(saveSong(newSong))
        .then((res) => history.push(`/songs/${res.id}`))
    }

    const handleOnChange = (e, idx) => {
        e.preventDefault()

        setFormVals((prev) => ({
            ...prev,
            [idx]: e.target.value
        }))
    }
    
    if (inst?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }

    return (
        <>
        <div className="home-left">
            <div className="title-container">
                <input className="inst-title" 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="title" 
                    value={title}
                    onBlur={save}/>
            </div>
            <div className="inst-controls">
                <div className="inst-to-song" onClick={songFromInst}><span className="material-symbols-outlined">add_circle</span> create song</div>
                <div className="dlt-inst" onClick={dltInst}><span className="material-symbols-outlined">delete_forever</span> delete instrument</div>
            </div>
            <div className="sample-form">
            <div className="form-title">upload a sound</div>
            <form className="form-inputs" onSubmit={addSample} encType="multipart/form-data">
                <input className="sample-input" type="text" onChange={(e) => setSampleName(e.target.value)} placeholder="sample name" value={sampleName}/>
                <input className="sample-input" ref={resetFile} type="file" accept="audio/*" onChange={(e) => {
                    if (e.target.files[0].size > 204800) {
                        setErr((prev) => ({
                            ...prev,
                            3: "maximum file size of 180 kB"
                        }))
                    } else {
                        setErr((prev) => ({
                            ...prev,
                            3: ""
                        }))
                    }
                    setSample(e.target.files[0])
                    }} placeholder="sample file"/>
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
                <p>
                    {err[3] && err[3]}
                </p>
                </div>
            </div>
            </div>
            <div className="inst-samples">
                {samples?.map((sample, idx) => {
                    return (
                        <li className="sample-detail" key={idx}>
                            <input 
                                className="sample-name"
                                value={formVals[idx]}
                                onChange={(e) => handleOnChange(e, idx)}
                                onBlur={(e) => nameChange(e.target.value, sample.id)}
                                />
                            <span className="listen" onClick={() => {
                                if (playing && currSample === idx) {
                                    setPlaying(false)
                                } else {
                                    handleFocus(idx)
                                }
                                }}>
                                {playing && currSample === idx && <span className="play-stop"><span className="material-symbols-outlined">stop_circle</span></span>}
                                {!playing && <span className="play-stop"><span className="material-symbols-outlined">play_circle</span></span>}
                                {playing && currSample !== idx && <span className="play-stop"><span className="material-symbols-outlined">play_circle</span></span>}
                            <span className="dlt-sample" onClick={(e) => dltSample(e, sample.id)}><span className="material-symbols-outlined">delete_forever</span></span>
                            </span>
                        </li>
                    )
                })}
                {sampleLoading && "uploading..."}
            </div>
            <Song isPlaying={playing} bpm={120}>
                {samples?.map((sample, idx) => {
                    return (
                        <Track steps={["C3"]} mute={currSample !== idx} volume={0.7} key={seed*idx}>
                            <Inst sample={sample.url} key={`inst-${seed*idx}`}/>
                        </Track>
                    )
                })}
            </Song>
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