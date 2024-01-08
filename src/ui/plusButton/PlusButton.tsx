import React from 'react';
import styles from './styles.module.scss'
import PlusSign from "./PlusSign";
import {CustomComponent} from "../../constants/types";
import classNames from "classnames";

type Props = {
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
} & CustomComponent

const PlusButton = ({onClick, className}: Props) => {
    return (
        <div onClick={onClick} className={classNames(styles.root, className)}>
            <PlusSign />
        </div>
    );
};

export default PlusButton;