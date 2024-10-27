import { useState, useCallback, FC, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import { OnePieceButton, OnePieceInput } from "my-react-ui-kit";
import styled from "styled-components";

import styles from "./SingUpForm.module.scss";
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { useTextInput } from "../../hooks/input";
import { themeColor, fontColor } from "../../sass/variables";
import { useRegistrationMutation } from "../../redux/RTK-Query/authorization";
import { getItem } from "../../utils/localStorage";

interface SingUpData {
  login: string;
  email: string;
  password: string;

  [key: string]: string;
}
const singUpData: SingUpData = {
  login: "",
  email: "",
  password: "",
};

const RefLabel = styled.span`
  color: rgb(87, 44, 87);
`;

const SingUpForm: FC<Record<never, never>> = () => {
  const [register, { isLoading }] = useRegistrationMutation({
    fixedCacheKey: "userCredentials",
  });
  // const [refersh] = useRefreshMutation({
  //   fixedCacheKey: "userCredentials",
  // });
  // const dispatch = useAppDispatch()
  // const navigate = useNavigate()

  const [isSingUpButtonPress, SingUpButtonPress] = useState<boolean>(false);

  const [pasEyeState, setPasEyeState] = useState<boolean>(true);

  const handlePasEye = useCallback(() => {
    setPasEyeState((prev) => !prev);
  }, []);

  const handleSingUp = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    SingUpButtonPress(true);
  }, []);

  const {
    state: { email, password, login },
    changeLogin,
    changePassword,
    changeEmail,
  } = useTextInput<SingUpData>(singUpData);

  useEffect(() => {
    async function registerHandler(): Promise<void> {
      try {
        const data = await register({ login, email, password });
        console.log(data);
     
      } catch (error) {
      } finally {
        SingUpButtonPress(false);
      }
    }
    if (isSingUpButtonPress) registerHandler();
  }, [email, isSingUpButtonPress, login, password, register]);

  return (
    <main>
      <form className={styles.form} onSubmit={handleSingUp}>
        <div className={styles.formDiv}>
          <span className={styles.formName}>SingUp</span>
          <div className={styles.inputs}>
            <OnePieceInput
              required
              pattern="[A-Za-z0-9]*"
              width={20}
              height={2.6}
              invalidColor="rgb(241, 112, 112)"
              themeColor={themeColor}
              type="text"
              value={login}
              onChange={changeLogin}
              placeholder="login..."
            />
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
              invalidColor="rgb(241, 112, 112)"
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
              text="sing up"
              type="submit"
              rounding="semicircle"
              width={20}
              height={2.6}
              isLoading={isLoading}
              loadingKind="spinner"
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
          </div>
        </div>
      </form>
    </main>
  );
};

export default SingUpForm;
