const GET_SONGS = "songs/GET_SONGS"
const GET_SONG = "songs/GET_SONG"
const SAVE_SONG = "songs/SAVE_SONG"

function loadSongs(songs) {
    return {
        type: GET_SONGS,
        songs
    }
}

function loadSong(song) {
    return {
        type: GET_SONG,
        song
    }
}

function newSong(song) {
    return {
        type: SAVE_SONG,
        song
    }
}

export const getSongs = () => async dispatch => {
    const res = await fetch("/api/songs/", {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadSongs(data))
        return data
    }
}

export const getSong = (id) => async dispatch => {
    const res = await fetch(`/api/songs/${id}`)

    if (res.ok) {
        const data = await res.json()
        dispatch(loadSong(data))
        return data
    }
}

export const saveSong = (song) => async dispatch => {
    const res = await fetch("/api/songs/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(song)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(newSong(data))
        return data
    }
}

const initState = {}

export default function songReducer(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_SONGS:
            action.songs.user_songs.forEach((song) => {
                newState[song.id] = song
            })
            return newState
        case GET_SONG:
            newState[action.song.id] = action.song
            return newState
        case SAVE_SONG:
            newState[action.song.id] = action.song
            return newState
        default:
            return state
    }
}