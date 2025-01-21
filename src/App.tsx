import React, { createContext } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ChatWithUnstructure from "./pages/ChatWithUnstructure";
import Queries from "./pages/Queries";
import DBConfig from "./pages/DBConfig";
import Layout from "./layout/index";
import SimpleAlert from "./components/Alert";
// -------------user stoty use case---------------
import Upload from "./pages/Upload";
import Config from "./pages/Config";

export const UserContext = createContext<any>(null);

function App() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
      window.location.replace("/#/config");
    } else {
      window.location.replace("/#/");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SimpleAlert />

      <Layout>
        <Routes key="authenticated">
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {user && <Route path="/sql-chat" element={<Chat />} />}
          {user && (
            <Route path="/data-chat" element={<ChatWithUnstructure />} />
          )}
          {user && <Route path="/query" element={<Queries />} />}
          {user && <Route path="/upload" element={<Upload />} />}
          {user && <Route path="/config" element={<Config />} />}
          {user && <Route path="/db-config" element={<DBConfig />} />}
        </Routes>
      </Layout>
    </UserContext.Provider>
  );
}

export default App;
