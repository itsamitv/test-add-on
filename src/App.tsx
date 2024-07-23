import React from 'react'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import SidePanel from './pages/SidePanel'
import MainStage from './pages/MainStage'

const App = () => {
  const [session, setSession] = React.useState(null);
  const [client, setClient] = React.useState(null);
  React.useEffect(() => {
    const initialize = async () => {
      const session = await (window as any).meet.addon.createAddonSession({
        cloudProjectNumber: import.meta.env.VITE_GOOGLE_PROJECT_NUMBER,
    
      });
      setSession(session);

      const client = await session.createSidePanelClient();
      setClient(client);

      const contentItems = document.querySelector('.content-items');

    }
    initialize();
  }, []);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/side-panel" element={<SidePanel />} />
      <Route path="/main-stage" element={<MainStage />} />  
      <Route path="/" element={<h1>Hello Home</h1>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App