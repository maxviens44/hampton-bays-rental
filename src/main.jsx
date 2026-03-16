import './index.css'
import App from './App.jsx'
import { ViteReactSSG } from 'vite-react-ssg'

export const createRoot = ViteReactSSG(<App />)
