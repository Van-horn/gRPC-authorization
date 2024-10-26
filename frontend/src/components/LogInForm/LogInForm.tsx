import { useState, useCallback, FC } from "react";
import { Link } from "react-router-dom";
import { OnePieceButton, OnePieceInput } from "my-react-ui-kit";
import styled from "styled-components";

import styles from "./LogInForm.module.scss";
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { useTextInput } from "../../hooks/input";
import formPreventDefault from "../../utils/formPreventDefault";
import { themeColor, fontColor } from "../../sass/variables";

interface LoginFormData {
  email: string;
  password: string;

  [key: string]: string;
}

const RefLabel = styled.span`
  color: rgb(87, 44, 87);
`;

const LogInForm: FC<Record<never, never>> = () => {
  // const dispatch = useAppDispatch()
  // const navigate = useNavigate()

  const LogInFormData: LoginFormData = {
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
  } = useTextInput<LoginFormData>(LogInFormData);

  return (
    <main>
      <form className={styles.form} onSubmit={formPreventDefault}>
        <div className={styles.formDiv}>
          <span className={styles.formName}>LogIn</span>
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
              invalidColor="rgb(241, 112, 112)"
              themeColor={themeColor}
              width={20}
              height={2.6}
              type={pasEyeState ? "password" : "text"}
              onChange={changePassword}
              value={password}
              icon="passwordEye"
              onIconClick={handlePasEye}
              iconState={pasEyeState}
              placeholder="password..."
              pattern="[A-Za-z0-9]*"
              minLength={6}
            />
          </div>
          <div className={styles.formButtons}>
            <OnePieceButton
              text="log in"
              type="submit"
              rounding="semicircle"
              width={20}
              height={2.6}
              initBgcolor={themeColor}
              initColor={fontColor}
            />
          </div>
          <div className={styles.alternatives}>
            <div className={styles.singUp}>
              <RefLabel>I don't have an account</RefLabel>
              <Link to="/singUp" className={styles.singUpRef}>
                SingUp
              </Link>
            </div>
            <div className={styles.forgotPas}>
              <RefLabel>I forgot my password</RefLabel>
              <Link to="/forgotPassword" className={styles.forgotPasRef}>
                Replace
              </Link>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default LogInForm;
