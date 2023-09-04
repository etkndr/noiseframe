import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    // const tracks = useSelector(state => state.tracks)
    const currUser = useSelector(state => state.session.user)
    const song = useSelector(state => state.songs)
    const allInst = useSelector(state => state.instruments)
    const samples = useSelector(state => Object.values(state.samples))
    const [play, setPlay] = useState(false)
    const [currInst, setCurrInst] = useState("")
    
    useEffect(() => {
        dispatch(songActions.getSong(id))
        dispatch(getInstruments())
    }, [])

    useEffect(() => {
        dispatch(sampleActions.getSamples(currInst))
    }, [currInst])
    
    const [title, setTitle] = useState(song?.title)
    const [bpm, setBpm] = useState(song?.bpm)

    
    function saveSong(e) {
        e.preventDefault()
        const newSong = {title, bpm}
        const save = dispatch(songActions.editSong(id, newSong))
        console.log("success")
    }

    function dltSong(e) {
        e.preventDefault()
        const dlt = dispatch(songActions.deleteSong(id))
        console.log("success")
    }

    function saveSample(sample, stepArr) {
        const {id, name, url} = sample
        const save = dispatch(sampleActions.saveSample(id, {
            name,
            steps: stepArr,
            url
        }))
    }

    if (song?.user_id !== currUser?.id || !currUser) {
        return "Unauthorized"
    }
    return (
        <>
            <h2>{song?.title}</h2>
            <select onChange={(e) => setCurrInst(e.target.value)}>
                <option selected disabled>select an instrument</option>
                {Object.values(allInst)?.map((inst, idx) => {
                    return <option value={inst.id} key={idx}>{inst.title}</option>
                })}
            </select>
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
                                saveSample={saveSample} 
                                key={idx} 
                            />
                })}
            </Song>
        </>
    )
}