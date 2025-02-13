import { RouterProvider } from 'react-router-dom'
import { routers } from '@utils/routers'
import Header from '@components/header/Header'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@core/App.css'

function App(): JSX.Element {
    return (
    <div className='page-root'>
        <Header/>
        <div className='page-content' id='page-content'>
            <RouterProvider router={routers}/>
        </div>
    </div>
    )
}

export default App
