import { useState } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Ticker from './components/Ticker'
import Header from './components/Header'
import StatsRow from './components/StatsRow'
import InfoCards from './components/InfoCards'
import ModulesGrid from './components/ModulesGrid'
import TechStack from './components/TechStack'
import Footer from './components/Footer'
import { modules } from './components/ModulesGrid'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content p-4 md:p-8" id="main-content">
        <Ticker />
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <StatsRow moduleCount={modules.length} />
        <InfoCards onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <ModulesGrid />
        <TechStack />
        <Footer />
      </div>
    </>
  )
}

export default App
