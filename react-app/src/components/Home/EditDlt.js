import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch } from "react-redux"
import {saveSong} from "../../store/songs"

export default function EditDlt({type, id, instName, songName, dltInst, dltSong}) {
    const history = useHistory()
    const dispatch = useDispatch()

    function dltType() {
        if (type === "song") {
            dltSong(id)
        } if (type === "instrument") {
            dltInst(id)
        }
    }

    function editType() {
        if (type === "song") {
            history.push(`/songs/${id}`)
        } else {
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
            {type === "instrument" && <button className="tooltip" onClick={newSong}>
                <span className="tooltext">new song from {instName}</span>
                <span className="material-symbols-outlined">add_circle</span>
            </button>}
            {type !== "song" && 
            <button className="tooltip" onClick={editType}>
                <span className="tooltext">edit {instName}</span>
                <span className="material-symbols-outlined">edit</span>
            </button>}

            <button className="tooltip" onClick={dltType}>
                {type === "instrument" && <span className="tooltext">delete {instName}</span>}
                {type === "song" && <span className="tooltext">delete {songName}</span>}
                {type !== "song-edit" && <span className="material-symbols-outlined">delete_forever</span>}
            </button>
        </div>
        </>
    )
}