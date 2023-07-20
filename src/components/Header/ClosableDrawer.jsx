import React, { useCallback, useState, useEffect } from "react"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import HistoryIcon from "@material-ui/icons/History"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import { TextInput } from "../UIkit/index"
import { useDispatch } from "react-redux"
import { push } from "connected-react-router"
import { signOut } from "../../reducks/users/operations"
import { db } from "../../firebase/index"

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      flexShrink: 0,
      width: 256
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 256
  },
  searchField: {
    alignItems: "center",
    display: "flex",
    marginLeft: 32
  }
}))

function ClosableDrawer(props) {
  const classes = useStyles()
  const { container } = props
  const dispatch = useDispatch()

  const [keyword, setKeyword] = useState("");

  const inputKeyword = useCallback((event) => {
    setKeyword(event.target.value)
  }, [setKeyword]);

  const selectMenu = (event, path) => {
    dispatch(push(path))
    props.onClose(event)
  }

  const [filters, setFilters] = useState([
    { func: selectMenu, label: "All", id: "all", value: "/" },
    { func: selectMenu, label: "Mens", id: "male", value: "/?gender=male" },
    { func: selectMenu, label: "Womens", id: "female", value: "/?gender=female" }
  ])

  const menus = [
    { func: selectMenu, label: "ProductRegister", icon: <AddCircleIcon />, id: "register", value: "/product/edit" },
    { func: selectMenu, label: "OrderHistory",    icon: <HistoryIcon />,   id: "history",  value: "/order/history" },
    { func: selectMenu, label: "Profile",         icon: <PersonIcon />,    id: "profile",  value: "/user/mypage" }
  ]

  useEffect(() => {
    db.collection("categories").orderBy("order", "asc").get()
      .then(snapshots => {
        const list = []
        snapshots.forEach(snapshot => {
          const category = snapshot.data()
          list.push({
            func: selectMenu,
            label: category.name,
            id: category.id,
            value: `/?category=${category.id}`//バッククォートを使うと文字列の中に変数を使える
          }) 
        })
        setFilters(prevState => [...prevState, ...list])
      })
  }, [])

  return (
    <nav className={classes.drawer}>
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={props.open}
        onClose={(e) => props.onClose(e)}
        classes={{paper: classes.drawerPaper}}
        ModalProps={{keepMounted: true}}
      >
        <div
//Tabキーで選択後Enterキーで決定してメニューを閉じる為の処理
          onClose={(e) => props.onClose(e)}
          onKeyDown={(e) => props.onClose(e)}
        >
          <div className={classes.searchField}>
            <TextInput
              fullwidth={false} label={"Enter Keyword"} multiline={false}
              onChange={inputKeyword} required={false} minRows={1} value={keyword} type={"text"}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {menus.map(menu => (
              <ListItem button key={menu.id} onClick={(e) => menu.func(e, menu.value)}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItem>
             ))}
            <ListItem button key="logout" onClick={() => dispatch(signOut())}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
          <Divider />
          <List>
            {filters.map(filter => (
              <ListItem
                button
                key={filter.id}
                onClick={(e) => filter.func(e, filter.value)}
              >
                <ListItemText primary={filter.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </nav>
  )

}

export default ClosableDrawer