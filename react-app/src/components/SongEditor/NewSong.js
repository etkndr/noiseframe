import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import { getInstruments } from "../../store/instruments"
import * as sampleActions from "../../store/samples"
import {Song} from "reactronica"
import Sequencer from "../Sequencer"

export default function NewSong() {
    const dispatch = useDispatch()
    // const tracks = useSelector(state => state.tracks)
    const currUser = useSelector(state => state.session.user)
    const allInst = useSelector(state => state.instruments)
    const samples = useSelector(state => Object.values(state.samples))
    const [play, setPlay] = useState(false)
    const [currInst, setCurrInst] = useState("")
    
    useEffect(() => {
        dispatch(getInstruments())
    }, [])

    useEffect(() => {
        dispatch(sampleActions.getSamples(currInst))
    }, [currInst])
    
    const [title, setTitle] = useState("")
    const [bpm, setBpm] = useState("")

    
    function saveSong(e) {
        e.preventDefault()
        const newSong = {title, bpm}
        const save = dispatch(songActions.saveSong(newSong))
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

    return (
        <>
            <h2>New song</h2>
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
                    <input onChange={(e) => setTitle(e.target.value)} placeholder={`title`} name="title"/>
                <label for="bpm">bpm</label>
                    <input onChange={(e) => setBpm(e.target.value)} placeholder={`bpm (default 120)`} name="bpm"/>
                <button type="submit">save</button>
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