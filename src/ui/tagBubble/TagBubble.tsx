import React, {useState} from 'react';
import styles from './styles.module.scss';
import {CustomComponent} from "../../constants/types";
import classNames from "classnames";

type Props = {
    onClickFunction: () => any,
    bubbleText: string,
} & CustomComponent

const TagBubble = ({onClickFunction, bubbleText}: Props) => {
    const [isClicked, setIsClicked] = useState(false);
    const onClick = () => {
        onClickFunction();
        setIsClicked(prev => !prev);
    }

    return (
        <div className={classNames({
            [styles.root]: true,
            [styles.active]: isClicked,
        })} onClick={onClick}>
            {bubbleText}
        </div>
    );
};

export default TagBubble;