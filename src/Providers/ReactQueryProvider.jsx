"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";

const ReactQueryProvider = ({ children }) => {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
