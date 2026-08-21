import { createSlice } from '@reduxjs/toolkit';

export const TOUR_STEPS = {
  WELCOME: 0,
  CREATE_GOAL: 1,
  ADD_IDEA: 2,
  LIKE_IDEA: 3,
  MOVE_TO_PLANNED: 4,
  GO_TO_OUTCOME: 5,
  CREATE_METRIC: 6,
  ADD_CHECKIN: 7,
  VIEW_METRIC_CHART: 8,
  OPEN_DISCUSSION: 9,   
  OPEN_AI_ASSISTANT: 10,
};

const tourSlice = createSlice({
  name: 'tour',
  initialState: {
    active: false,
    stepIndex: TOUR_STEPS.WELCOME,
    currentGoalId: null,
    currentIdeaId: null,
    showSkipConfirm: false,
  },
  reducers: {
    startTour: (state) => {
      state.active = true;
      state.stepIndex = TOUR_STEPS.WELCOME;
    },
    advanceTour: (state) => {
      state.stepIndex += 1;
    },
    setTourGoalId: (state, action) => {
      state.currentGoalId = action.payload;
    },
    setTourIdeaId: (state, action) => {
      state.currentIdeaId = action.payload;
    },
    skipTour: (state) => {
      state.active = false;
    },
    finishTour: (state) => {
      state.active = false;
    },

  },
});

export const { startTour, advanceTour, setTourGoalId, setTourIdeaId, skipTour, finishTour } = tourSlice.actions;
export default tourSlice.reducer;