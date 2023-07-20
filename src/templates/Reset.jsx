import React, { useCallback, useState } from "react"
import { PrimaryButton, TextInput } from "../components/UIkit"
import { resetPassword } from "../reducks/users/operations"
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";


function Reset() {
  const dispatch = useDispatch();
    
  const [email, setEmail] = useState("");

   const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail]);

   return (
     <div className="c-section-container center">
       <h2 className="u-text__headline u-text-center">PasswordReset</h2>
       <div className="module-spacer--medium" />
       <TextInput
         fullwidth={true} label={"mailadress"} multiline={false} required={true}
         minRows={1} value={email} type={"email"} onChange={inputEmail}
       />
       <div className="module-spacer--medium" />
       <div>
         <PrimaryButton
           label={"Reset Password"}
           onClick={() => {
             dispatch(resetPassword(email));
           }}
         />
         <div className="module-spacer--medium" />
         <p
           onClick={() => {
             dispatch(push("/signin"))
           }}
         >
           Back to SignIn
         </p>
       </div>

            
     </div>
   )
}
export default Reset

/*
 [ソースコード概略]
パスワードをリセットするページ
 */