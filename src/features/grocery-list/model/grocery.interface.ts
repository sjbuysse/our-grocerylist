import { uuid } from '../../../utils';

export interface Grocery {
    id: string;
    name: string;
    completed: boolean;
    createdAt: number;
}

export const createGrocery = (name: string = '', id: string = uuid(), completed: boolean = false, createdAt = Date.now()): Grocery => ({
    name, completed, id, createdAt
})
