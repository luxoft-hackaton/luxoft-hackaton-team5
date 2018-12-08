import { SET_PAIR,
    SET_TOLIST, SET_TO, SET_FROM, SET_AVERAGE_PRICE, SET_FROMLIST, SET_RESULT
} from "../constants/action-types";

export const setPairs = pairs => ({ type: SET_PAIR, payload: pairs });
export const setToList = toList => ({ type: SET_TOLIST, payload: toList });
export const setFromList = fromList => ({ type: SET_FROMLIST, payload: fromList });
export const setAveragePrice = averagePrice => ({ type: SET_AVERAGE_PRICE, payload: averagePrice });
export const setResult = averagePrice => ({ type: SET_RESULT, payload: averagePrice });
export const setFrom = from => ({ type: SET_FROM, payload: from });
export const setTo = to => ({ type: SET_TO, payload: to });
