import Header from "./components/Header"
import Home from "./views/Home"
import Proposal from "./views/Proposal"
import Docs from "./views/Docs"
import { Routes, Route } from 'react-router-dom'
import { getInfo, isWalletConnected, getProposals } from "./Blockchain.services"
import { useEffect, useState } from 'react'
import CreateProposal from "./components/CreateProposal"

const App = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(async () => {
    await isWalletConnected()
    await getInfo()
    await getProposals()
    setLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#efe4d5] text-black">
      <Header />
      {loaded ? (
              <Routes>
              <Route path="/CoffeeClubDAO" element={<Home />}/>
              <Route path="/proposal/:id" element={<Proposal />}/>
              <Route path="/docs/:id" element={<Docs />}/>
            </Routes>
      ) : null}
      <CreateProposal />
    </div>
  )
}

export default App
