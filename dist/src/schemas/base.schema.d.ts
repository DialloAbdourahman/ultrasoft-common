import { Types } from 'mongoose';
export declare abstract class BaseSchema {
    deletedAt: Date | null;
    deleted: boolean;
    createdBy: Types.ObjectId | null;
    updatedBy: Types.ObjectId | null;
    deletedBy: Types.ObjectId | null;
}
