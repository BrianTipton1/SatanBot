import { injectable, unmanaged } from 'inversify';
import { Model, FilterQuery, EnforceDocument, Types, UpdateWriteOpResult } from 'mongoose';

@injectable()
export default class MongoBase<TItem> {
    private _model: Model<TItem>;

    constructor(@unmanaged() schemaModel: Model<TItem>) {
        this._model = schemaModel;
    }

    /**
     *
     * @param Item Entity to post to Mongo
     * @returns Promise<mongoose.EnforceDocument<TItem, {}>>
     */
    protected async create(item: TItem): Promise<EnforceDocument<TItem, {}>> {
        return await this._model.create(item);
    }

    /**
     *
     * @param _id id of the entiry to get
     * @returns Promise<mongoose.EnforceDocument<TItem, {}> | null>
     */
    protected async getById(_id: string): Promise<EnforceDocument<TItem, {}> | null> {
        return await this._model.findById(this.toObjectId(_id));
    }

    /**
     *
     * @param query query of the objects to update
     * @param item Updated Item
     * @returns Promise<mongoose.UpdateWriteOpResult>
     */
    protected async update(query: FilterQuery<TItem>, item: TItem): Promise<UpdateWriteOpResult> {
        return await this._model.updateMany(query, item);
    }

    /**
     *
     * @param query query of objects to be deleted
     * @returns Promise<{ok?: number | undefined;n?: number | undefined;} & {deletedCount?: number | undefined;}>
     */
    protected async delete(
        query: FilterQuery<TItem>,
    ): Promise<{ ok?: number | undefined; n?: number | undefined } & { deletedCount?: number | undefined }> {
        return await this._model.deleteMany(query);
    }

    /**
     *
     * @param query query pattern of objects to get
     * @returns Promise<mongoose.EnforceDocument<TItem, {}>[]>
     */
    protected async getMany(query: FilterQuery<TItem>): Promise<EnforceDocument<TItem, {}>[]> {
        return await this._model.find(query);
    }

    /**
     *
     * @param _id id of the obejct
     * @returns mongoose.Types.ObjectId
     */
    protected toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}
