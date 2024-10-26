import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
        name: 'tasks',
        initialState: {
                tasks: [],
                loading: false,
                error: null,
        },
});

export default taskSlice.reducer;
