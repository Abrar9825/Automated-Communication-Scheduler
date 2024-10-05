import mongoose from 'mongoose'
const Connect_db = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb Connected ", con.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1)

    }

}

export default Connect_db