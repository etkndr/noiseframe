import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useEffect, useState } from "react"

export default function NewSong() {
    const history = useHistory()
    const dispatch = useDispatch()
    const insts = useSelector(state => Object.values(state.instruments))
    const [title, setTitle] = useState("")
    const [bpm, setBpm] = useState("")
    const [currInst, setCurrInst] = useState("")
    
    useEffect(() =>{
        dispatch(instrumentActions.getInstruments())
    }, [dispatch])
    
    const save = (e) => {
        e.preventDefault()
        const newSong = {
            instrument_id: currInst,
            title,
            bpm
        }
        const save = dispatch(songActions.saveSong(newSong))
        .then((res) => history.push(`/songs/${res.id}`))
    }

    return (
        <>
            <input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="song title"/>
            <input onChange={(e) => setBpm(e.target.value)} value={bpm} placeholder="bpm"/>
            <select onChange={(e) => setCurrInst(e.target.value)}>
                <option selected disabled>select an instrument</option>
                {insts?.map((instrument, idx) => {
                    return <option value={instrument.id} key={idx}>{instrument.title}</option>
                })}
            </select>
            <button onClick={save}>create song</button>
        </>
    )
}