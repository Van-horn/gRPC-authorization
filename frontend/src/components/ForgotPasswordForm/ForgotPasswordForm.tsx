import { useState, useCallback, FC } from "react";
import { Link } from "react-router-dom";
import { OnePieceButton, OnePieceInput } from "my-react-ui-kit";

import styles from "./ForgotPasswordForm.module.scss";
// import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { useTextInput } from "../../hooks/input";
import formPreventDefault from "../../utils/formPreventDefault";
import { themeColor } from "../../sass/variables";

interface ForgotPasswordData {
   email: string;
   password: string;
   [key: string]: string;
}

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
      <main className={styles.main}>
         <form className={styles.form} onSubmit={formPreventDefault}>
            <div></div>
            <span className={styles.formName}>Replace password</span>
            <div className={styles.inputs}>
               <OnePieceInput
                  required
                  height={2.6}
                  themeColor={themeColor}
                  type="email"
                  value={email}
                  onChange={changeEmail}
                  placeholder="email..."
               />
               <OnePieceInput
                  required
                  themeColor={themeColor}
                  height={2.6}
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
               <OnePieceButton text="Replace" type="submit" />
            </div>
         <div className={styles.alternatives}>
            <div
            //  className={styles.forgotAlternative}
            >
               <span className={styles.lableForgot}>Back to :</span>
               <Link to="/logIn" className={styles.refForgot}>
                  LogIn
               </Link>
            </div>
            <div
            //  className={styles.regAlternative}
            >
               <span className={styles.lableReg}>Back to :</span>
               <Link to="/singUp" className={styles.refReg}>
                  SingUp
               </Link>
            </div>
         </div>
         </form>
      </main>
   );
};

export default ForgotPasswordForm;
