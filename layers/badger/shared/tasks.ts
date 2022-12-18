import { v4 as uuidv4 } from 'uuid';
import * as store from './store';

/* ---------------------------------- TYPES --------------------------------- */
type WithBaseFields<TaskSchema> = { 
    id: string,
    created_at: number,
    updated_at: number | null,
    deleted_at: number | null, 
} & TaskSchema;

type WithId<TaskSchema> = { 
    id: string, 
} & TaskSchema;

type WhereFilter<TaskSchema> = (record: WithBaseFields<TaskSchema>) => boolean;

/* ----------------------------------- API ---------------------------------- */
export async function get<TaskSchema>(
    ids: Array<string> = [],
): Promise<Array<WithBaseFields<TaskSchema> | null>> {
    const tasks = await store.getList<WithBaseFields<TaskSchema>>('badger.storage.tasks');
    const nonDeletedTasks = tasks
        .filter((task) => typeof task.deleted_at !== 'number');
    
    // if they supplied ids return tasks in the order in which the ids were supplied
    if (ids.length) {
        return ids.map((id) => {
            const taskIndex = nonDeletedTasks.map(t => t.id).indexOf(id);
            if (taskIndex === -1) {
                return null;
            }
            return nonDeletedTasks[taskIndex];
        })
    }

    // otherwise, just return all tasks in order
    return nonDeletedTasks
        .sort((a, b) => b.created_at - a.created_at)
};

export async function create<TaskSchema>(
    records: Array<TaskSchema>
): Promise<void> {
    const time = Date.now();
    const existingTasks = await get<TaskSchema>();
    const insertTasks = records.reverse().map((r, i) => ({
        ...r,
        id: uuidv4(),
        // We reverse records and decrement created_at by 1
        // to be sure we retrieve tasks in order created
        // they were created exactly.
        // Don't think it matters for the scope of this demo
        created_at: time - i,
        updated_at: null,
        deleted_at: null,
    }));
    await store.setList<WithBaseFields<TaskSchema>>(
        'badger.storage.tasks',
        insertTasks.concat(existingTasks),
    );
};

export async function update<TaskSchema>(
    records: Array<WithId<Partial<TaskSchema>>>
): Promise<Array<string | null>> {
    const tasks = await get<TaskSchema>();
    const tasksIds = tasks.map(t => t.id);
    const updatedTaskIds = records.map(r => {
        const taskIndex = tasksIds.indexOf(r.id);
        if (taskIndex === -1) {
            return null;
        }
        // mutate the tasks retrieved
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...r,
        };
        return r.id;
    });

    // store the mutated tasks
    await store.setList<WithBaseFields<TaskSchema>>('badger.storage.tasks', tasks);

    // return the list of ids mutated
    return updatedTaskIds;
};

export async function getWhere<TaskSchema>(
    filtersFunctions: Array<WhereFilter<TaskSchema>>
): Promise<Array<Array<WithBaseFields<TaskSchema>>>> {
    const tasks = await get<TaskSchema>();
    return filtersFunctions.map(fn => tasks.filter(fn))
};
