import { NavLink, useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import * as trackActions from "../../store/tracks"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"
import Loader from "../Loader"
import "./Song.css"

export default function SongEditor({loader}) {
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

    useEffect(() => {
        dispatch(getInstruments())
        dispatch(songActions.getSong(id))
        .then ((res) => {
            setTitle(res.title)
            setBpm(res.bpm)   
            setSelInst(res.instrument_id)
        })
    }, [])
    
    useEffect(() => {
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
        setPlay(false)
        setLoading(true)
        if (window.confirm("clear patterns and change instrument")) {
        setSelInst(instId)
        const newSong = {
            title,
            bpm,
            instrument_id: instId
        }
        const save = dispatch(songActions.editSong(id, newSong))
        .then(() => setLoading(false))
        }
    }

    if (song?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }

    // if (loading) {
    //     return <Loader/>
    // }

    // if (!loading) {
    return (
        <>

            <div className="home-left">
            <div>
                <input className="song-title title" 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="title" 
                    value={title}
                    onBlur={saveSong}/>
            </div>
            <div className="bpm">
                <input className="song-title bpm" 
                    onChange={(e) => setBpm(e.target.value)} 
                    placeholder="BPM" 
                    name="bpm" 
                    value={bpm}
                    onBlur={saveSong}/> bpm
            </div>
            <div className="inst-controls">
                {selInst &&
                    <div className="inst-to-song" onClick={() => setPlay(!play)}>{!play && <span className="material-symbols-outlined">play_circle</span>} {!play && "play"}
                    {play && <span className="material-symbols-outlined">stop_circle</span>} {play && "stop"}</div>
                }
                <div className="dlt-inst" onClick={dltSong}><span className="material-symbols-outlined">delete_forever</span> delete song</div>
            </div>
            <div>
                <Song bpm={bpm*2 || 240} isPlaying={play}>
                    {samples?.map((sample, idx) => {
                        const currTrack = tracks[idx]
                        return <Sequencer 
                        url={sample.url}
                        sample={sample}  
                        saveTrack={saveTrack}
                        track={currTrack}
                        play={play}
                                    loader={loader}
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
                    {insts?.map((inst, idx) => {
                        let select = ""
                        if (inst.id === selInst) {
                            select = "select"
                        }
                        return <li 
                        onClick={(e) => handleSelect(e, inst.id)} 
                        className={select}
                        key={idx}>{inst.title}</li>
                    })}
                </div>
            </div>
        </div>
        <button className="song-edit-btn" onClick={() => history.push(`/instruments/${selInst}`)}>edit instrument</button>
        </div>
        </>
    )
}
// }