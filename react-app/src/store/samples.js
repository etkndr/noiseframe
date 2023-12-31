const GET_SAMPLES = "samples/GET_SAMPLES"
const NEW_SAMPLE = "samples/NEW_SAMPLE"
const EDIT_SAMPLE = "samples/EDIT_SAMPLE"
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

function saveEdit(sample) {
    return {
        type: EDIT_SAMPLE,
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

export const editSample = (id, name) => async dispatch => {
    const res = await fetch(`/api/samples/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(name)
    })
    console.log(name)

    if (res.ok) {
        const data = await res.json()
        dispatch(saveEdit(data))
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
            const sampleState = {}
            action.samples.forEach((sample) => {
                sampleState[sample.id] = sample
            })
            return sampleState
        case NEW_SAMPLE:
            newState[action.sample.id] = action.sample
            return newState
        case EDIT_SAMPLE:
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