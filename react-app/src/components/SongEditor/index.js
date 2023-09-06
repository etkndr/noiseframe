import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import * as trackActions from "../../store/tracks"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const currUser = useSelector(state => state.session.user)
    const song = useSelector(state => state.songs)
    const allInst = useSelector(state => state.instruments)
    const samples = useSelector(state => Object.values(state.samples))
    const [play, setPlay] = useState(false)
    
    const [currInst, setCurrInst] = useState("")
    const [title, setTitle] = useState(song?.title)
    const [bpm, setBpm] = useState(song?.bpm)

    useEffect(() => {
        dispatch(songActions.getSong(id))
    }, [dispatch])

    useEffect(() => {
        dispatch(getInstruments())
        
        if (song?.instrument_id) {
            setCurrInst(song?.instrument_id)
        }
    }, [song])
    
    useEffect(() => {
        dispatch(sampleActions.getSamples(currInst))
        dispatch(trackActions.getTracks(id))
    }, [currInst])
    
    function saveSong(e) {
        e.preventDefault()
        const newSong = {
            title,
            bpm,
            instrument_id: currInst
        }
        const save = dispatch(songActions.editSong(id, newSong))
        console.log("success")
    }

    function dltSong(e) {
        e.preventDefault()
        const dlt = dispatch(songActions.deleteSong(id))
        console.log("success")
    }

    function saveTrack(sample, stepArr) {
        const {id} = sample
        const save = dispatch(trackActions.editTrack(id, {
            sample_id: id,
            steps: stepArr,
            volume: 0.8
        }))
    }

    if (song?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }
    return (
        <>
            <h2>{song?.title}</h2>
            {currInst &&
            <h3>
                <NavLink to={`/instruments/${currInst}`}>
                    {allInst[currInst]?.title}
                </NavLink>
            </h3>
            }
            {currInst &&
            <button onClick={() => setPlay(!play)}>{!play && "play"}{play && "stop"}</button>
            }
            <form onSubmit={saveSong}>
                <select onChange={(e) => setCurrInst(e.target.value)} value={currInst}>
                    <option selected disabled>select an instrument</option>
                    {Object.values(allInst)?.map((inst, idx) => {
                        return <option value={inst.id} key={idx}>{inst.title}</option>
                    })}
                </select>
                <label for="title">song title</label>
                    <input onChange={(e) => setTitle(e.target.value)} placeholder={`${song?.title}`} name="title"/>
                <label for="bpm">bpm</label>
                    <input onChange={(e) => setBpm(e.target.value)} placeholder={`${song?.bpm}`} name="bpm"/>
                <button type="submit">save</button>
                <button onClick={dltSong}>delete</button>
            </form>
            <Song bpm={bpm*2 || 240} isPlaying={play}>
                {samples?.map((sample, idx) => {
                    return <Sequencer 
                                url={sample.url}
                                sample={sample} 
                                savedSteps={sample.steps} 
                                saveTrack={saveTrack} 
                                key={idx} 
                            />
                })}
            </Song>
        </>
    )
}