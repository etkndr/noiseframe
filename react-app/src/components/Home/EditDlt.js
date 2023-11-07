import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch } from "react-redux"
import {saveSong} from "../../store/songs"

export default function EditDlt({type, id, instName, dltInst, dltSong}) {
    const history = useHistory()
    const dispatch = useDispatch()

    function dltType() {
        if (type === "song") {
            dltSong(id)
        } if (type === "inst") {
            dltInst(id)
        }
    }

    function editType() {
        if (type === "song") {
            history.push(`/songs/${id}`)
        } if (type === "inst") {
            history.push(`/instruments/${id}`)
        }
    }

    function newSong() {
        const newSong = {
            instrument_id: id,
            title: `Song from ${instName}`,
            bpm: 120
        }
        const save = dispatch(saveSong(newSong))
        .then((res) => history.push(`/songs/${res.id}`))
    }
    return (
        <>
        <div className="edit-dlt">
            {type === "inst" && <button className="tooltip" onClick={newSong}>
                <span className="tooltext">new song from instrument</span>
                <span className="material-symbols-outlined">add</span>
            </button>}

            <button onClick={editType}><span className="material-symbols-outlined">edit</span></button>
            <button onClick={dltType}><span className="material-symbols-outlined">delete_forever</span></button>
        </div>
        </>
    )
}