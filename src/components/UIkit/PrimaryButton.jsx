import Rreact from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";

const useSyles = makeStyles({
  "button": {
    backgroundColor: "#44DDEE",
    color: "#000",
    fontSize: 16,
    height: 48,
    marginButton: 16,
    width:256
  }

})

function PrimaryButton(props) {
  const classes = useSyles();

  return (
    <Button className={classes.button} variant="contained" onClick={() => props.onClick()}>
      {props.label}
    </Button>
  )
}

export default PrimaryButton

/*
 [ソースコード概略]
 ボタンのテンプレート
 */