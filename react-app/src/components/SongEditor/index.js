import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as trackActions from "../../store/tracks"
import * as songActions from "../../store/songs"
import {getInstruments} from "../../store/instruments"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const tracks = useSelector(state => state.tracks)
    const song = useSelector(state => state.songs)
    const insts = useSelector(state => state.instruments)

    useEffect(() => {
        dispatch(trackActions.getTracks(id))
        dispatch(songActions.getSong(id))
        dispatch(getInstruments())
    }, [])

    console.log(insts)

    return (
        <>
            song editor
        </>
    )
}