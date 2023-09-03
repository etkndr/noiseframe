const GET_SAMPLES = "samples/GET_SAMPLES"
const NEW_SAMPLE = "samples/NEW_SAMPLE"
const SAVE_STEPS = "samples/SAVE_STEPS"
const DELETE_SAMPLE = "samples/DELETE_SAMPLE"

function loadSamples(samples) {
    return {
        type: GET_SAMPLES,
        samples
    }
}

function addSample(sample) {
    return {
        type: NEW_SAMPLE,
        sample
    }
}

function editSample(sample) {
    return {
        type: SAVE_STEPS,
        sample
    }
}

function dltSample(id) {
    return {
        type: DELETE_SAMPLE,
        id
    }
}

export const getSamples = (id) => async dispatch => {
    const res = await fetch(`/api/instruments/${id}/samples`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadSamples(data))
        return data
    }
}

export const newSample = (id, sample) => async dispatch => {
    const res = await fetch(`/api/instruments/${id}/samples`, {
        method: "POST",
        body: sample
    })


    if (res.ok) {
        const data = await res.json()
        dispatch(addSample(data))
        return data
    }
}

export const saveSample = (id, sample) => async dispatch => {
    const res = await fetch(`/api/samples/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(sample)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(editSample(data))
        return data
    }
}

export const deleteSample = (id) => async dispatch => {
    const res = await fetch(`/api/samples/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dltSample(id))
        return data
    }
}

const initState = {}

export default function samples(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_SAMPLES:
            action.samples.forEach((sample) => {
                newState[sample.id] = sample
            })
            return newState
        case NEW_SAMPLE:
            newState[action.sample.id] = action.sample
            return newState
        case SAVE_STEPS:
            newState[action.sample.id] = action.sample
            return newState
        case DELETE_SAMPLE:
            delete newState[action.id]
            const refresh = {...newState}
            return refresh
        default:
            return state
    }
}