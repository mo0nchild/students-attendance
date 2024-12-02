import { RouterProvider } from 'react-router-dom'
import '@core/App.css'
import { routers } from '@utils/routers'

function App(): JSX.Element {
    return <RouterProvider router={routers}/>
}

export default App
