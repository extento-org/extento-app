import * as extension from './shared/extension';

type TaskStatus = 'GAVE_UP' | 'COMPLETE' | 'IN_PROGRESS';
type TaskMode = 'WORK' | 'BROWSE';

export type TasksheetRecordSchema = {
    id: string,
    text: string,
    created_at: number,
    updated_at: number | null,
    deleted_at: number | null,
    status: TaskStatus,
    mode: TaskMode,
};

// TODO: worker_api.getBrowseUrls
export const getBrowseUrls = async (): Promise<Array<string>> => {
    return [];
};

// TODO: worker_api.overwriteBrowseUrls
export const overwriteBrowseUrls = async (urls: Array<string>): Promise<void> => {

};

// TODO: worker_api.startWorking
export const startWorking = async (): Promise<void> => {

};

// TODO: worker_api.pauseWorking
export const pauseWorking = async (): Promise<void> => {

};

// TODO: worker_api.createTasksheet
export const createTasksheet = async (
    text: string,
    minutes: number,
): Promise<void> => {

};

// TODO: worker_api.editTasksheet
export const editTasksheet = async (
    id: string,
    text: string,
): Promise<void> => {

};

// TODO: worker_api.extendTasksheet
export const extendTasksheet = async (
    id: string,
    minutes: number,
): Promise<void> => {

};

// TODO: worker_api.archiveTasksheet
export const archiveTasksheet = async (
    id: string,
    status: TaskStatus,
): Promise<void> => {

};

// TODO: worker_api.deleteTasksheet
export const deleteTasksheet = async (id: string): Promise<void> => {

};

// TODO: worker_api.getArchivedTasksheets
export const getArchivedTasksheets = async (id: string): Promise<Array<TasksheetRecordSchema>> => {
    return [];
};