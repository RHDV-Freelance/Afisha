import React, {useRef, useState} from 'react';
import {CustomComponent} from "../../../constants/types";
import {eventIconWidth, eventIconHeight} from "../../../constants/sizes";
import styles from './styles.module.scss';
import classNames from "classnames";

type Props = {
    src: string,
} & CustomComponent

const EventIcon = ({src, className}: Props) => {
    const ref = useRef(null as unknown as HTMLImageElement);
    const [isHovering, setIsHovering] = useState(false);
    const toggleShowPicture = (e: React.MouseEvent, shouldShow: boolean) => {
        setIsHovering(shouldShow);
    }

    return (
        <div
            className={classNames(className, styles.root)}
            onMouseOver={(e) => toggleShowPicture(e, true)}
            onMouseOut={(e) => toggleShowPicture(e, false)}
        >
            <img src={src} className={styles.img}/>
            {isHovering && <img ref={ref} src={src} className={styles.fullImg}/>}
        </div>
    );
}

export default EventIcon;