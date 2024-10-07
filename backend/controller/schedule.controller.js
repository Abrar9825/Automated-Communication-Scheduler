import mongoose from "mongoose";
import ScheduleData from "../model/schedule.model.js";
import twilio from "twilio";
import schedule from "node-schedule";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const messageAttempts = new Map();

const handleMessage = async (type, number, message, scheduleId) => {
    console.log(`Handling message of type: ${type} for number: ${number}`);

    if (!messageAttempts.has(number)) {
        messageAttempts.set(number, new Set());
    }
    const messageTypes = messageAttempts.get(number);

    if (!messageTypes.has(type)) {
        messageTypes.add(type);
        if (type === 'call') {
            await handleCall(number, message, scheduleId); // Pass the scheduleId
        } else if (type === 'sms') {
            await handleSMS(number, message, scheduleId); // Pass the scheduleId
        }
    } else {
        console.log(`Message of type ${type} already scheduled for number: ${number}`);
    }
};

const handleCall = async (number, message, scheduleId) => {
    try {
        const call = await client.calls.create({
            to: number,
            from: twilioPhoneNumber,
            twiml: `<Response><Say>${message}</Say></Response>`
        });
        console.log(`Call scheduled with SID: ${call.sid}`);

        setTimeout(async () => {
            try {
                const callInfo = await client.calls(call.sid).fetch();
                console.log('Call Status:', callInfo.status);
                const updateStatus = callInfo.status === 'completed' ? 'completed' : 'pending';
                await ScheduleData.findByIdAndUpdate(scheduleId, { status: updateStatus });
                console.log(`Call status updated to: ${updateStatus}`);
            } catch (err) {
                console.error('Error fetching call status:', err);
            }
        }, 10000);
    } catch (err) {
        console.error('Error scheduling call:', err);
    }
};

const handleSMS = async (number, message, scheduleId) => {
    try {
        const messageInfo = await client.messages.create({
            to: number,
            from: twilioPhoneNumber,
            body: message
        });
        console.log(`SMS sent with SID: ${messageInfo.sid}`);

        // Update status to 'completed' using scheduleId
        await ScheduleData.findByIdAndUpdate(scheduleId, { status: 'completed' });
        console.log(`SMS status updated to: completed`);
    } catch (err) {
        console.error('Error sending SMS:', err);
        // Update status as pending if there was an error
        await ScheduleData.findByIdAndUpdate(scheduleId, { status: 'pending' });
    }
};

export const createTask = async (req, res) => {
    const { dateAndTime, message, number, type } = req.body;
    if (!dateAndTime || !message || !number || !type) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    console.log(`Scheduling ${type}: ${message} for ${number} at ${dateAndTime}`);

    const newSchedule = new ScheduleData({ dateAndTime, message, number, type, status: 'pending' });
    try {
        await newSchedule.save();

        // Schedule the message
        const scheduledDate = new Date(dateAndTime);
        schedule.scheduleJob(scheduledDate, () => {
            console.log(`Executing scheduled task for: ${message} to ${number} type ${type}`);
            handleMessage(type, number, message, newSchedule._id); // Pass the scheduleId
        });

        return res.status(201).json({ success: true, message: "Your task is scheduled" });
    } catch (error) {
        console.error("Error in creating task: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getTask = async (req, res) => {
    try {
        const schedules = await ScheduleData.find({});
        return res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        console.error("Error in fetching tasks", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid task ID" });
    }

    try {
        const existingSchedule = await ScheduleData.findById(id);

        if (!existingSchedule) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        console.log("Updating schedule with fields:", updatedFields);

        const updatedSchedule = await ScheduleData.findByIdAndUpdate(id, {
            ...existingSchedule.toObject(),
            ...updatedFields
        }, { new: true });

        if (updatedFields.dateAndTime) {
            const scheduledDate = new Date(updatedFields.dateAndTime);
            schedule.scheduleJob(scheduledDate, () => {
                console.log(`Executing rescheduled task for: ${updatedSchedule.message} to ${updatedSchedule.number} of type ${updatedSchedule.type}`);
                handleMessage(updatedSchedule.type, updatedSchedule.number, updatedSchedule.message, updatedSchedule._id);
            });
        }

        return res.status(200).json({ success: true, data: updatedSchedule });
    } catch (error) {
        console.error("Error updating task: ", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid task ID" });
    }

    try {
        await ScheduleData.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Task is deleted" });
    } catch (error) {
        console.error("Error deleting a task: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
