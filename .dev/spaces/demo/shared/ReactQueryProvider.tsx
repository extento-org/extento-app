import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export const queryClient = new QueryClient();

function ReactQueryProvider(props: { children: React.ReactElement }) {
    const { children } = props;

    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
