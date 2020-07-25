import {
    SET_SECTIONS_LOADING,
    GET_SECTIONS,
    CREATE_SECTION,
    EDIT_SECTION,
    DUPLICATE_SECTION,
    MOVE_SECTION,
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
        case SET_SECTIONS_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_SECTIONS:
            return {
                ...state,
                sections: payload,
                loading: false
            };
        case DUPLICATE_SECTION:
        case CREATE_SECTION:
            return {
                ...state,
                sections: [...state.sections, payload],
                loading: false
            };
        case EDIT_SECTION:
            const updatedSections = [];
            state.sections.forEach(section => {
                if (section.SK === payload.SK) {
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
            const oldSectionId = payload.updatedOldSection.SK;
            const newSectionId = payload.updatedNewSection.SK;
            const newSections = [];
            // Replace the old and new sections
            state.sections.forEach(section => {
                if (section.SK === oldSectionId) {
                    newSections.push(payload.updatedOldSection);
                } else if (section.SK === newSectionId) {
                    newSections.push(payload.updatedNewSection);
                } else {
                    newSections.push(section);
                }
            });
            return {
                ...state,
                sections: newSections
            }
        case MOVE_SECTION:
        case DELETE_SECTION:
            return {
                ...state,
                sections: state.sections.filter(section => section.SK !== payload),
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
