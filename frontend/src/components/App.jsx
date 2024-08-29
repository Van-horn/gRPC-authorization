import { memo } from "react"
import { Route, Routes } from "react-router-dom"

import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm"
import LogInForm from "./LogInForm/LogInForm"
import SingUpForm from "./SingUpForm/SingUpForm"

function App() {
	return (
		<Routes>
			<Route element={<LogInForm />} path="/authorization/logIn" />
			<Route element={<SingUpForm />} path="/authorization/singUp" />
			<Route
				element={<ForgotPasswordForm />}
				path="/authorization/forgotPassword"
			/>
		</Routes>
	)
}

export default memo(App)
