const GET_SAMPLES = "instruments/GET_SAMPLES"
const NEW_SAMPLE = "instruments/NEW_SAMPLE"
const DELETE_SAMPLE = "instrument/DELETE_SAMPLE"

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

function dltSample(sample) {
    return {
        type: DELETE_SAMPLE,
        sample
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
    console.log(sample)
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

export const deleteSample = (id) => async dispatch => {
    const res = await fetch(`/api/samples/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dltSample(data))
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
        case DELETE_SAMPLE:
            delete newState[action.sample.id]
            return newState
        default:
            return state
    }
}