import { Schema } from "mongoose";
import Ascii from "./ascii";

const AsciiSchema = new Schema<Ascii>({
    userName: { type: String, required: true },
    artName: { type: String, required: true },
    art: { type: String, required: true },
    date: { type: Date, required: true },
})
export default AsciiSchema;