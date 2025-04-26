import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import DashBoard from './components/DashBoard';
import Body from './components/Body';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/authContext';
import AddExpense from './components/AddExpense';

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body/>} >
          <Route element={<ProtectedRoute/>}>
            <Route path='/dashboard' element={<DashBoard />} />
            <Route path='/expenses/add' element={<AddExpense />} />
          </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
