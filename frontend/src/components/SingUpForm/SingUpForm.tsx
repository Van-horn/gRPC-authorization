import { FC, useState, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { useTextInput } from "../../hooks/input"
import { OnePieceButton,OnePieceInput } from "my-react-ui-kit"

import styles from "./SingUpForm.module.scss"
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import formPreventDefault from "../../utils/formPreventDefault"
import { ChangeEvent } from "react"

export interface ISingUpData {
	login: string
	email: string
	password: string
	[key: string]: string;
}
const initialState: ISingUpData = {
	login: "",
	email: "",
	password: "",
}
const SingUpForm: FC<Record<never, never>> = () => {

	const {
		state: { login, email, password },
		// onChange,
		
	} = useTextInput<ISingUpData>(initialState)
	// const loginHandler = useCallback(
	// 	(e: ChangeEvent<HTMLInputElement>) => onChange("login", e.target.value),
	// 	[onChange],
	// )
	// const emailHandler = useCallback(
	// 	(e: ChangeEvent<HTMLInputElement>) => onChange("email", e.target.value),
	// 	[onChange],
	// )
	// const passwordHandler = useCallback(
	// 	(e: ChangeEvent<HTMLInputElement>) =>
	// 		onChange("password", e.target.value),
	// 	[onChange],
	// )

	const [passwordEye, setPasswordEye] = useState<boolean>(true)
	const passwordEyeHandler = useCallback(
		() => setPasswordEye((prev) => !prev),
		[],
	)
	return (
		<main className={styles.main}>
			<form className={styles.form} onSubmit={formPreventDefault}>
				{/* <span className={styles.formName}>SingUp</span>
				<div className={styles.inputs}>
					<NormaInput
						type="text"
						value={login}
						title=""
						required
						onChange={loginHandler}
						placeholder="login..."
						className={styles.input}
					/>
					<NormaInput
						type="email"
						value={email}
						title=""
						required
						onChange={emailHandler}
						placeholder="email..."
						className={styles.input}
					/>
					<NormaInput
						type={passwordEye ? "password" : "text"}
						value={password}
						title=""
						required
						onChange={passwordHandler}
						placeholder="password..."
						className={styles.input}
					/>
					<PasswordEye
						onChange={passwordEyeHandler}
						value={passwordEye}
						className={styles.passwordEye}
					/>
				</div>
				<div className={styles.formButtons}>
					<FilledButton type="submit" className={styles.buttonSubmit}>
						SingUp
					</FilledButton>
					<FilledButton
						type="reset"
						onClick={resetInputs}
						className={styles.buttonReset}>
						Reset
					</FilledButton>
				</div> */}
			</form>
			<div className={styles.alternatives}>
				<div
				//  className={styles.regAlternative}
				>
					<span className={styles.lableReg}>
						I already have an account :
					</span>
					<Link to="/logIn" className={styles.refReg}>
						LogIn
					</Link>
				</div>
				<div
				//  className={styles.forgotAlternative}
				>
					<span className={styles.lableForgot}>Forgot password :</span>
					<Link
						to="/forgotPassword"
						className={styles.refForgot}>
						Replace
					</Link>
				</div>
			</div>
		</main>
	)
}

export default SingUpForm
