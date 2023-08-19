import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as trackActions from "../../store/tracks"

export default function SongEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const tracks = useSelector(state => state.tracks)

    useEffect(() => {
        dispatch(trackActions.getTracks(id))
    }, [])

    console.log(tracks)
    return (
        <>
            song editor
        </>
    )
}