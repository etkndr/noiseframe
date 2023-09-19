import { NavLink, useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import * as trackActions from "../../store/tracks"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"
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

    useEffect(() => {
        dispatch(songActions.getSong(id))
    }, [dispatch])
    
    useEffect(() => {
        dispatch(trackActions.getTracks(id))
        dispatch(getInstruments())
        const getTitle = song?.title
        const getBpm = song?.bpm
        const getInst = song?.instrument_id
        setTitle(getTitle)
        setBpm(getBpm)   
        setSelInst(getInst)
    }, [song])
    
    useEffect(() => {
        if (selInst) {
            dispatch(sampleActions.getSamples(selInst))
        }
    }, [selInst])
    
    function saveSong(e) {
        e.preventDefault()
        const newSong = {
            title,
            bpm,
            instrument_id: selInst
        }
        const save = dispatch(songActions.editSong(id, newSong))
        .then((res) => dispatch(songActions.getSong(id)))
        .then((res) => dispatch(trackActions.getTracks(id)))
        .then((res) => dispatch(sampleActions.getSamples(selInst)))
        .then((res) => {if (res.ok) console.log("success")})
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
        if (window.confirm("clear patterns and change instrument")) {
        setSelInst(instId)
        const newSong = {
            title,
            bpm,
            instrument_id: instId
        }
        const save = dispatch(songActions.editSong(id, newSong))
        .then(() => dispatch(songActions.getSong(id)))
        }
    }

    if (song?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }
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
                    value={bpm}/> bpm
            </div>
            <div className="song-btns">
                {selInst &&
                    <button className="play-song" onClick={() => setPlay(!play)}>{!play && "play"}{play && "stop"}</button>
                }
                <button onClick={saveSong}>save song</button>
                <button onClick={dltSong}>delete song</button>
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
                                    key={idx}
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