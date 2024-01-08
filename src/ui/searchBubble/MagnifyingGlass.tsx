import React, {forwardRef} from 'react';

type Props = {
    onClick?: React.MouseEventHandler
}
const MagnifyingGlass = forwardRef(({onClick}: Props, ref) => {
    // @ts-ignore
    return (<div onClick={onClick} ref={ref}>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M14.947 8.45972C14.947 12.0417 12.0433 14.9454 8.4613 14.9454C4.87934 14.9454 1.97559 12.0417 1.97559 8.45972C1.97559 4.87775 4.87934 1.974 8.4613 1.974C12.0433 1.974 14.947 4.87775 14.947 8.45972ZM13.5719 14.6774C12.182 15.8211 10.4018 16.5079 8.4613 16.5079C4.0164 16.5079 0.413086 12.9046 0.413086 8.45972C0.413086 4.01481 4.0164 0.411499 8.4613 0.411499C12.9062 0.411499 16.5095 4.01481 16.5095 8.45972C16.5095 10.4014 15.8219 12.1825 14.677 13.5727L18.3591 17.2548C18.6642 17.5599 18.6642 18.0546 18.3591 18.3597C18.054 18.6648 17.5593 18.6648 17.2542 18.3597L13.5719 14.6774Z"
                      fill="black"/>
            </svg>
    </div>);
});

export default MagnifyingGlass;