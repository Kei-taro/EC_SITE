import React, { useCallback, useState } from "react"
import { PrimaryButton, TextInput } from "../components/UIkit"
import { signIn } from "../reducks/users/operations"
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

/*
import { useNavigate } from "react-router-dom";
react-router:Ver6系で使うページ遷移メソッド
*/

function SignIn() {
  const dispatch = useDispatch();
  //const navigate = useNavigate()
    
  const [email, setEmail] = useState(""),
        [password, setPassword] = useState("");


  const inputEmail = useCallback((event) => {
      setEmail(event.target.value)
  }, [setEmail]);

  const inputPassword = useCallback((event) => {
      setPassword(event.target.value)
  }, [setPassword]);

  return (
    <div className="c-section-container center">
      <h2 className="u-text__headline u-text-center">SignIn</h2>
      <div className="module-spacer--medium" />
      <TextInput
        fullwidth={true} label={"mailadress"} multiline={false} required={true}
        minRows={1} value={email} type={"email"} onChange={inputEmail}
      />
      <TextInput
        fullwidth={true} label={"password"} multiline={false} required={true}
        minRows={1} value={password} type={"password"} onChange={inputPassword}
      />
      <div className="module-spacer--medium" />
      <div>
        <PrimaryButton
          label={"Sign In"}
          onClick={() => {
            dispatch(signIn(email, password));
          }}
        />
        <div className="module-spacer--medium" />
        <p
          onClick={() => {
            dispatch(push("/signup"))
          }}
        >
          Create Account
        </p>
        <p
          onClick={() => {
            dispatch(push("/signin/reset"))
          }}
        >
          Password Reset
        </p>

      </div>
    </div>
  )
}
export default SignIn

/*
 [ソースコード概略]
 アカウントを持っている時にログインするページ
 */