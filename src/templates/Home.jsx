import React from 'react'
import { Link } from "react-router-dom";
import { getUserId, getUsername} from "../reducks/users/selectors";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../reducks/users/operations"
import { Button } from '@material-ui/core';

function Home() {
  const dispatch = useDispatch()
  const selector = useSelector(state => state);
  const uid = getUserId(selector);
  const username = getUsername(selector);
  console.log("Home");

  return (
    <div>
      <h1>Home</h1>
      <div>
        signup to <Link to={`/signup/`}>this.</Link>
      </div>
      <div>
        signIn to <Link to={`/signin/`}>this.</Link>
      </div>
      <Button onClick={() => dispatch(signOut()) }>
        --Sign Out--
      </Button>
      <div>
        Product Edit to <Link to={`/product/edit`}>this.</Link>
      </div>
      
      <div>
        Product List to <Link to={`/productlist`}>this.</Link>
      </div>
      <p>id:{uid}</p>
      <p>name:{username}</p>
    </div>
  )
}

export default Home;

/*
 [ソースコード概略]
 ルートとして表示されるページ
 */