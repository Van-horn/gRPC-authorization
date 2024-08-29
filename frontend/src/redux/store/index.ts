import { configureStore, combineReducers } from "@reduxjs/toolkit"
// import { userService } from '../../services/user-service'

const rootReducer = combineReducers({
	// [userService.reducerPath]: userService.reducer,
})

export const setupStore = () =>
	configureStore({
		reducer: rootReducer,
		// middleware: getDefaultMiddleware => getDefaultMiddleware().concat(userService.middleware),
	})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]
