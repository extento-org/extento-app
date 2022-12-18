import * as alarm from './shared/alarm';
import * as browseUrlsStore from './shared/browseUrlsStore';
import * as tasks from './shared/tasks';

/* ---------------------------------- TYPES --------------------------------- */
type TaskStatus = 'FAILED' | 'GAVE_UP' | 'COMPLETE' | 'IN_PROGRESS';
type TaskMode = 'WORK' | 'BROWSE' | 'ARCHIVED';
type TasksheetRecordSchema = {
    text: string,
    status: TaskStatus,
    mode: TaskMode,
};

/* --------------------------------- HELPERS -------------------------------- */
const getActiveTask = async () => {
    const [
        [activeTask = null]
    ] = await tasks.getWhere<TasksheetRecordSchema>([
        (task) => task.status === 'IN_PROGRESS' && task.mode !== 'ARCHIVED'
    ]);
    return activeTask;
}

/* ----------------------------------- API ---------------------------------- */
export const getBrowseUrls = async (): Promise<Array<string>> => {
    return browseUrlsStore.get();
};

export const overwriteBrowseUrls = async (urls: Array<string>): Promise<void> => {
    return browseUrlsStore.overwrite(urls);
};

export const getInProgressTask = async (): Promise<TasksheetRecordSchema | null> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        return null;
    }
    const { text, status, mode } = activeTask;
    return {
        text, 
        status, 
        mode,
    };
};

export const resume = async (): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await alarm.resume();
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        mode: 'WORK'
    }]);
};

export const pause = async (): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await alarm.pause();
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        mode: 'BROWSE'
    }]);
};

export const create = async (
    text: string,
    minutes: number,
): Promise<void> => {
    await tasks.create<TasksheetRecordSchema>([{
        text,
        status: 'IN_PROGRESS',
        mode: 'WORK'
    }]);
    await alarm.create(minutes);
};

export const edit = async (
    id: string,
    text: string,
): Promise<void> => {
    await tasks.update<TasksheetRecordSchema>([{
        id,
        text
    }]);
};

export const extend = async (minutes: number): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    alarm.extend(minutes);
};

export const failed = async () => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        status: 'FAILED',
        mode: 'ARCHIVED',
    }]);
};

export const complete = async () => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        status: 'COMPLETE',
        mode: 'ARCHIVED',
    }]);
};

export const giveUp = async (): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        status: 'GAVE_UP',
        mode: 'ARCHIVED',
    }]);
};

export const getArchived = async (): Promise<Array<TasksheetRecordSchema>> => {
    const [archivedTasks] = await tasks.getWhere<TasksheetRecordSchema>([
        (task) => task.mode === 'ARCHIVED' 
    ]);
    return archivedTasks;
};