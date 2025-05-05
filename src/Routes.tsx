import React from "react";
import { Route } from "react-router-dom";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ChatWithUnstructure from "./pages/ChatWithUnstructure";
import Queries from "./pages/Queries";
import DBConfig from "./pages/DBConfig";
import Upload from "./pages/Upload";
import Config from "./pages/Config";
import Logs from "./pages/Logs";
import AgentChat from "./pages/AgentChat";
import BUSINESS_INSIDE from "./pages/Agents/index";
import Documentation from "./pages/Documentation";

export const AuthenticatedRoutes = (user: any) => {
  if (!user) return null;

  return (
    <>
      <Route path="/sql-chat" element={<Chat />} />
      <Route path="/agent-sql-chat" element={<AgentChat />} />
      <Route path="/data-chat" element={<ChatWithUnstructure />} />
      <Route path="/query" element={<Queries />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/config" element={<Config />} />
      <Route path="/db-config" element={<DBConfig />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/business-inside" element={<BUSINESS_INSIDE />} />
      <Route path="/documentation" element={<Documentation />} />
    </>
  );
};

export const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
  </>
);
