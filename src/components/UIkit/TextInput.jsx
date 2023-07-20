import React from "react";
import TextField from "@material-ui/core/TextField";

function TextInput(props) {
  return (
    <TextField
      fullwidth={props.fullwidth.toString()}
      label={props.label}
      margin="dense"
      multiline={props.multiline}
      required={props.required}
      minRows={props.minRows}
      value={props.value}
      type={props.type}
      onChange={props.onChange}

    />
  )
}

export default TextInput