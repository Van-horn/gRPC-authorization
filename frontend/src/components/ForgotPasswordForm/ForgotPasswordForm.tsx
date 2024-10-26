import { useState, useCallback, FC } from "react";
import { Link } from "react-router-dom";
import { OnePieceButton, OnePieceInput } from "my-react-ui-kit";
import styled from "styled-components";

import styles from "./ForgotPasswordForm.module.scss";
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { useTextInput } from "../../hooks/input";
import formPreventDefault from "../../utils/formPreventDefault";
import { themeColor, fontColor } from "../../sass/variables";

interface ForgotPasswordData {
  email: string;
  password: string;

  [key: string]: string;
}

const RefLabel = styled.span`
  color: rgb(87, 44, 87);
`;

const ForgotPasswordForm: FC<Record<never, never>> = () => {
  // const dispatch = useAppDispatch()
  // const navigate = useNavigate()

  const forgotPasswordData: ForgotPasswordData = {
    email: "",
    password: "",
  };

  const [pasEyeState, setPasEyeState] = useState<boolean>(true);

  const handlePasEye = useCallback(() => {
    setPasEyeState((prev) => !prev);
  }, []);

  const {
    state: { email, password },
    changePassword,
    changeEmail,
  } = useTextInput<ForgotPasswordData>(forgotPasswordData);

  return (
    <main>
      <form className={styles.form} onSubmit={formPreventDefault}>
        <div className={styles.formDiv}>
          <span className={styles.formName}>Replace password</span>
          <div className={styles.inputs}>
            <OnePieceInput
              required
              width={20}
              height={2.6}
              invalidColor="rgb(241, 112, 112)"
              themeColor={themeColor}
              type="email"
              value={email}
              onChange={changeEmail}
              placeholder="email..."
            />
            <OnePieceInput
              required
              themeColor={themeColor}
              width={20}
              height={2.6}
              invalidColor="rgb(241, 112, 112)"
              type={pasEyeState ? "password" : "text"}
              onChange={changePassword}
              value={password}
              icon="passwordEye"
              onIconClick={handlePasEye}
              iconState={pasEyeState}
              placeholder="new password..."
              pattern="[A-Za-z0-9]*"
              minLength={6}
            />
          </div>
          <div className={styles.formButtons}>
            <OnePieceButton
              text="Replace"
              type="submit"
              rounding="semicircle"
              width={20}
              height={2.6}
              initBgcolor={themeColor}
              initColor={fontColor}
            />
          </div>
          <div className={styles.alternatives}>
            <div className={styles.logIn}>
              <RefLabel>Already have an account</RefLabel>
              <Link to="/logIn" className={styles.logInRef}>
                LogIn
              </Link>
            </div>

            <div className={styles.singUp}>
              <RefLabel>I don't have an account</RefLabel>
              <Link to="/singUp" className={styles.singUpRef}>
                SingUp
              </Link>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ForgotPasswordForm;
