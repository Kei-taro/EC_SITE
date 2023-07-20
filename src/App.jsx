import React from 'react' //.jsxでimportする
import Router from './Router'
import "./assets/reset.css"
import "./assets/style.css"
import { Header } from './components/Header'

function App() {
  return (
/*並列にコンポーネントを並べる時は一番上に<></>を書く*/
    <>
      <Header />
      <main className="c-main">
        <Router />
      </main>
    </>
  )
}

export default App;