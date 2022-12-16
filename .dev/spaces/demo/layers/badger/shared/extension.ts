type DefaultRecordSchema = Record<string, any>;
type WithId<RecordSchema> = { id: string } & RecordSchema;
type CreateRecord<RecordSchema> = RecordSchema;
type WhereFilter<RecordSchema> = (record: WithId<RecordSchema>) => boolean;
type integer = number;

export const ALARM = 'badger.task';

// TODO: getListItems
export async function getListItems<RecordSchema = DefaultRecordSchema>(
    key: string, 
    ids: Array<string> = [],
): Promise<Array<WithId<RecordSchema>>> {

    return [];
};

// TODO: getListItemsWhere
export async function getListItemsWhere<RecordSchema = DefaultRecordSchema>(
    key: string, 
    filters: Array<WhereFilter<RecordSchema>>
): Promise<Array<WithId<RecordSchema>>> {

    return [];
};

// TODO: updateItems
export async function updateItems<RecordSchema = DefaultRecordSchema>(
    key: string, 
    records: Array<WithId<Partial<RecordSchema>>>
): Promise<void> {
    
};

// TODO: createItems
export async function createItems<RecordSchema = DefaultRecordSchema>(
    key: string, 
    records: Array<CreateRecord<RecordSchema>>
): Promise<void> {
    
};

// TODO: registerTaskAlarm
export async function registerTaskAlarm(duration: integer): Promise<void> {

};

// TODO: deleteTaskAlarm
export async function deleteTaskAlarm(): Promise<void> {

};

// TODO: extendTaskAlarm
export async function extendTaskAlarm(minutes: integer): Promise<integer> {

    return minutes;
};

// TODO: createTaskNotification
export async function createTaskNotification(): Promise<void> {
    
};