import {
    GET_SECTIONS,
    CREATE_SECTION,
    EDIT_SECTION,
    DELETE_SECTION,
    CLEAR_SECTIONS,
    SECTIONS_ERROR
} from "../actions/types";

const initialState = {
    sections: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case GET_SECTIONS:
            return {
                ...state,
                sections: payload,
                loading: false
            };
        case CREATE_SECTION:
            return {
                ...state,
                sections: [payload, ...state.sections],
                loading: false
            };
        case EDIT_SECTION:
            const updated_sections = [];
            state.sections.forEach(section => {
                if (section._id === payload._id) {
                    updated_sections.push(payload);
                } else {
                    updated_sections.push(section);
                }
            });
            return {
                ...state,
                sections: updated_sections,
                loading: false
            };
        case DELETE_SECTION:
            return {
                ...state,
                sections: state.sections.filter(
                    section => !payload.includes(section._id)
                ),
                loading: false
            };
        case CLEAR_SECTIONS:
            return {
                ...state,
                sections: [],
                loading: false
            };
        case SECTIONS_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}
