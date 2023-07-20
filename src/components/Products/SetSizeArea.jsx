import React, { useCallback, useState, useMemo }  from "react"
import TableContainer from "@material-ui/core/TableContainer"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import IconButton from "@material-ui/core/IconButton"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import { makeStyles } from "@material-ui/styles"
import { TextInput } from "../UIkit"

const useStyle = makeStyles({
  iconCell: {
    height: 48,
    width:48
  },
  checkIcon: {
    float:"right"

  }
})

function SetSizeArea(props) {
  const classes = useStyle();

  //何番目のデータなのかを表すステート
  const [index, setIndex] = useState(0),
        [size, setSize] = useState(""),
        [quantity, setQuantity] = useState(0);

  const inputSize = useCallback((event) => {
    setSize(event.target.value)
  }, [setSize]);

  const inputQuantity = useCallback((event) => {
    setQuantity(event.target.value)
  }, [setQuantity]);

  //Validation
  const addSize = (index, size, quantity) => {
    if (size === "" || quantity === "") {
      return false
    }
    else {
      if (index === props.sizes.length) {
        props.setSizes(prevState => [...prevState, { size: size, quantity: quantity }])
        setIndex(index + 1)
        setSize("")
        setQuantity(0)
      }
      else {
        const newSizes = props.sizes
        newSizes[index] = { size: size, quantity: quantity }
        props.setSizes(newSizes)
        setIndex(newSizes.length)
        setSize("")
        setQuantity(0)
      }
      
    }
  }

  const editSize = (index, size, quantity) => {
    setIndex(index)
    setSize(size)
    setQuantity(quantity)
  }

  const deleteSize = (deleteIndex) => {
    const newSizes = props.sizes.filter((item, i) => i !== deleteIndex);
    props.setSizes(newSizes)
  }

  const memoIndex = useMemo(() => {
    setIndex(props.sizes.length)
  }, [props.sizes.length])

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Size</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell className={classes.iconCell} />
              <TableCell className={classes.iconCell} />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sizes.length > 0 && (
              props.sizes.map((item, i) => (
                <TableRow key={item.size}>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton className={classes.iconCell} onClick={() => editSize(i, item.size,item.quantity)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton className={classes.iconCell} onClick={() => deleteSize(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
          <TextInput
            fullwidth={false} label={"size"} multiline={false} required={true}
            onChange={inputSize} minRows={1} value={size} type={"text"}
          />
          <TextInput
            fullwidth={false} label={"Volume"} multiline={false} required={true}
            onChange={inputQuantity} minRows={1} value={quantity} type={"number"}
          />
        <IconButton className={classes.checkIcon} onClick={() => addSize(index, size, quantity)}>
          <CheckCircleIcon />
        </IconButton>
      </TableContainer>
      <div className="module-spacer--small" />
    </div>

    )
 }

export default SetSizeArea