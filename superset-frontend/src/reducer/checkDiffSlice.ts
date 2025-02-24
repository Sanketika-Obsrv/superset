import { createSlice } from '@reduxjs/toolkit';

const checkDiffSlice = createSlice({
  name: 'checkDiff',
  initialState: {
    value: false,
  },
  reducers: {
    setCheckDiff: (state, action) => {
      state.value = action.payload; 
    },
  },
});

export const { setCheckDiff } = checkDiffSlice.actions;
export default checkDiffSlice.reducer;
