import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authorization } from "../RTK-Query/authorization";

const rootReducer = combineReducers({
  [authorization.reducerPath]: authorization.reducer,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authorization.middleware),
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
