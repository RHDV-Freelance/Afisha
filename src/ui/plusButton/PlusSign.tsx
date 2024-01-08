import React from 'react';
import {SVGProps} from "../../constants/types";

const PlusSign = ({width, height}: SVGProps) => {
    const titleWidth = width || 18;
    const titleHeight = height || 18;

    return (
        <svg width={titleWidth} height={titleHeight} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0.75V16.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8.75L1 8.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export default PlusSign;