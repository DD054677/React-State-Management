import { act } from '@testing-library/react';
import { vi,beforeEach } from 'vitest';
const {create: actualCreate}=await vi.importActual('zustand');

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set();

//when creating a store, we get its initial state, create a reset function and add it
export const create =(createState)=> {
    const store = actualCreate(createState);
    const initialState =store.getState();
    storeResetFns.add (() => store.setState(initialState,true));
    return store;
};

//Reset all stores afteer each test run
beforeEach (() => {
    act(() => storeResetFns.forEach ((resetFn) => resetFn()));
});