import * as alarm from '@app.shared/alarm';
import * as blacklist from '@app.shared/blacklist';
import * as tasks from '@app.shared/tasks';

/* ---------------------------------- TYPES --------------------------------- */
type TaskStatus = 'FAILED' | 'GAVE_UP' | 'COMPLETE' | 'IN_PROGRESS' | 'NOT_FOUND';
type TaskMode = 'WORK' | 'BROWSE' | 'ARCHIVED' | 'NOT_FOUND';
type TasksheetRecordSchema = {
    text: string,
    status: TaskStatus,
    mode: TaskMode,
};
type Task = TasksheetRecordSchema & { due: number };

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
export const newTab = async (): Promise<void> => {
    await chrome.tabs.create({});
};

export const getBlacklist = async (): Promise<Array<string>> => {
    const urls = await blacklist.get();
    return urls;
};

export const overwriteBlacklist = async (urls: Array<string>): Promise<void> => {
    return blacklist.overwrite(urls);
};

export const getInProgressTask = async (): Promise<Task | null> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        return null;
    }
    const due = await alarm.getDueTime();
    const { text, status, mode } = activeTask;
    return {
        text, 
        status, 
        mode,
        due,
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
        mode: 'WORK',
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
        mode: 'WORK',
    }]);
    await alarm.create(minutes);
};

export const edit = async (
    text: string,
): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        text,
    }]);
};

export const extend = async (minutes: number): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await alarm.extend(minutes);
};

export const failed = async (): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await alarm.remove();
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        status: 'FAILED',
        mode: 'ARCHIVED',
    }]);
};

export const complete = async (): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await alarm.remove();
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        status: 'COMPLETE',
        mode: 'ARCHIVED',
    }]);
    
    return;
};

export const giveUp = async (): Promise<void> => {
    const activeTask = await getActiveTask();
    if (!activeTask) {
        throw new Error('no active task exists');
    }
    await alarm.remove();
    await tasks.update<TasksheetRecordSchema>([{
        id: activeTask.id,
        status: 'GAVE_UP',
        mode: 'ARCHIVED',
    }]);
};

export const getArchived = async () => {
    const [archivedTasks] = await tasks.getWhere<TasksheetRecordSchema>([
        (task) => task.mode === 'ARCHIVED',
    ]);
    return archivedTasks;
};