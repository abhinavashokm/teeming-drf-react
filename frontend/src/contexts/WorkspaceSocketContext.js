import { createContext, useContext } from "react";


export const WorkspaceSocketContext = createContext(null);
export const useWorkspaceSocketContext = () => useContext(WorkspaceSocketContext);