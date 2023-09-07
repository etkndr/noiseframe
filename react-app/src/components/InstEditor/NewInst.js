import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as instrumentActions from "../../store/instruments"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"


export default function NewInst() {
    const history = useHistory()
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    
    
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
    }

    return (
        <>
            <input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="instrument title"/>
            <button onClick={save}>create instrument</button>
        </>
    )
}