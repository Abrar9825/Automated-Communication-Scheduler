import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    dateAndTime: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['call', 'sms'] 
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'complete'],
        default: "pending"
    }
}, {
    timestamps: true
});


const ScheduleData = mongoose.model('ScheduleData', ScheduleSchema)
export default ScheduleData;