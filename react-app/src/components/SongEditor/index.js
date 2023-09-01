import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as trackActions from "../../store/tracks"
import * as songActions from "../../store/songs"
import {getInstruments} from "../../store/instruments"
import {Instrument, Song, Track} from "reactronica"
import Tracks from "../Tracks"
import AudioKeys from "audiokeys"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const tracks = useSelector(state => state.tracks)
    const song = useSelector(state => state.songs)
    const insts = useSelector(state => state.instruments)
    const [note, setNote] = useState("") // send note to track
    const [press, setPress] = useState(0) // send keypress to track
    const [play, setPlay] = useState(false)
    
    useEffect(() => {
        dispatch(trackActions.getTracks(id))
        dispatch(songActions.getSong(id))
        dispatch(getInstruments())
    }, [])
    
    const [title, setTitle] = useState("")
    const [bpm, setBpm] = useState(120)
    
    function save(e) {
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

    const keys = new AudioKeys() // Create midi map from user keyboard

    // Set note on key press
    keys.down((note) => {
        setNote(note.note)
        setPress(1)
    })

    // Stop note from being added on key release 
    keys.up((note) => {
        setPress(0)
    })

    return (
        <>
            song editor
            <button onClick={() => setPlay(!play)}>start/stop</button>
            <form onSubmit={save}>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="title" value={title}/>
                <input onChange={(e) => setBpm(e.target.value)} placeholder="BPM"/>
                <button type="submit">save</button>
                <button onClick={dltSong}>delete</button>
            </form>
            <Song isPlaying={play} bpm={bpm}>
                <Tracks note={note} press={press} songId={id}/>
            </Song>
        </>
    )
}