import { FC, MouseEventHandler } from "react"
import { BsEye, BsEyeSlash } from "react-icons/bs"

import styles from "./index.module.scss"

interface PasswordEyeProps {
	value: boolean
	onChange: MouseEventHandler<HTMLSpanElement>
	className?: string
}

const PasswordEye: FC<PasswordEyeProps> = ({
	value,
	onChange,
	className = "",
	...props
}) => {
	const classes = [styles.passwordEye, className]
	return (
		<span onClick={onChange}>
			{value ? (
				<BsEyeSlash {...props} className={classes.join(" ")} />
			) : (
				<BsEye {...props} className={classes.join(" ")} />
			)}
		</span>
	)
}

export default PasswordEye
