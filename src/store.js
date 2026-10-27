import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer'; 

const store = (set) => ({
    tasks: [],
    draggedTask: null,
    tasksInOngoing: 0,

    addTask: (title, state) =>
        set(
            produce((storeState) => {
                storeState.tasks.push({ title, state });
            }),
            false,
            'addTask'
        ),

    deleteTask: (title) =>
        set((storeState) => ({
            tasks: storeState.tasks.filter((task) => task.title !== title),
        })),

    setDraggedTask: (title) => set({ draggedTask: title }),

    moveTask: (title, state) =>
        set((storeState) => ({
            tasks: storeState.tasks.map((task) =>
                task.title === title ? { title, state } : task
            ),
        })),
});

const log = (config) => (set, get, api) =>
    config(
        (...args) => {
            console.log(args);
            set(...args);
        },
        get,
        api
    );

export const useStore = create(
    log(persist(devtools(subscribeWithSelector(store)), { name: 'store' }))
);

useStore.subscribe(
    (state) => state.tasks,
    (newTasks) => {
        useStore.setState({
            tasksInOngoing: newTasks.filter((task) => task.state === 'ONGOING') // <-- 2. newStore အစား newTasks ကို သုံးရန်
                .length,
        });
    }
);