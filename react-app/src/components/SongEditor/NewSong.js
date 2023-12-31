import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useEffect, useState } from "react"
import "./Song.css"

export default function NewSong() {
    const history = useHistory()
    const dispatch = useDispatch()
    const insts = useSelector(state => Object.values(state.instruments))
    const [title, setTitle] = useState("")
    const [bpm, setBpm] = useState("")
    const [selInst, setSelInst] = useState("")
    const [err, setErr] = useState({})
    
    useEffect(() =>{
        dispatch(instrumentActions.getInstruments())
    }, [dispatch])

    useEffect(() => {
        if (title) {
            setErr((prev) => ({
                ...prev,
                1: null
            }))
        } 
        if (bpm) {
            setErr((prev) => ({
                ...prev,
                2: null
            }))
        } 
        if (selInst) {
            setErr((prev) => ({
                ...prev,
                2: null
            }))
        }
    }, [bpm, title, selInst])
    
    const save = (e) => {
        e.preventDefault()

        if (!title) {
            setErr((prev) => ({
                ...prev,
                1: "please enter a name for your song"
            }))
        } 
        if (!bpm) {
            setErr((prev) => ({
                ...prev,
                2: "please select bpm for your song"
            }))
        }
        if (!selInst) {
            setErr((prev) => ({
                ...prev,
                3: "please select an instrument for your song"
            }))
        }
        if (bpm && title && selInst) {
            setErr({})

        const newSong = {
            instrument_id: selInst,
            title,
            bpm
        }
        const save = dispatch(songActions.saveSong(newSong))
        .then((res) => history.push(`/songs/${res.id}`))
    }
    }

    return (
        <>
        <div className="song-form">
            <input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="song title"/>
            <input onChange={(e) => setBpm(e.target.value)} value={bpm} placeholder="bpm"/>
                <div className="lists new-song">
            <div className="list-container new-song">
                <div className="list-title">
                        <h3>all instruments</h3>
                </div>
                <div className="list">
                    {insts?.map((inst, idx) => {
                        let select = ""
                        if (inst.id === selInst) {
                            select = "select"
                        }
                        return <li 
                            onClick={() => setSelInst(inst.id)} 
                            className={select}
                            key={idx}>{inst.title}</li>
                    })}
                </div>
            </div>
            </div>
            <div className="err new-song">
                {Object.values(err).map((error, idx) => {
                    return <p key={idx}>{error}</p>
                })}
            </div>
            <div>
                <button onClick={save}>create song</button>
            </div>
        </div>
        </>
    )
}