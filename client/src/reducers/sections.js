import {
    GET_SECTIONS,
    CREATE_SECTION,
    EDIT_SECTION,
    DELETE_SECTION,
    CLEAR_SECTIONS,
    MOVE_PLAYER,
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
                sections: [...state.sections, payload],
                loading: false
            };
        case EDIT_SECTION:
            const updatedSections = [];
            state.sections.forEach(section => {
                if (section._id === payload._id) {
                    updatedSections.push(payload);
                } else {
                    updatedSections.push(section);
                }
            });
            return {
                ...state,
                sections: updatedSections,
                loading: false
            };
        case MOVE_PLAYER:
            const oldSectionId = payload.updatedOldSection._id;
            const newSectionId = payload.updatedNewSection._id;
            const newSections = [];
            // Replace the old and new sections
            state.sections.forEach(section => {
                if (section._id === oldSectionId) {
                    newSections.push(payload.updatedOldSection);
                } else if (section._id === newSectionId) {
                    newSections.push(payload.updatedNewSection);
                } else {
                    newSections.push(section);
                }
            });
            return {
                ...state,
                sections: newSections
            }
        case DELETE_SECTION:
            return {
                ...state,
                sections: state.sections.filter(section => section._id !== payload),
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
