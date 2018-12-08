import {
    SET_PAIR,
    SET_TOLIST,
    SET_FROMLIST,
    SET_FROM,
    SET_TO,
    SET_AVERAGE_PRICE,
    SET_RESULT
} from "../constants/action-types";
const initialState = {
    pairs: ['BTC/XRP', 'BTC/USD', 'BTC/ETH', 'ETH/XRP', 'ETH/LTC', 'ETH/DAG', 'BTC/ZTH', 'XOOI/ZTH'],
    toList: [''],
    fromList: [''],
    from: '',
    to: '',
    averagePrice:{},
    result:[],
};
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAIR:
            return { ...state, pairs: [...action.payload] };
        case SET_TOLIST:
            return { ...state, toList: [...action.payload] };
        case SET_FROMLIST:
            return { ...state, fromList: [...action.payload] };
        case SET_FROM:
            return { ...state, from: action.payload };
        case SET_TO:
            return { ...state, to: action.payload };
        case SET_AVERAGE_PRICE:
            return { ...state, averagePrice: action.payload };
        case SET_RESULT:
            return { ...state, result: action.payload };
        default:
            return state;
    }
};
export default rootReducer;
