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
    onToggleBlacklistForm: () => void,
    onToggleCreateForm: () => void
}) {
    const {
        onToggleBlacklistForm,
        onToggleCreateForm,
    } = props;
    return (
        <div>
            
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
            
        </div>
    );
};

function ActiveTask(props: { task:  hooks.InProgressTask, onShowEditForm: () => void }) {
    const { onShowEditForm, task } = props;

    return (
        <div>
            
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

    /* --------------------------------- RENDER --------------------------------- */
    return (
        <ReactQueryProvider>
            {isLoadingActiveTask ? null : (
                <Container>
                    <>
                        <Controls
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
