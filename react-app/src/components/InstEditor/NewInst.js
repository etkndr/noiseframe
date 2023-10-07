import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as instrumentActions from "../../store/instruments"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useModal } from "../../context/Modal"
import "./Instrument.css"


export default function NewInst() {
    const history = useHistory()
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    const { closeModal } = useModal()
    
    
    const save = (e) => {
        e.preventDefault()
        const newInst = {
            title,
            type: "sampler",
            osc: "",
            env: 1
        }
        const save = dispatch(instrumentActions.saveInstrument(newInst))
        .then((res) => history.push(`/instruments/${res.id}`))
        .then(() => closeModal())
    }

    return (
        <>
        <div className="inst-form">
            <h3>new instrument</h3>
            <input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="instrument title"/>
            <button onClick={save}>create instrument</button>
        </div>
        </>
    )
}