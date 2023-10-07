import "./Home.css"
import * as songActions from "../../store/songs"
import * as instrumentActions from "../../store/instruments"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import NewInst from "../InstEditor/NewInst"
import OpenModalButton from "../OpenModalButton"
import Loader from "../Loader"

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

    if (!currUser) history.push("/")
    
    return (
        <>
        <div className="home-left">
            <div className="lists">
            <div className="list-container">
                    <div className="list-title">
                            <h3>all instruments</h3>
                    </div>
                    <div className="list" ref={instRef}>
                        {instLoading && <Loader/>}
                            {!insts?.length && !instLoading &&
                                <p>
                                you haven't created any instruments yet. click the "new instrument" button below to get started.
                                </p>
                            }
                            {!instLoading && insts?.map((inst, idx) => {
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
                            <button className="tooltip" onClick={() => selInst > 0 && history.push(`/instruments/${selInst}`)} disabled={!selInst} ref={instRef}>
                            {!selInst && <span className="tooltext">select an instrument to edit</span>}
                            edit instrument
                            </button>
                            {/* <button onClick={() => history.push("/instruments")}>new instrument</button> */}
                            <OpenModalButton
                            buttonText="new instrument"
                            onItemClick={closeMenu}
                            modalComponent={<NewInst close={closeMenu} />}
                            />
                            </div>
                            </div>
                <div className="list-container">
                    <div className="list-title">
                        <h3>all songs</h3>
                    </div>
                    <div className="list" ref={songRef}>
                        {songLoading && <Loader/>}
                        {!songLoading && !songs?.length && (insts?.length > 0) &&
                            <p>
                                you haven't created any songs yet. click the "new song" button below to get started.
                            </p>
                        }
                        {!songLoading && !songs?.length && !insts?.length &&
                            <p>
                                you haven't created any songs or instruments yet. first, create an instrument by clicking the "new instrument" button below, then come back and create a song.
                            </p>
                        }
                        {!songLoading && songs?.map((song, idx) => {
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
                        <button className="tooltip" onClick={() => selSong > 0 && history.push(`/songs/${selSong}`)} disabled={!selSong} ref={songRef}>
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