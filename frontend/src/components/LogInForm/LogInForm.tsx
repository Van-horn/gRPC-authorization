import { useState, useCallback, ChangeEvent, FC } from "react"
import { Link } from "react-router-dom"
// import { NormaInput, FilledButton } from "my-react-ui-kit"

import styles from "./LogInForm.module.scss"
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { useTextInput } from "../../hooks/input"
import formPreventDefault from "../../utils/formPreventDefault"

export interface LogInData {
	email: string
	password: string
	[key: string]: string;
}
const initialState: LogInData = {
	email: "",
	password: "",
}
const LogInForm: FC<Record<never, never>> = () => {
	//  const dispatch = useAppDispatch()
	//  const navigate = useNavigate()


	const [passwordEye, setPasswordEye] = useState<boolean>(true)
	const passwordEyeHandler = useCallback(
		() => setPasswordEye((prev) => !prev),
		[],
	)
	return (
		<main className={styles.main}>
			<form className={styles.form} onSubmit={formPreventDefault}>
				{/* <span className={styles.formName}>LogIn</span>
				<div className={styles.inputs}>
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
						LogIn
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
				//  className={styles.forgotAlternative}
				>
					<span className={styles.lableForgot}>Forgot password :</span>
					<Link
						to="/forgotPassword"
						className={styles.refForgot}>
						Replace
					</Link>
				</div>
				<div
				//  className={styles.regAlternative}
				>
					<span className={styles.lableReg}>I have not an account :</span>
					<Link to="/singUp" className={styles.refReg}>
						SingUp
					</Link>
				</div>
			</div>
		</main>
	)
}

export default LogInForm
