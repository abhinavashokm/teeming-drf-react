import { createSlice } from "@reduxjs/toolkit";


const workspaceSlice = createSlice({
    'name': 'workspace',
    'initialState': {
        'workspaces': null,
        'last_workspace': null,
    },
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload.workspaces
            state.last_workspace = action.payload.lastWorkspace
        },
    }
})


export const { setWorkspaces } = workspaceSlice.actions
export default workspaceSlice