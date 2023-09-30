import "./Home.css"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import classnames from "classnames"

export default function Home({loader}) {
    const history = useHistory()
    const dispatch = useDispatch()
    const songs = useSelector(state => Object.values(state.songs))
    const insts = useSelector(state => Object.values(state.instruments))
    const currUser = useSelector(state => state.session.user)

    const [selSong, setSelSong] = useState("")
    const [selInst, setSelInst] = useState("")

    useEffect(() => {
        dispatch(songActions.getSongs())
        dispatch(instrumentActions.getInstruments())
    }, [dispatch])

    if (!currUser) history.push("/")
    
    return (
        <>
        <div className="home-left">
            <div className="lists">
            <div className="list-container">
                    <div className="list-title">
                            <h3>all instruments</h3>
                    </div>
                    <div className="list">
                        {!insts?.length &&
                            <p>
                                you haven't created any instruments yet. click the "new instrument" button below to get started.
                            </p>
                        }
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
                    <div className="list-btns">
                        <button className="tooltip" onClick={() => selInst > 0 && history.push(`/instruments/${selInst}`)} disabled={!selInst}>
                            {!selInst && <span className="tooltext">select an instrument to edit</span>}
                            edit instrument
                        </button>
                        <button onClick={() => history.push("/instruments")}>new instrument</button>
                    </div>
                    </div>
                <div className="list-container">
                    <div className="list-title">
                        <h3>all songs</h3>
                    </div>
                    <div className="list">
                        {!songs?.length && (insts?.length > 0) &&
                            <p>
                                you haven't created any songs yet. click the "new song" button below to get started.
                            </p>
                        }
                        {!songs?.length && !insts?.length &&
                            <p>
                                you haven't created any songs or instruments yet. first, create an instrument by clicking the "new instrument" button below, then come back and create a song.
                            </p>
                        }
                        {songs?.map((song, idx) => {
                            let select = ""
                            if (song.id === selSong) {
                                select = "select"
                            }
                            return <li 
                            onClick={() => setSelSong(song.id)} 
                            className={select}
                            key={idx}>
                            {song.title}</li>
                        })}
                    </div>
                    <div className="list-btns">
                        <button className="tooltip" onClick={() => selSong > 0 && history.push(`/songs/${selSong}`)} disabled={!selSong}>
                            {!selSong && <span className="tooltext">select a song to edit</span>}
                            edit song
                        </button>
                        <button className="tooltip" onClick={() => history.push("/songs")} disabled={!insts.length}>
                            {!insts.length && <span className="tooltext">create an instrument first</span>}
                            new song
                        </button>
                    </div>
                </div>
                </div>
            </div>
            <div className="home-right">
                <h3>instructions</h3>
                <p>
                    to get started, you will first need an instrument. 
                    each instrument can hold multiple sound files, which can be uploaded from your computer.
                    after creating an instrument, you can begin adding songs. songs hold one instrument at a time, 
                    and are used to create patterns which trigger playback of the sound files in the instrument.
                    and that's all there is to it. have fun!
                </p>
            </div>
        </>
    )
}