import "./Home.css"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import NewInst from "../InstEditor/NewInst"
import OpenModalButton from "../OpenModalButton"
import Loader from "../Loader"
import EditDlt from "./EditDlt"

export default function Home() {
    const history = useHistory()
    const dispatch = useDispatch()
    const songRef = useRef(null)
    const instRef = useRef(null)
    const songs = useSelector(state => Object.values(state.songs))
    const insts = useSelector(state => Object.values(state.instruments))
    const currUser = useSelector(state => state.session.user)

    const [songLoading, setSongLoading] = useState(true)
    const [instLoading, setInstLoading] = useState(true)
    const [selSong, setSelSong] = useState("")
    const [selInst, setSelInst] = useState("")
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
  
    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    const closeMenu = () => setShowMenu(false);
  
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
          if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
          }
        };
  
      document.addEventListener("click", closeMenu);
  
      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    useEffect(() => {
        dispatch(songActions.getSongs())
        .then(() => setSongLoading(false))
        dispatch(instrumentActions.getInstruments())
        .then(() => setInstLoading(false))
    }, [dispatch])

    useEffect(() => {
        function handleClickOutside(event) {
        if (instRef.current && !instRef.current.contains(event.target)) {
            setSelInst(null)
        }
        if (songRef.current && !songRef.current.contains(event.target)) {
            setSelSong(null)
        }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [instRef, songRef]);

    const dltSong = (songId) => {
        if (window.confirm("delete instrument and all associated songs?")) {
            const dlt = dispatch(songActions.deleteSong(songId))
            .then(() => dispatch(songActions.getSongs()))
        }
    }

    function dltInst(instId) {
        if (window.confirm("delete instrument and all associated songs?")) {
            const dlt = dispatch(instrumentActions.deleteInstrument(instId))
            .then(() => dispatch(instrumentActions.getInstruments()))
            .then(() => dispatch(songActions.getSongs()))
        }
    }

    if (!currUser) history.push("/")
    
    return (
        <>
        <div className="home-left">
            <div className="lists">
                <div className="list-container">
                    <div className="list-title">
                            <h3>instruments</h3>
                    </div>
                    <div className="list" ref={instRef}>
                        {instLoading && <Loader/>}
                        {!insts?.length && !instLoading &&
                            <p>
                            you haven't created any instruments yet. click the "new instrument" button below to get started.
                            </p>
                        }
                        {!instLoading && insts?.map((inst, idx) => {
                            return <li 
                                onClick={() => setSelInst(inst.id)} 
                                key={idx}>{inst.title} 
                                <EditDlt type="inst" id={inst.id} dltInst={dltInst} instName={inst.title}/>
                            </li>
                        })}
                        <li className="edit-dlt new-inst">
                            <OpenModalButton
                                buttonText={<span className="material-symbols-outlined">add</span>}
                                onItemClick={closeMenu}
                                modalComponent={<NewInst close={closeMenu} />}
                            />
                        </li>
                    </div>

                                {/* <div className="list-btns">
                                <button className="tooltip" onClick={() => selInst > 0 && history.push(`/instruments/${selInst}`)} disabled={!selInst} ref={instRef}>
                                {!selInst && <span className="tooltext">select an instrument to edit</span>}
                                edit instrument
                                </button>
                                </div> */}

                </div>
                <div className="list-container">
                    <div className="list-title">
                        <h3>songs</h3>
                    </div>
                    <div className="list" ref={songRef}>
                        {songLoading && <Loader/>}
                        {!songLoading && !songs?.length && (insts?.length > 0) &&
                            <p>
                                you haven't created any songs yet. click the "new song" button on an instrument to make one.
                            </p>
                        }
                        {!songLoading && !songs?.length && !insts?.length &&
                            <p>
                                you haven't created any songs or instruments yet. click the "+" button to the left to make an instrument.
                            </p>
                        }
                        {!songLoading && songs?.map((song, idx) => {
                            return <li 
                                onClick={() => setSelSong(song.id)} 
                                key={idx}>
                                {song.title}
                                <EditDlt type="song" id={song.id} dltSong={dltSong} />
                            </li>
                        })}
                    </div>

                    {/* <div className="list-btns">
                        <button className="tooltip" onClick={() => selSong > 0 && history.push(`/songs/${selSong}`)} disabled={!selSong} ref={songRef}>
                            {!selSong && <span className="tooltext">select a song to edit</span>}
                            edit song
                        </button>
                        <button className="tooltip" onClick={() => history.push("/songs")} disabled={!insts.length}>
                            {!insts.length && <span className="tooltext">create an instrument first</span>}
                            new song
                        </button>
                    </div> */}

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