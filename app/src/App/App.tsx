import React, { useState, useEffect } from 'react'
import './App.css';

import { ExpressionField } from '../components/ExpressionField/ExpressionField'
import { TruthTable } from '../components/TruthTable/TruthTable'

export const App: React.FC = () => {
    const [value, setValue] = useState('');
    const [tableHeader, setTableHeader] = useState<string[]>([]);

    // TODO: should be react functional comp
    const OnChangeHandler = (e: any) => {
        let html_value: string = e.target.value
        html_value = html_value.replace(/[^a-zA-Z|&∨∧]/, '');
        html_value = html_value.replace('||', '∨');
        html_value = html_value.replace('&&', '∧');
        setValue(html_value)
        e.target.value = html_value 
    }

    useEffect(() => {
        console.log('updated, ', value); 

        const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let char_array = [];
        for (let c of value) {
            if (!alphabet.includes(c)) {
                continue;
            }
            char_array.push(c);
        }
        setTableHeader(char_array);


    }, [value]);

    return (
        <div>
            <ExpressionField onChangeHandler={OnChangeHandler}/>
            <TruthTable tableHeaders={tableHeader} expression={value}/>
        </div>
    )
}