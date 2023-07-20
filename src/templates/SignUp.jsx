import React, { useCallback, useState } from "react"
import { PrimaryButton, TextInput } from "../components/UIkit"
import { signUp } from "../reducks/users/operations"
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

function SignUp() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState(""),
        [email, setEmail] = useState(""),
        [password, setPassword] = useState(""),
        [confirmPassword, setConfirmPassword] = useState("");

  const inputUsername = useCallback((event) => {
      setUsername(event.target.value)
  }, [setUsername]);

  const inputEmail = useCallback((event) => {
      setEmail(event.target.value)
  }, [setEmail]);

  const inputPassword = useCallback((event) => {
      setPassword(event.target.value)
  }, [setPassword]);

  const inputConfirmPassword = useCallback((event) => {
      setConfirmPassword(event.target.value)
  }, [setConfirmPassword]);

  return (
    <div className="c-section-container center">
      <h2 className="u-text__headline u-text-center">Account Register</h2>
      <div className="module-spacer--medium" />
      <TextInput
          fullwidth={true} label={"username"} multiline={false} required={true}
          minRows={1} value={username} type={"text"} onChange={inputUsername}
      />
      <TextInput
          fullwidth={true} label={"mailadress"} multiline={false} required={true}
          minRows={1} value={email} type={"email"} onChange={inputEmail}
      />
      <TextInput
          fullwidth={true} label={"password"} multiline={false} required={true}
          minRows={1} value={password} type={"password"} onChange={inputPassword}
      />
      <TextInput
          fullwidth={true} label={"confirmpassword"} multiline={false} required={true}
          minRows={1} value={confirmPassword} type={"password"} onChange={inputConfirmPassword}
      />
      <div className="module-spacer--medium" />
      <div>
        <PrimaryButton
          label={"Account Register"}
          onClick={() => {
            dispatch(signUp(username, email, password, confirmPassword));
          }}
        />
        <div className="module-spacer--medium" />
        <p
          onClick={() => {
            dispatch(push("/signin"))
          }}
        >
          Sign In
        </p>
      </div>
    </div>
  )
}

export default SignUp

/*
 [ソースコード概略]
 アカウント作成するページ
 */