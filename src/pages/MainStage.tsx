import React, { useState, useEffect } from 'react';

function MainStage() {
  const [documentTitle, setDocumentTitle] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const session = await window.meet.addon.createAddonSession({
        cloudProjectNumber: import.meta.env.VITE_GOOGLE_PROJECT_NUMBER,
      });
      const client = await session.createMainStageClient();

      await client.unloadSidePanel();

      const startingState = await client.getCollaborationStartingState();
      if (startingState.additionalData) {
        const item = JSON.parse(startingState.additionalData);
        setDocumentTitle(item.title);
      }
    };

    initialize();
  }, []);

  return (
    <div className="meet-addon">
      <header className="header">
        <img src="/icon.svg" alt="Demo Add-on" />
        Demo Add-on
      </header>
      <div id="app">
        {documentTitle ? (
          <div>Viewing document: {documentTitle}</div>
        ) : (
          <div className="content-container">Loading...</div>
        )}
      </div>
    </div>
  );
}

export default MainStage;
