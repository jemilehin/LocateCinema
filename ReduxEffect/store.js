import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { reducers } from "./actionsReducers";

const combinedReducers = combineReducers({ reducers })
const store = createStore(combinedReducers)

export default store