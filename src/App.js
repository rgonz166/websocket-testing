import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import Home from "./Pages/Home"
import Settings from "./Pages/Settings"
import Navbar from "./Components/Navbar"
import OBSWebSocket from "obs-websocket-js";


const obs = new OBSWebSocket();

const App = () => {
  
  const [scenes, setScenes] = useState([])
  const [sources, setSources] = useState([])
  const [obsConnected, setObsConnected] = useState(false)

    const connectObs =  () => {
        obs.connect({address: 'localhost:4444', password: '123456'}).then(() => {
            setObsConnected(true);
            obs.send('GetSceneList')
            .then( data => {
                setScenes(data.scenes);
                if (data.scenes && data.scenes.length > 0) {
                  setSources(data.scenes[0].sources)
                }
            })
        }).catch(rejected => {
            setObsConnected(false)
            console.error('rejected', rejected)
        })
        // await obs.connect('ws://localhost:4444', '123456')
    }

    const disconnectObs = () => {
        setObsConnected(false);
        obs.disconnect();
    }

    const getSceneList = () => {
        console.log('scenes', scenes)
    }

    const getSourcesList = () => {
        console.log('sources', sources)
    }

    return (
      <>
        <Router>
          <ChakraProvider>
            <Flex>
              <Navbar />
            </Flex>

            <Routes>
              <Route path="/" element={
                <Home
                  obsConnected={obsConnected}
                  connectObs={connectObs}
                  disconnectObs={disconnectObs}
                  getSceneList={getSceneList}
                  getSourcesList={getSourcesList}
                />
              } />
              <Route path="/Settings" element={<Settings />} />
              <Route  />
            </Routes>
          </ChakraProvider>
        </Router>
      </>
    )
  
}

export default App;
