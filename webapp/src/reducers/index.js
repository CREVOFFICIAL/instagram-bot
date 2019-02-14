import {
    handleActions
} from "redux-actions";

const initialState = {
    response: {},
    status: "",
};

const init = state => ({
    ...state,
});

const reducer = handleActions({
        INIT: init,
    },
    initialState
);

export default reducer;