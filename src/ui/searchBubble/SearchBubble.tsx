import React, {useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import styles from '../../widgets/filters/styles.module.scss';
import searchStyles from './styles.module.scss';
import MagnifyingGlass from "./MagnifyingGlass";
import {CustomComponent} from "../../constants/types";
import useDebounce from "../../hooks/useDebouce";
import {useAppDispatch} from "../../app/hooks";
import {getSearchResults, resetSearchResults} from "../../app/afishaSlice";

const SearchBubble = ({className}: CustomComponent) => {
    const dispatch = useAppDispatch();
    const ref = useRef(null as unknown as HTMLDivElement);
    const inputRef = useRef(null as unknown as HTMLInputElement);
    const glassRef = useRef(null as unknown as HTMLDivElement);
    const [isMagnifyingGlassClicked, setIsMagnifyingGlassClicked] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const growBubble = () => {
        ref.current.style.width = '40vw';
        inputRef.current.style.display = 'block';
        inputRef.current.style.transform = 'scale(1)';
        inputRef.current.focus();
    };
    const shrinkBubble = () => {
        if (isMagnifyingGlassClicked) return;
        ref.current.style.width = '6.9vw';
        inputRef.current.style.transform = 'scale(0)';
    }
    const search = (text: string) => {
        if (text.length <= 0) dispatch(resetSearchResults());
        else dispatch(getSearchResults(text));
    }

    useDebounce(() => {
            search(searchQuery);
        }, [searchQuery], 300
    );


    useEffect(() => {
        window.addEventListener('click', (e) => {
            if (e.target !== glassRef.current)
                setIsMagnifyingGlassClicked(false);
        })
    }, [])

    return (
        <div
            ref={ref}
            className={classNames(styles.filter, searchStyles.root, className)}
            onClick={growBubble}
            onBlur={shrinkBubble}
        >
            <input
                ref={inputRef}
                type={'text'}
                className={searchStyles.input}
                onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            >
            </input>
            <MagnifyingGlass ref={glassRef} onClick={() => {
                setIsMagnifyingGlassClicked(true);
                return search(inputRef.current.value);
            }} />
        </div>
    );
};

export default SearchBubble;