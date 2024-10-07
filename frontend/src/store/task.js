import { create } from 'zustand';

export const useTaskStore = create((set) => ({
    tasks: [],
    setTask: (tasks) => set({ tasks }),
    createTask: async (newTask) => {
        // Validation before making the fetch request
        if (!newTask.dateAndTime || !newTask.message || !newTask.number || !newTask.type) {
            return { success: false, message: "Please provide all fields" }; // Return error without using res
        }

        try {
            const response = await fetch('http://localhost:5000/api/schedules', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || "Error adding task" };
            }

            const data = await response.json();
            set((state) => ({ tasks: [...state.tasks, data.data] }));

            return { success: true, message: "Task Added Successfully" };
        } catch (error) {
            console.error('Error:', error);
            return { success: false, message: "Network Error" };
        }
    },
    showAllTask: async () => {
        const res = await fetch('http://localhost:5000/api/schedules')
        const data = await res.json()
        set({ tasks: data.data })
    },
    deleteTask: async (tid) => {
        const res = await fetch(`http://localhost:5000/api/schedules/${tid}`, {
            method: 'DELETE'
        })
        const data = await res.json()
        if (!data.success) return { success: false, message: data.message }

        // for immiditly Update UI
        set((state) => ({ tasks: state.tasks.filter(task => task._id !== tid) }))
        if (data.success) return { success: true, message: "Task Deleted" }
    },
    updateTask: async (tid, updatedTask) => {
        const res = await fetch(`http://localhost:5000/api/schedules/${tid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Correctly specify headers
            },
            body: JSON.stringify(updatedTask),
        })
        const data = await res.json(); // Await the JSON response
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({ tasks: state.tasks.map(task => task._id === tid ? data.data : task) }));
        return { success: true, message: "Task updated successfully" }; // Retu
    }
}));
