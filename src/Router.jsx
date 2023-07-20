import React from 'react'
import { Switch, Route } from "react-router-dom";
import {
  SignIn, ProductList, SignUp, Reset,
  ProductEdit, ProductDetail, Home, CartList,
  OrderConfirm, OrderHistory
} from './templates'
import Auth from "./Auth"

function Router() {
  console.log("Router");
  return (

    /* <BrowserRouter>だとpush(url)でページ遷移ができない */
    /* →Switchに変更(react-router-dom:Ver.5系) */
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signin/reset" component={Reset} />
      
      <Auth>
        <Route exact path="home" component={Home/*ProductList*/} />
        <Route path={"/product/edit(/:id)?"} component={ProductEdit} />
        <Route exact path={"/product/:id"} component={ProductDetail} />
        <Route path={"(/)?"} component={ProductList} />
        <Route exact path={"/cart"} component={CartList} />
        <Route exact path={"/order/confirm"} component={OrderConfirm} />
        <Route exact path={"/order/history"} component={OrderHistory} />
      </Auth>
    </Switch>
  )
}
export default Router;

/*
 [ソースコード概略]
 各ページごとにリンクを設定している
 */

