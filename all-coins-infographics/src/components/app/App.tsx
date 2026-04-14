import { BrowserRouter } from 'react-router-dom'
import { Provider as Redux } from 'react-redux'
import store from '../../redux/store'
import Layout from '../layout/layout/Layout'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Redux store={store}>
          <Layout />
        </Redux>
      </BrowserRouter>
    </>
  )
}

export default App
