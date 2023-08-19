import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as trackActions from "../../store/tracks"
import * as songActions from "../../store/songs"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const tracks = useSelector(state => state.tracks)
    const song = useSelector(state => state.songs)

    useEffect(() => {
        dispatch(trackActions.getTracks(id))
        dispatch(songActions.getSong(id))
    }, [])

    console.log(song)
    return (
        <>
            song editor
        </>
    )
}