const GET_SONGS = "songs/GET_SONGS"

function loadSongs(songs) {
    return {
        type: GET_SONGS,
        songs
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

const initState = {}

export default function songReducer(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_SONGS:
            action.songs.user_songs.forEach((song) => {
                newState[song.id] = song
            })
            return newState
        default:
            return state
    }
}