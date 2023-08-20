import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {getInstrument} from "../../store/instruments"


export default function InstEditor() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const inst = useSelector(state => state.instruments)

    useEffect(() => {
        dispatch(getInstrument(id))
    }, [])

    return (
        <>
            Instrument editor
        </>
    )
}