import { model } from "mongoose";
import Ascii from "./ascii";
import AsciiSchema from "./asciiSchema";

const AsciiModel = model<Ascii>('ascii', AsciiSchema);
export default AsciiModel;