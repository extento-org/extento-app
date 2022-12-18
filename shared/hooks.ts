import React from 'react';
import { 
    useQueryClient, 
    useQuery, 
    useMutation,
    UseMutationResult,
} from 'react-query';
import urlMatchPattern from '@app.shared/utils/urlMatchPattern';
import worker from '@extento.browser/worker'

/* ------------------------ WORKER API RESPONSE TYPES ----------------------- */
export type Blacklist = Awaited<ReturnType<typeof worker.badger.getBlacklist>>;
export type ArchivedTasks = Awaited<ReturnType<typeof worker.badger.getArchived>>;
export type InProgressTask = Awaited<ReturnType<typeof worker.badger.getInProgressTask>>;

/* --------------------------------- HELPERS -------------------------------- */
const pluralize = (count: number, noun: string, suffix = 's') =>
    `${count} ${noun}${count !== 1 ? suffix : ''}`;

/* ---------------------------- REACT QUERY KEYS ---------------------------- */
type QueryKeys = 'in_progress_task' 
    | 'archived_tasks' 
    | 'blacklist';

const QUERY_KEYS: { [key in QueryKeys]: key } = {
    in_progress_task: 'in_progress_task',
    archived_tasks: 'archived_tasks',
    blacklist: 'blacklist',
};

/* ----------------------------- HELPER QUERIES ----------------------------- */
const useInProgressTaskQuery = (enabled: boolean = true) => {
    const query = useQuery<InProgressTask>(
        QUERY_KEYS.in_progress_task, 
        () => worker.badger.getInProgressTask(),
        { enabled }
    );
    return query;
};

/* ----------------------------------- API ---------------------------------- */
export const useTask = (enabled: boolean = true): {
    isLoading: boolean,
    task?: InProgressTask
} => {
    const {
        data: inProgressTask = null,
        isLoading,
    } = useInProgressTaskQuery(enabled);
    return {
        isLoading,
        task: inProgressTask,
    };
}

export const useCountdownQuery = (): string => {
    const formatCountdown = (time = null) => {
        if (typeof time !== 'number') {
            return '-- minutes and -- seconds remaining';
        }
        const timeRemaining = time - Date.now();
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = timeRemaining % 60000 / 1000;
        return `${minutes} ${pluralize(minutes, 'minute')} and ${seconds} ${pluralize(seconds, 'second')} remaining`;
    };

    const [countdown, setCountdown] = React.useState(formatCountdown());

    const {
        data: inProgressTask = null
    } = useInProgressTaskQuery();

    React.useEffect(() => {
        if (inProgressTask?.mode === 'BROWSE') {
            setCountdown('Badger task paused');
        } else if (inProgressTask?.mode === 'WORK') {
            let interval = setInterval(() => {
                setCountdown(formatCountdown(inProgressTask?.due));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [inProgressTask]);

    return countdown;
};

export const useArchivedTasksQuery = (): {
    archivedTasks: ArchivedTasks,
    isLoading: boolean,
} => {
    const {
        data: archivedTasks = [],
        isLoading,
    } = useQuery<ArchivedTasks>(QUERY_KEYS.archived_tasks, () => worker.badger.getArchived());
    
    return {
        archivedTasks,
        isLoading,
    };
};

export const useEditTask = (): UseMutationResult<void, unknown, string> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, string>(async (edit) => {
        await worker.badger.edit(edit);
        await queryClient.invalidateQueries([QUERY_KEYS.in_progress_task]);
    });
    return mutation;
};

export const useExtendTask = (): UseMutationResult<void, unknown, number> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, number>(async (minutes) => {
        await worker.badger.extend(minutes);
        await queryClient.invalidateQueries([QUERY_KEYS.in_progress_task]);
    });
    return mutation;
};

export const useCreateTask = (): UseMutationResult<void, unknown, { text: string, minutes: number }> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, { text: string, minutes: number }, unknown>(async ({
        text,
        minutes,
    }) => {
        await worker.badger.create(text, minutes);
        await queryClient.invalidateQueries([QUERY_KEYS.in_progress_task]);
    });
    return mutation;
};

export const useGiveUpTask = (): UseMutationResult<void, unknown, void> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, void, unknown>(async () => {
        await worker.badger.giveUp();
        await queryClient.invalidateQueries([QUERY_KEYS.in_progress_task, QUERY_KEYS.archived_tasks]);
    });
    return mutation;
};

export const usePause = (): UseMutationResult<void, unknown, void, unknown> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, void, unknown>(async () => {
        await worker.badger.pause();
        await queryClient.invalidateQueries([QUERY_KEYS.in_progress_task]);
    });
    return mutation;
};

export const useResume = (): UseMutationResult<void, unknown, void, unknown> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, void, unknown>(async () => {
        await worker.badger.resume();
        await queryClient.invalidateQueries([QUERY_KEYS.in_progress_task]);
    });
    return mutation;
};

export const useOverwriteBlacklist = (): UseMutationResult<void, unknown, Array<string>, unknown> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<void, unknown, Array<string>, unknown>(async (urls) => {
        await worker.badger.overwriteBlacklist(urls);
        await queryClient.invalidateQueries([QUERY_KEYS.blacklist]);
    });
    return mutation;
};

export const useBlacklistedQuery = (href: string): {
    blacklisted: boolean,
    isLoading: boolean
} => {
    const {
        data: blacklist = [],
        isLoading
    } = useQuery<Blacklist>(QUERY_KEYS.blacklist, () => worker.badger.getBlacklist());
    return {
        blacklisted: blacklist.some(urlPattern => urlMatchPattern(urlPattern, href)),
        isLoading
    };
};