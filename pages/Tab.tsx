import React from 'react';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
};

function Controls(props: {
    task: hooks.InProgressTask,
    onToggleBlacklistForm: () => void,
    onToggleCreateForm: () => void,
    onExtendTaskByFiveMinutes: () => void,
    onGiveUpTask: () => void,
    isLoadingGivingUp: boolean,
    isLoadingExtendingTask: boolean,
}) {
    const {
        task,
        onToggleBlacklistForm,
        onToggleCreateForm,
        onExtendTaskByFiveMinutes,
        onGiveUpTask,
        isLoadingExtendingTask,
        isLoadingGivingUp,
    } = props;
    return (
        <div>
            <button onChange={onToggleBlacklistForm}>Edit Blacklist</button>
            {!!task ? null : <button onChange={onToggleCreateForm}>Create Task</button>}
            {!task ? null : <button disabled={isLoadingExtendingTask} onChange={onExtendTaskByFiveMinutes}>Take 5</button>}
            {!task ? null : <button disabled={isLoadingGivingUp} onChange={onGiveUpTask}>Give Up</button>}
        </div>
    );
};

function CreateTaskForm(props: { 
    onCreate: () => void,
    onCancel: () => void,
}) {
    const { onCreate, onCancel } = props;
    const mutation = hooks.useCreateTask();

    return (
        <div>
            CREATE TASK FOR HERE
        </div>
    );
};

function BlacklistForm(props: {
    onCancel: () => void,
    onOverwrite: () => void,
}) {
    const mutation = hooks.useOverwriteBlacklist();

    return (
        <div>
            EDIT BLACKLIST HERE
        </div>
    );
};

function EditActiveTask(props: {
    onCancel: () => void,
    onSave: () => void,
}) {
    const { onCancel, onSave } = props;
    const { isLoading: isLoadingTask, task } = hooks.useTask();
    const mutation = hooks.useEditTask();

    return (
        <div>
            EDIT TASK HERE
        </div>
    );
};

function ActiveTask(props: { task:  hooks.InProgressTask, onShowEditForm: () => void }) {
    const { onShowEditForm, task } = props;

    return (
        <div>
            {task.text}
        </div>
    );
};

function ArchivedTasks() {
    const { isLoading, archivedTasks } = hooks.useArchivedTasksQuery();

    if (isLoading) {
        return null;
    }
    return (
        <div>
            {archivedTasks.length} archived tasks go here
        </div>
    );
};

export default function Tab() {
    /* ---------------------------------- STATE --------------------------------- */
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const [showBlacklistForm, setShowBlacklistForm] = React.useState(false);
    const [showEditForm, setShowEditForm] = React.useState(false);

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const { isLoading: isLoadingActiveTask, task } = hooks.useTask();
    const extendTaskMutation = hooks.useExtendTask();
    const giveUpTaskMutation = hooks.useGiveUpTask();

    /* -------------------------------- HANDLERS -------------------------------- */
    const handleToggleCreateForm = () => {
        setShowBlacklistForm(false);
        setShowCreateForm(last => !last);
    };
    const handleToggleBlacklistForm = () => {
        setShowCreateForm(false);
        setShowBlacklistForm(last => !last);
    };
    const handleShowEditForm = () => {
        setShowEditForm(true);
    };
    const handleOnSaveEdit = () => {
        setShowEditForm(false);
    };
    const handleOnCancelEdit = () => {
        setShowEditForm(false);
    };
    const handleOnCreate = () => {
        setShowCreateForm(false);
    };
    const handleOnOverwriteBlacklist = () => {
        setShowBlacklistForm(false);
    };
    const handleOnCancelCreateTask = () => {
        setShowCreateForm(false);
    };
    const handleOnCancelBlacklist = () => {
        setShowBlacklistForm(false);
    };
    const handleOnExtendTaskByFiveMinutes = () => {
        extendTaskMutation.mutate(5);
    };
    const handleOnGiveUpTask = () => {
        extendTaskMutation.mutate(5);
    };

    /* --------------------------------- RENDER --------------------------------- */
    return (
        <ReactQueryProvider>
            {isLoadingActiveTask ? null : (
                <Container>
                    <>
                        <Controls
                            task={task}
                            isLoadingGivingUp={giveUpTaskMutation.isLoading}
                            isLoadingExtendingTask={extendTaskMutation.isLoading}
                            onGiveUpTask={handleOnGiveUpTask}
                            onExtendTaskByFiveMinutes={handleOnExtendTaskByFiveMinutes}
                            onToggleBlacklistForm={handleToggleBlacklistForm}
                            onToggleCreateForm={handleToggleCreateForm}/>
                        {showCreateForm ? (
                            <CreateTaskForm
                                onCancel={handleOnCancelCreateTask}
                                onCreate={handleOnCreate}/>
                        ) : null}
                        {showBlacklistForm ? (
                            <BlacklistForm 
                                onCancel={handleOnCancelBlacklist}
                                onOverwrite={handleOnOverwriteBlacklist} />
                        ) : null}
                        {!!task ? (
                            showEditForm ? (
                                <EditActiveTask
                                    onCancel={handleOnCancelEdit}
                                    onSave={handleOnSaveEdit}/>
                            ) : (
                                <ActiveTask
                                    task={task}
                                    onShowEditForm={handleShowEditForm}/>
                            )
                        ) : null}
                        <ArchivedTasks />
                    </>
                </Container>  
            )}
        </ReactQueryProvider>
    );
};
