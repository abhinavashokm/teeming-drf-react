import { createSlice } from "@reduxjs/toolkit";


const workspaceSlice = createSlice({
    'name': 'workspace',
    'initialState': {
        'workspaces': null,
        'current_workspace': null,
        'role': null,
    },
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload.workspaces
            state.current_workspace_workspace = action.payload.lastWorkspace
        },
        setCurrentWorkspace: (state, action) => {
            state.current_workspace = action.payload
        },
        setRole: (state, action) => {
  
            state.role = action.payload
        }
    }
})


export const { setWorkspaces, setCurrentWorkspace, setRole } = workspaceSlice.actions
export default workspaceSlice.reducer