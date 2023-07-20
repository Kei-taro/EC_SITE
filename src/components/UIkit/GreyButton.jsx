import Rreact from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useSyles = makeStyles((theme) => ({
  "button": {
    backgroundColor: theme.palette.grey["300"],
    fontSize: 16,
    height: 48,
    marginButton: 16,
    width:256
  }
}))

function GreyButton(props) {
  const classes = useSyles();

  return (
    <Button className={classes.button} variant="contained" onClick={() => props.onClick()}>
      {props.label}
    </Button>
  )
}

export default GreyButton

/*
 [ソースコード概略]
 グレーボタンのテンプレート
 */