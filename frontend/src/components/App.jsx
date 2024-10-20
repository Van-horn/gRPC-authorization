import { memo } from "react"
import { Route, Routes } from "react-router-dom"

import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm"
import LogInForm from "./LogInForm/LogInForm"
import SingUpForm from "./SingUpForm/SingUpForm"

function App() {
	return (
		<Routes>
			<Route element={<LogInForm />} path="/logIn" />
			<Route element={<SingUpForm />} path="/singUp" />
			<Route
				element={<ForgotPasswordForm />}
				path="/forgotPassword"
			/>
		</Routes>
	)
}

export default memo(App)
