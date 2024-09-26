import React from 'react';

const GetBookmarks = ({data}) => {
    const {title} = data;
    return (
        <div>
            <h1>{title}</h1>
        </div>
    );
};

export default GetBookmarks;