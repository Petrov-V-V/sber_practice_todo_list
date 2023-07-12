import { createSlice } from '@reduxjs/toolkit';

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    statuses: [],
    repetitions: [],
    priorities: [],
    filteredTasks: [],
    searchQuery: '',
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.filteredTasks = action.payload;
      state.searchQuery = '';
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
    searchTasks: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredTasks = state.tasks.filter((task) =>
      task.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  }
});

export const {
  setTasks,
  setStatuses,
  setRepetitions,
  setPriorities,
  searchTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
