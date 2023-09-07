const GET_TRACKS = "tracks/GET_TRACKS"
const GET_TRACK = "tracks/GET_TRACK"
const SAVE_TRACK = "tracks/SAVE_TRACK"
const EDIT_TRACK = "tracks/EDIT_TRACK"
const DELETE_TRACK = "tracks/DELETE_TRACK"

function loadTracks(tracks) {
    return {
        type: GET_TRACKS,
        tracks
    }
}

function loadTrack(track) {
    return {
        type: GET_TRACK,
        track
    }
}

function newTrack(track) {
    return {
        type: SAVE_TRACK,
        track
    }
}

function saveEdit(track) {
    return {
        type: EDIT_TRACK,
        track
    }
}

function dltTrack(track) {
    return {
        type: DELETE_TRACK,
        track
    }
}

export const getTracks = (id) => async dispatch => {
    const res = await fetch(`/api/songs/${id}/tracks/`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadTracks(data))
        return data
    }
}

export const getTrack = (id) => async dispatch => {
    const res = await fetch(`/api/tracks/${id}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadTrack(data))
        return data
    }
}

export const saveTrack = (id, sampleId, track) => async dispatch => {
    const res = await fetch(`/api/songs/${id}/${sampleId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(track)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(newTrack(data))
        return data
    }
}

export const editTrack = (id, track) => async dispatch => {
    const res = await fetch(`/api/tracks/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(track)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(saveEdit(data))
        return data
    }
}

export const deleteTrack = (id) => async dispatch => {
    const res = await fetch(`/api/tracks/${id}`,{
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dltTrack(data))
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
        case GET_TRACK:
            newState[action.track.id] = action.track
            return newState
        case SAVE_TRACK:
            newState[action.track.id] = action.track
            return newState
        case EDIT_TRACK:
            newState[action.track.id] = action.track
        case DELETE_TRACK:
            delete newState[action.track.id]
            return newState
        default:
            return state
    }
}