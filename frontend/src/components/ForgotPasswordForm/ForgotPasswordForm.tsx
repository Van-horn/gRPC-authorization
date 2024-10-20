import { useState, useCallback, FC, ChangeEvent } from "react"
// import { NormaInput, FilledButton } from "my-react-ui-kit"
import { Link } from "react-router-dom"

import styles from "./ForgotPasswordForm.module.scss"
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { useInput } from "../../hooks/input"
import preventDefault from "../../utils/preventDefault"
import PasswordEye from "../../UI/passwordEye"

export interface IForgotPasswordData {
	email: string
	password: string
}
const initialState: IForgotPasswordData = {
	email: "",
	password: "",
}
const ForgotPasswordForm: FC<Record<never, never>> = () => {
	// const dispatch = useAppDispatch()
	// const navigate = useNavigate()

	const preventDefaultHandler = useCallback(preventDefault, [])

	const {
		state: { email, password },
		onChange,
		resetInputs,
	} = useInput<IForgotPasswordData>(initialState)
	const emailHandler = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => onChange("email", e.target.value),
		[onChange],
	)
	const passwordHandler = useCallback(
		(e: ChangeEvent<HTMLInputElement>) =>
			onChange("password", e.target.value),
		[onChange],
	)

	const [passwordEye, setPasswordEye] = useState<boolean>(true)
	const passwordEyeHandler = useCallback(
		() => setPasswordEye((prev) => !prev),
		[],
	)

	return (
		<main className={styles.main}>
			<form className={styles.form} onSubmit={preventDefaultHandler}>
				<span className={styles.formName}>Replace password</span>
				{/* <div className={styles.inputs}>
					<NormaInput
						type="email"
						title=""
						required
						value={email}
						onChange={emailHandler}
						placeholder="email..."
						className={styles.input}
					/>
					<NormaInput
						type={passwordEye ? "password" : "text"}
						value={password}
						title=""
						required
						pattern="[A-Za-z0-9]*"
						minLength={6}
						onChange={passwordHandler}
						placeholder="new password..."
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
						Replace
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
					<span className={styles.lableForgot}>Back to :</span>
					<Link to="/authorization/logIn" className={styles.refForgot}>
						LogIn
					</Link>
				</div>
				<div
				//  className={styles.regAlternative}
				>
					<span className={styles.lableReg}>Back to :</span>
					<Link to="/authorization/singUp" className={styles.refReg}>
						SingUp
					</Link>
				</div>
			</div>
		</main>
	)
}

export default ForgotPasswordForm
