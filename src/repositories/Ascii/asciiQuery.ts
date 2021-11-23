import { FilterQuery } from "mongoose";
import Ascii from '../../domain/Ascii/ascii'

export default interface AsciiQuerybyName extends FilterQuery<Ascii> {
    artName: string;
}
