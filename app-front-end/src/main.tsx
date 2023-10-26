import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './config/store.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from './config/app-routing.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  
)
