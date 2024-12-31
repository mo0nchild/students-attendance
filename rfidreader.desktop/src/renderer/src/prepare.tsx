import { createRoot } from "react-dom/client";
import { Spinner } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css'
import '@core/index.css'
import '@core/App.css'

createRoot(document.getElementById('root')!).render(<PrepareApp/>)

function PrepareApp(): JSX.Element {
    return <div className='d-flex justify-content-center align-items-center flex-column h-100'>
        <h1 style={{fontSize: '22px'}}>Подготовка к запуску...</h1>
        <p>Приложение скоро загрузится</p>
        <Spinner animation="grow" variant="white" />
    </div>
}