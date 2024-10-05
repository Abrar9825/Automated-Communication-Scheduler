import mongoose from "mongoose";
import ScheduleData from "../model/schedule.model.js";

export const createTask = async (req, res) => {
    const schedule = req.body
    if (!schedule.dateAndTime || !schedule.message || !schedule.number || !schedule.type || !schedule.status) {
        return res.status(400).json({ success: false, message: "Plese Provide All Fields" });
    }

    const newSchedule = new ScheduleData(schedule)
    try {
        await newSchedule.save()
        return res.status(201).json({ success: true, message: "Your Task is Schedule" });
    } catch (error) {
        console.log("Error In Create Task : ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getTask = async (req, res) => {
    try {
        const schedule = await ScheduleData.find({})
        return res.status(200).json({ success: true, data: schedule });
    } catch (error) {
        console.log("Error in Fetching Product", error);
        res.status(500).json({ success: false, message: "Server Error" });

    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const schedule = req.body

    // check if id is valid or not 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "InValid Product ID" });
    }

    try {
        const updatedSchedule = await ScheduleData.findByIdAndUpdate(id, schedule, { new: true })
        return res.status(200).json({ success: true, data: updatedSchedule });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params

    // check for id is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "InValid Product ID" });
    }
    try {
        await ScheduleData.findByIdAndDelete(id)
        return res.status(200).json({ success: true, message: "Task Is Deleted" });
    } catch (error) {
        console.log("Error Deleteing a Product", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }


}

