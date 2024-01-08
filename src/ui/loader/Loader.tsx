import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

type Props = {
    className?: string,
}

const Loader = ({className}: Props) => {
    return (
        <Spinner animation="border" className={className} />
    );
};

export default Loader;