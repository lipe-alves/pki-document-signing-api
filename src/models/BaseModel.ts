import { toDate, generateUid } from "../utils";

class BaseModel {
    public uid: string;
    public createdAt: Date;
    public createdBy: string;
    public deleted: boolean;
    public deletedAt?: Date;
    public deletedBy?: string;

    constructor(data: Partial<BaseModel> = {}) {
        const {
            uid = generateUid(),
            createdAt = new Date(),
            createdBy = "system",
            deleted = false,
        } = data;

        this.uid = uid;
        this.createdAt = toDate(createdAt);
        this.createdBy = createdBy;
        this.deleted = !!deleted;
    }
}

export default BaseModel;
export { BaseModel };
