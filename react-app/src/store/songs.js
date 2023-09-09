const GET_SONGS = "songs/GET_SONGS"
const GET_SONG = "songs/GET_SONG"
const SAVE_SONG = "songs/SAVE_SONG"
const EDIT_SONG = "songs/EDIT_SONG"
const DELETE_SONG = "songs/DELETE_SONG"

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

function saveEdit(song) {
    return {
        type: EDIT_SONG,
        song
    }
}

function dltSong(song) {
    return {
        type: DELETE_SONG,
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

export const editSong = (id, song) => async dispatch => {
    const res = await fetch(`/api/songs/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(song)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(saveEdit(data))
        return data
    }
}

export const deleteSong = (id) => async dispatch => {
    const res = await fetch(`/api/songs/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dltSong(data))
        return data
    }
}

const initState = {}
export default function songReducer(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_SONGS:
            let songState = {}
            action.songs.user_songs.forEach((song) => {
                songState[song.id] = song
            })
            return songState
        case GET_SONG:
            newState[action.song.id] = action.song
            return newState[action.song.id]
        case SAVE_SONG:
            newState[action.song.id] = action.song
            return newState
        case EDIT_SONG:
            newState[action.song.id] = action.song
            return newState
        case DELETE_SONG:
            delete newState[action.song.id]
            return newState
        default:
            return state
    }
}