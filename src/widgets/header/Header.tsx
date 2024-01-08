import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import AfishaText from "../../ui/pageTitle/AfishaText";
import PlusButton from "../../ui/plusButton/PlusButton";
import {afishaEmail, headerText} from "../../constants/pageData";

function Header() {
    const onAfishaEmailClick = () => {
    }

    const onPlusButtonClick = () => {
    }

    return (
        <div className={styles.root}>
            <div className={classNames(styles.headerColumn, styles.left)}>
                <AfishaText />
                <div className={styles.headerTitle}>
                    {headerText}
                </div>
            </div>
            <div className={classNames(styles.headerColumn, styles.right)}>
                <div className={styles.headerAfishaEmail} onClick={onAfishaEmailClick}>
                    {afishaEmail}
                </div>
                <PlusButton onClick={onPlusButtonClick} className={styles.plusButton} />
            </div>
        </div>
    );
}

export default Header;