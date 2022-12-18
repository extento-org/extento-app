import React from 'react';
import { 
    useQueryClient, 
    useQuery, 
    useMutation,
    UseMutationResult,
} from 'react-query';
import * as weather from '@app.shared/weather';
import * as location from '@app.shared/location';
import worker from '@extento.browser/worker'

/* ------------------------ WORKER API RESPONSE TYPES ----------------------- */
type Blacklist = Awaited<ReturnType<typeof worker.badger.getBlacklist>>;
type ArchivedTasks = Awaited<ReturnType<typeof worker.badger.getArchived>>;
type InProgressTask = Awaited<ReturnType<typeof worker.badger.getInProgressTask>>;

/* --------------------------------- HELPERS -------------------------------- */
const pluralize = (count: number, noun: string, suffix = 's') =>
    `${count} ${noun}${count !== 1 ? suffix : ''}`;

/* ---------------------------- REACT QUERY KEYS ---------------------------- */
type QueryKeys = 'zip' 
    | 'weather' 
    | 'in_progress_task' 
    | 'archived_tasks' 
    | 'blacklist';

const QUERY_KEYS: { [key in QueryKeys]: key } = {
    zip: 'zip',
    weather: 'weather',
    in_progress_task: 'in_progress_task',
    archived_tasks: 'archived_tasks',
    blacklist: 'blacklist',
};

/* ----------------------------- HELPER QUERIES ----------------------------- */
const useInProgressTaskQuery = () => {
    const query = useQuery<InProgressTask>(QUERY_KEYS.in_progress_task, () => worker.badger.getInProgressTask());
    return query;
};

/* ----------------------------------- API ---------------------------------- */
export const useWeatherBackgroundQuery = (): weather.Colors => {
    // for demo purpose we're not using browser location api 
    // returns hardcoded charlotte zip after random settimeout
    const {
        data: zip,
    } = useQuery<number>(QUERY_KEYS.zip, () => location.getZip());

    const {
        data: backgroundColor = weather.BACKGROUND_COLOR.LOADING
    } = useQuery<weather.Colors>(QUERY_KEYS.weather, () => weather.getBackgroundColor(zip), {
        enabled: !!zip
    });

    return backgroundColor;
};

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

export const useBlacklistQuery = (): {
    blacklist: Blacklist,
    isLoading: boolean
} => {
    const {
        data: blacklist = [],
        isLoading
    } = useQuery<Blacklist>(QUERY_KEYS.blacklist, () => worker.badger.getBlacklist());
    return {
        blacklist,
        isLoading
    };
};