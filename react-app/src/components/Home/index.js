import styles from "./Home.module.css"
import * as songActions from "../../store/songs"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default function Home() {
    const dispatch = useDispatch()
    const songs = useSelector(state => state.songs)

    useEffect(() => {
        dispatch(songActions.getSongs())
    }, [])

    console.log("SONGS", songs)
    return (
        <>
            Home
        </>
    )
}