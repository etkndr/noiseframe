const GET_TRACKS = "tracks/GET_TRACKS"

function loadTracks(tracks) {
    return {
        type: GET_TRACKS,
        tracks
    }
}

export const getTracks = (id) => async dispatch => {
    const res = await fetch(`/api/songs/${id}/tracks`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadTracks(data))
        return data
    }
}

const initState = {}

export default function tracks(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_TRACKS:
            action.tracks.tracks.forEach((track) => {
                newState[track.id] = track
            })
            return newState
        default:
            return state
    }
}