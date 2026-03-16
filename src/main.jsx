import './index.css'
import App from './App.jsx'
import { ViteSSG } from 'vite-ssg'

export const createApp = ViteSSG(App)
