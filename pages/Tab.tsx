import React from 'react';
import dayjs from 'dayjs';
import ReactQueryProvider from '@app.shared/ReactQueryProvider';
import * as hooks from '@app.shared/hooks';
import Countdown from '@app.shared/components/Countdown';

function Container(props: { children: React.ReactElement }) {
    const { children } = props;
    return (
        <div className="flex flex-col items-center w-full">
            {children}
        </div>
    );
};

function Controls(props: {
    task: hooks.InProgressTask,
    onToggleBlacklistForm: () => void,
    onToggleCreateForm: () => void,
}) {
    const {
        task,
        onToggleBlacklistForm,
        onToggleCreateForm,
    } = props;
    
    /* ------------------------------ REACT QUERIES ----------------------------- */
    const extendTaskMutation = hooks.useExtendTask();
    const giveUpMutation = hooks.useGiveUpTask();

    /* -------------------------------- HANDLERS -------------------------------- */
    const handleExtend = () => {
        extendTaskMutation.mutate(5);
    };
    const handleGiveUp = () => {
        giveUpMutation.mutate();
    };

    /* --------------------------------- RENDER --------------------------------- */
    return (
        <div className='flex space-x-5'>
            <button 
                disabled={!!task}
                onClick={() => onToggleCreateForm()}
                className='px-4 btn btn-secondary'>
                    Create Task
            </button>
            <button 
                onClick={() => onToggleBlacklistForm()}
                className='px-4 btn btn-primary'>
                    Edit Blacklist
            </button>
            <button 
                disabled={!task || extendTaskMutation.isLoading}
                onClick={() => handleExtend()}
                className='px-4 btn btn-secondary'>
                    Add 5 Minutes
            </button>
            <button
                disabled={!task || giveUpMutation.isLoading}
                onClick={() => handleGiveUp()}
                className='px-4 btn btn-secondary'>
                    Give Up
            </button>
        </div>
    );
};

function CreateTaskForm(props: { 
    onCreate: () => void,
    onCancel: () => void,
}) {
    const { onCreate, onCancel } = props;

    /* ---------------------------------- STATE --------------------------------- */
    const [text, setText] = React.useState('');
    const [minutes, setMinutes] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const mutation = hooks.useCreateTask();

    /* -------------------------------- HANDLERS -------------------------------- */
    const handleSave = () => {
        const fixedText = text.trim();
        const fixedMinutes = Number(minutes)
        if (fixedText === '') {
            setErrorMessage('You must include some text');
            return;
        }
        if (Number.isNaN(Number(fixedMinutes))) {
            setErrorMessage('You must enter a valid number');
            return;
        }
        if (fixedMinutes === 0) {
            setErrorMessage('You must include a non-zero amount of minutes');
            return;
        }
        mutation.mutate({
            text: text,
            minutes: fixedMinutes,
        }, {
            onSuccess: onCreate,
            onError: () => setErrorMessage('Something went wrong')
        });
    };
    
    /* --------------------------------- RENDER --------------------------------- */
    return (
        <div className="flex flex-col flex-grow space-y-4">
            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)} 
                className="flex flex-grow textarea textarea-bordered h-72" 
                placeholder="Describe the task you want to accomplish"></textarea>
            <input 
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)} 
                type="text" 
                placeholder="Enter task duration in minutes" 
                className="w-full max-w-xs input input-bordered" />
            <div className="flex space-x-4">
                <button disabled={mutation.isLoading} onClick={() => handleSave()} className="px-10 btn btn-primary">Submit</button>
                <button disabled={mutation.isLoading} onClick={() => onCancel()} className="btn">Cancel</button>
            </div>
            <div className="flex -mt-2">
                {!!errorMessage ? <label className="text-error" htmlFor="p">{errorMessage}</label> : null}
            </div>
        </div>
    );
};

function BlacklistForm(props: {
    blacklist: Array<string>,
    onCancel: () => void,
    onOverwrite: () => void,
}) {
    const { onCancel, onOverwrite, blacklist } = props;

    /* ---------------------------------- STATE --------------------------------- */
    const [error, setError] = React.useState(false);
    const [urls, setUrls] = React.useState(blacklist?.map(s => s.trim())?.join('\n') || '');

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const mutation = hooks.useOverwriteBlacklist();

    /* -------------------------------- HANDLERS -------------------------------- */
    const handleOverwrite = async () => {
        mutation.mutate(
            urls.split('\n').map(s => s.trim()).filter(s => !!s),
            {
                onSuccess: onOverwrite,
                onError: () => setError(true)
            }
        );
    };
    
    /* --------------------------------- RENDER --------------------------------- */
    return (
        <div className="flex flex-col flex-grow space-y-4">
            <textarea 
                value={urls}
                onChange={(e) => setUrls(e.target.value)} 
                className="flex flex-grow textarea textarea-bordered h-72" 
                placeholder="Blacklist Urls"></textarea>
            <div className="flex space-x-4">
                <button disabled={mutation.isLoading} onClick={() => handleOverwrite()} className="px-10 btn btn-primary">Submit</button>
                <button disabled={mutation.isLoading} onClick={() => onCancel()} className="btn">Cancel</button>
            </div>
            <div className="flex -mt-2">
                {error ? <label className="text-error" htmlFor="p">Something went wrong</label> : null}
            </div>
        </div>
    );
};

function EditActiveTask(props: {
    onCancel: () => void,
    onSave: () => void,
    task: hooks.InProgressTask
}) {
    const { onCancel, onSave, task } = props;

    /* ---------------------------------- STATE --------------------------------- */
    const [text, setText] = React.useState(task.text);
    const [error, setError] = React.useState(false);

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const mutation = hooks.useEditTask();

    /* -------------------------------- HANDLERS -------------------------------- */
    const handleSave = () => {
        mutation.mutate(text, {
            onSuccess: onSave,
            onError: () => setError(true)
        });
    };
    
    /* --------------------------------- RENDER --------------------------------- */
    return (
        <div className="flex flex-col flex-grow space-y-4">
            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)} 
                className="flex flex-grow textarea textarea-bordered h-72" 
                placeholder="Edit Task"></textarea>
            <div className="flex space-x-4">
                <button disabled={mutation.isLoading} onClick={() => handleSave()} className="px-10 btn btn-primary">Submit</button>
                <button disabled={mutation.isLoading} onClick={() => onCancel()} className="btn">Cancel</button>
            </div>
            <div className="flex -mt-2">
                {error ? <label className="text-error" htmlFor="p">Something went wrong</label> : null}
            </div>
        </div>
    );
};

function CreateTaskInstructions() {
    return (
        <div className="flex flex-grow rounded-lg card bg-neutral text-primary-content opacity-80">
            <div className="card-body">
                <p className='text-lg text-white'>Create a task to get started!</p>
            </div>
        </div>
    );
};

function ActiveTask(props: { task: hooks.InProgressTask, onShowEditForm: () => void }) {
    const { onShowEditForm, task } = props;

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const mutation = hooks.useComplete();

    /* -------------------------------- HANDLERS -------------------------------- */
    const handleComplete = () => {
        mutation.mutate();
    };
    const handleShowEditForm = () => {
        onShowEditForm();
    };

    return (
        <div className="flex flex-grow rounded-lg card bg-neutral-content text-primary-content">
            <div className="card-body">
                <h2 className="card-title">Your Task:</h2>
                <p className='text-lg'>{task.text}</p>
                <div className="justify-end mt-5 space-x-2 card-actions">
                    <button disabled={mutation.isLoading} onClick={() => handleComplete()} className="btn btn-primary">Complete</button>
                    <button disabled={mutation.isLoading} onClick={() => handleShowEditForm()} className="btn">Edit</button>
                </div>
            </div>
        </div>
    );
};

function StatusBadge(props: { status: hooks.InProgressTask['status'] }) {
    const { status } = props;
    if (status === 'COMPLETE') {
        return(
            <div className="badge badge-success">Completed</div>
        );
    }
    if (status === 'FAILED') { 
        return(
            <div className="badge badge-error">Failed</div>
        );
    }
    if (status === 'GAVE_UP') { 
        return(
            <div className="badge badge-warning">Gave Up</div>
        );  
    }
    
    return null;
};

function ArchivedTasks() {
    /* ------------------------------ REACT QUERIES ----------------------------- */
    const { isLoading, archivedTasks } = hooks.useArchivedTasksQuery();

    /* --------------------------------- RENDER --------------------------------- */
    if (isLoading || !archivedTasks?.length) {
        return null;
    }
    return (
        <div className="flex-col pt-8 pb-36">
            <h2 className="text-base font-semibold text-gray-300">Archived Tasks</h2>
            <div className="mt-0 divider" />
            <div className="flex flex-col flex-grow space-y-5">
                {archivedTasks.map((task) => {
                    return(
                        <div key={task.id} className="flex flex-grow rounded-lg card bg-neutral-content text-primary-content">
                            <div className="card-body">
                                <div className="flex justify-between w-full">
                                    <h2 className="card-title">{dayjs(task.created_at).format('MM/DD/YYYY - HH:mm a')}</h2>
                                    <StatusBadge status={task.status}/>
                                </div>
                                <p className='text-lg'>{task.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

function TabPage() {
    /* ---------------------------------- STATE --------------------------------- */
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const [showBlacklistForm, setShowBlacklistForm] = React.useState(false);
    const [showEditForm, setShowEditForm] = React.useState(false);

    /* ------------------------------ REACT QUERIES ----------------------------- */
    const { isLoading: isLoadingActiveTask, task } = hooks.useTask();
    const { isLoading: isLoadingBlacklist, blacklist } = hooks.useBlacklistedQuery(window.location.href);

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
    if (isLoadingActiveTask) {
        return null;
    }
    
    return (
        <Container>
            <>
                <Countdown />
                <div className='flex flex-col space-y-6 pt-14' style={{ maxWidth: '572px' }}>
                    <Controls
                        task={task}
                        onToggleBlacklistForm={handleToggleBlacklistForm}
                        onToggleCreateForm={handleToggleCreateForm}/>
                    {showCreateForm ? (
                        <CreateTaskForm
                            onCancel={handleOnCancelCreateTask}
                            onCreate={handleOnCreate}/>
                    ) : null}
                    {showBlacklistForm ? (
                        isLoadingBlacklist ? null : (
                            <BlacklistForm 
                                blacklist={blacklist}
                                onCancel={handleOnCancelBlacklist}
                                onOverwrite={handleOnOverwriteBlacklist} />
                        )
                    ) : (
                        !!task ? (
                            showEditForm ? (
                                <EditActiveTask
                                    task={task}
                                    onCancel={handleOnCancelEdit}
                                    onSave={handleOnSaveEdit}/>
                            ) : (
                                <ActiveTask
                                    task={task}
                                    onShowEditForm={handleShowEditForm}/>
                            )
                        ) : (
                            !showCreateForm ? (
                                <CreateTaskInstructions/>
                            ) : null
                        )
                    )}
                    <ArchivedTasks />
                </div>
            </>
        </Container>  
    );
}

export default function Tab() {
    return (
        <ReactQueryProvider>
            <TabPage />
        </ReactQueryProvider>
    );
};
