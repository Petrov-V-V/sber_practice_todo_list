import { createSlice } from '@reduxjs/toolkit';

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    statuses: [],
    repetitions: [],
    priorities: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setStatuses: (state, action) => {
      state.statuses = action.payload;
    },
    setRepetitions: (state, action) => {
      state.repetitions = action.payload;
    },
    setPriorities: (state, action) => {
      state.priorities = action.payload;
    },
  }
});

export const {
  setTasks,
  setStatuses,
  setRepetitions,
  setPriorities
} = taskSlice.actions;

export default taskSlice.reducer;
