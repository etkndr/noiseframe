import { NavLink, useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useKeyPress from "../../hooks/useKeyPress"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import * as trackActions from "../../store/tracks"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"
import Loader from "../Loader"
import EditDlt from "../Home/EditDlt"
import "./Song.css"

export default function SongEditor() {
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    const currUser = useSelector(state => state.session.user)
    const song = useSelector(state => state.songs)
    const insts = useSelector(state => Object.values(state.instruments))
    const samples = useSelector(state => Object.values(state.samples))
    const tracks = useSelector(state => Object.values(state.tracks))
    const [play, setPlay] = useState(false)
    const [selInst, setSelInst] = useState(null)
    const [title, setTitle] = useState(null)
    const [bpm, setBpm] = useState(null)
    const [seed, setSeed] = useState(1)
    const [loading, setLoading] = useState(true)
    const [instLoading, setInstLoading] = useState(true)

    const playKey = useKeyPress("Enter")

    useEffect(() => {
        setPlay(playKey)
    })

    useEffect(() => {
        setLoading(true)
        dispatch(getInstruments())
        .then(() => setInstLoading(false))
        dispatch(songActions.getSong(id))
        .then ((res) => {
            setTitle(res.title)
            setBpm(res.bpm)   
            setSelInst(res.instrument_id)
        })
        .then(() => setLoading(false))
    }, [])
    
    useEffect(() => {
        setLoading(true)
        if (selInst) {
            dispatch(sampleActions.getSamples(selInst))
            .then(() => dispatch(trackActions.getTracks(id)))
            .then(() => setSeed(Math.random()))
            .then(() => setLoading(false))
        }
    }, [selInst])
    
    function saveSong(e) {
        e.preventDefault()
        setLoading(true)
        const newSong = {
            title,
            bpm,
            instrument_id: selInst
        }
        const save = dispatch(songActions.editSong(id, newSong))
        .then((res) => {
            setLoading(false)
            if (res.ok) console.log("success")
        })
    }

    function dltSong(e) {
        e.preventDefault()
        if (window.confirm("delete song and associated patterns?")) {
            const dlt = dispatch(songActions.deleteSong(id))
            .then((res) => {if (res.ok) console.log("success")})
            .then(() => history.push("/"))
        }
    }
    
    function saveTrack(track, stepArr) {
        const save = dispatch(trackActions.editTrack(track, {
            steps: stepArr,
            volume: -3
        }))
    }

    function handleSelect(e, instId) {
        e.preventDefault()
        if (selInst !== instId) {
            if (window.confirm("clear patterns and change instrument")) {
                setPlay(false)
                setLoading(true)
                const newSong = {
                    title,
                    bpm,
                    instrument_id: instId
                }
                const save = dispatch(songActions.editSong(id, newSong))
                .then(() => setSelInst(instId))
                .then(() => setLoading(false))
            }
        }
    }

    if (!loading && currUser && song && song?.user_id !== currUser?.id) {
        return "Unauthorized"
    }

    return (
        <>

            <div className="home-left">
            <div className="song-info">
                <div className="left-controls">
                        <div>
                            {title && 
                                <input className="song-title title" 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="title" 
                                value={title}
                                onBlur={saveSong}/>
                            }
                        </div>

                        <div className="bpm">
                            {bpm &&
                            <input className="song-title bpm" 
                            onChange={(e) => setBpm(e.target.value)} 
                            placeholder="BPM" 
                            name="bpm" 
                            value={bpm}
                            onBlur={saveSong}/> 
                        }
                        bpm
                        </div>
                    </div>

                    <div className="right-controls">
                        <b><u>keyboard shortcuts</u></b> 
                        <p><i>play/stop:</i> <span className="material-symbols-outlined">keyboard_return</span>enter</p>
                        <p><i>mute track:</i> <span style={{marginLeft: "5px"}}>1-8</span></p>
                    </div>
                </div>

                <div className="inst-controls">
                        {selInst &&
                            <div className="inst-to-song" onClick={() => setPlay(!play)}>{!play && <span className="material-symbols-outlined">play_circle</span>} {!play && "play"}
                            {play && <span className="material-symbols-outlined">stop_circle</span>} {play && "stop"}</div>
                        }
                        <div className="dlt-inst" onClick={dltSong}><span className="material-symbols-outlined">delete_forever</span> delete song</div>
                </div>

            <div>
                {loading && <Loader/>}
                <Song bpm={bpm*2 || 240} isPlaying={play}>
                    {!loading && !samples?.length && <p>no samples have been added to this instrument</p>}
                    {!loading && samples?.map((sample, idx) => {
                        const currTrack = tracks[idx]
                        return <Sequencer 
                            url={sample.url}
                            sample={sample}  
                            saveTrack={saveTrack}
                            track={currTrack}
                            play={play}
                            idx={idx+1}
                            key={`${idx}-${seed}`}
                        />
                    })}
                </Song>
            </div>
        </div>
        <div className="home-right"> 
        <div className="lists editor">
           <div className="list-container editor">
                <div className="list-title">
                        <h3>change instrument</h3>
                </div>
                <div className="list">
                    {instLoading && <Loader/>}
                    {!instLoading && insts?.map((inst, idx) => {
                        let select = ""
                        if (inst.id === selInst) {
                            select = "select"
                        }
                        return <li key={idx}>
                            <span className={select} onClick={(e) => handleSelect(e, inst.id)}>{inst.title}</span>
                            <EditDlt type="song-edit" id={inst.id} instName={inst.title}/></li>
                    })}
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
