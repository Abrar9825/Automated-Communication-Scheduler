import { Route, Routes } from 'react-router-dom'
import CreatePage from './pages/CreatePage'
import Navbar from './components/Navbar'
import ShowTask from './pages/ShowTask'

function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={< CreatePage />}></Route>
        <Route path='/showtask' element={<ShowTask />}></Route>
      </Routes >
    </div>
  )
}

export default App
