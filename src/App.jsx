import React from 'react' //.jsx��import����
import Router from './Router'
import "./assets/reset.css"
import "./assets/style.css"
import { Header } from './components/Header'

function App() {
  return (
/*����ɃR���|�[�l���g����ׂ鎞�͈�ԏ��<></>������*/
    <>
      <Header />
      <main className="c-main">
        <Router />
      </main>
    </>
  )
}

export default App;