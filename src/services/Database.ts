import * as admin from "firebase-admin";
import { firestore } from "./firebase";
import { Operator, Direction } from "../types";

class Database<T> {
    protected _index: number;
    protected _collection: admin.firestore.CollectionReference<admin.firestore.DocumentData>;
    protected _uid?: string;
    protected _wheres: Array<
        [field: string, operator: Operator, value: T[keyof T]]
    >[];
    protected _startAfter: string[];
    protected _limit?: number;
    protected _orders: Array<[field: string, direction: Direction]>;

    constructor(dbName: string) {
        this._index = 0;
        this._collection = firestore.collection(dbName);
        this._uid = undefined;
        this._wheres = [];
        this._startAfter = [];
        this._limit = undefined;
        this._orders = [];
    }

    protected restartAllStates() {
        this._index = 0;
        this._uid = undefined;
        this._wheres = [];
        this._startAfter = [];
        this._limit = undefined;
    }

    public doc(uid: string) {
        this._uid = uid;
        return this;
    }

    public byUid(uid: string) {
        return this.doc(uid);
    }

    public uid(uid: string) {
        return this.doc(uid);
    }

    public getByUid(uid: string) {
        this.doc(uid);
        return this.getFirst();
    }

    public where(field: string, operator: Operator, value: T[keyof T]) {
        if (!this._wheres[this._index]) this._wheres[this._index] = [];

        this._wheres[this._index].push([field, operator, value]);

        return this;
    }

    public and(field: string, operator: Operator, value: T[keyof T]) {
        return this.where(field, operator, value);
    }

    public or(field: string, operator: Operator, value: T[keyof T]) {
        this._index++;
        return this.where(field, operator, value);
    }

    public startAfter(uid: string) {
        this._startAfter.push(uid);
        return this;
    }

    public limit(limit: number) {
        this._limit = limit;
        return this;
    }

    public orderBy(field: string, direction: Direction) {
        this._orders.push([field, direction]);
        return this;
    }

    public async update(updates: Partial<T>) {
        if (!this._uid) throw new Error("Database.uid required");

        for (const key in updates) {
            if (updates[key] === undefined) delete updates[key];
        }

        await this._collection
            .doc(this._uid)
            .update({ ...updates, uid: this._uid });
        this.restartAllStates();

        return new Date();
    }

    public async delete() {
        if (!this._uid) throw new Error("Database.uid required");
        await this._collection.doc(this._uid).delete();
        this.restartAllStates();
        return new Date();
    }

    public async create(data: T) {
        if (!this._uid) throw new Error("Database.uid required");

        for (const key in data) {
            if (data[key] === undefined) delete data[key];
        }

        await this._collection.doc(this._uid).set({ ...data, uid: this._uid });
        this.restartAllStates();
        return new Date();
    }

    public async get() {
        if (this._uid) {
            const uid = this._uid;
            const doc = await this._collection.doc(uid).get();
            const data = doc.data();

            this.restartAllStates();

            return [data as T].filter(Boolean);
        }

        const results = [];

        for (let i = 0; i < this._wheres.length; i++) {
            const whereSet = this._wheres[i];
            const startAfter = this._startAfter[i];

            let lastDoc = undefined;
            if (startAfter) {
                lastDoc = await this._collection.doc(startAfter).get();
            }

            do {
                let query: admin.firestore.Query<admin.firestore.DocumentData> =
                    this._collection;

                for (const where of whereSet) {
                    const [field, operator, value] = where;
                    query = query.where(field as string, operator, value);
                }

                for (const order of this._orders) {
                    const [field, direction] = order;
                    query = query.orderBy(field as string, direction);
                }

                if (lastDoc) {
                    query = query.startAfter(lastDoc);
                    lastDoc = undefined;
                }

                query = query.limit(1000);

                const { docs } = await query.get();

                for (const doc of docs) {
                    if (
                        this._limit !== undefined &&
                        results.length >= this._limit
                    ) {
                        lastDoc = undefined;
                        break;
                    }
                    results.push(doc.data());
                    lastDoc = doc;
                }
            } while (lastDoc);
        }

        this.restartAllStates();

        return results as T[];
    }

    public watch(listener: (result: T[]) => void) {
        let query = this._collection;

        if (this._uid) {
            // @ts-ignore
            query = query.doc(this._uid);
        }

        for (const where of this._wheres) {
            const [field, operator, value] = where;
            // @ts-ignore
            query = query.where(field, operator, value);
        }

        this.restartAllStates();

        return query.onSnapshot((snapshot) => {
            const { docs = [] } = snapshot;
            const result: T[] = [];

            for (const doc of Array.from(docs)) {
                const data = doc.data() as T;
                result.push(data);
            }

            listener(result);
        });
    }

    public async getFirst(): Promise<T | undefined> {
        const results = await this.get();
        return results[0];
    }

    public async getLast(): Promise<T | undefined> {
        const results = await this.get();
        return results[results.length - 1];
    }

    public async exists(): Promise<boolean> {
        const first = await this.getFirst();
        return !!first;
    }
}

export default Database;
export { Database };
