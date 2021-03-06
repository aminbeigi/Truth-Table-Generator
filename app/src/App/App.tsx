import React, { useState, useEffect } from 'react';
import './App.css';
import './Overrides.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Title, IconWrapper } from './styled';

import { ExpressionField } from '../components/ExpressionField/ExpressionField';
import { TruthTable } from '../components/TruthTable/TruthTable';
import { Icons } from '../components/Icons/Icons';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';

import { permute, remove, parse, replaceHTML } from '../shared/helper';

export const App: React.FC = () => {
    const [value, setValue] = useState<string>('');
    const [emptyValue, setEmptyValue] = useState<Boolean>();
    const [invalidValue, setInvalidValue] = useState<Boolean>();
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [tableRows, setTableRows] = useState<Boolean[][]>([]);
    const [expressionSolutions, setExpressionSolutions] = useState<Boolean[]>([]);
    const [errorObject, setErrorObject] = useState({error: '1', value: '1', index: -1});

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let htmlValue: string = e.target.value;
        htmlValue = replaceHTML(htmlValue);
        setValue(htmlValue);
        e.target.value = htmlValue;
    }

    // on start
    useEffect(() => {
        document.body.style.backgroundColor = '#212529' 
    }, [])

    useEffect(() => {
        if (value.length === 0) {
            setEmptyValue(false);
            return;
        }
        setEmptyValue(true);
        try {
            // TODO: fix operand not operator bug
            if (/(∧|∨|¬)$|^(∧|∨|¬)/g.test(value)) {
                throw "The operator is missing an operand.";
            } 
            
            if (/[/|]/g.test(value)) {
                throw "The character | shouldn't be here.";
            } 

            if (/[&]/g.test(value)) {
                throw "The character & shouldn't be here.";
            } 

        } catch (e) {
            if (e === "The operator is missing an operand.") {
                const index = value.search(/(∧|∨|¬)$|^(∧|∨|¬)/g);
                setErrorObject({'error': e, 'value': value, 'index': index});
            }
            else if (e === "The character | shouldn't be here.") {
                setErrorObject({'error': e, 'value': value, 'index': value.indexOf('|')});
            }
            else if (e === "The character | shouldn't be here.") {
                setErrorObject({'error': e, 'value': value, 'index': value.indexOf('&')});
            }
            setInvalidValue(true);
            return;
        }

        let operandArray: string[]|string = [];
        let operand: string = '';
        for (let c of value) {
            if (c === '|' || c === '&' || c === '¬' || c === '(' || c === ')') {
                // pass;
            }
            else if (c === '∨' || c === '∧') {
                operand = '';
            }
            else { 
                operand += c;

                if (operand.length > 1) {
                    operandArray.pop();
                }

                if (operandArray.includes(operand)) {
                    operandArray.push('');
                } else {
                    operandArray.push(operand);
                }
            } 
        }

        operandArray = remove(operandArray, '');
        const tableRows = permute(operandArray.length);

        let expressionSolutionArray: Boolean[] = [];
        for (let boolArray of tableRows) {

            let boolStr: string;
            let bool: boolean;
            let evalString: string = value;

            evalString = evalString.replaceAll('∨', '||');
            evalString = evalString.replaceAll('∧', '&&');
            evalString = evalString.replaceAll('¬', '!');

            for (let i = 0; i < operandArray.length; ++i) {
                bool = boolArray[i]
                if (bool){
                    boolStr = '1';
                } else {
                    boolStr = '0';
                }
                evalString = evalString.replaceAll(new RegExp("\\b" + operandArray[i] + "\\b",  'g'), boolStr);
            }
                try {
                    if (/[^10|&!()]/.test(evalString)) {
                        throw SyntaxError;
                    }
                    let expression: number = parse(evalString);
                    // will sometimes return bool true instead of number 1??
                    if (expression == 1 || expression) {
                        expressionSolutionArray.push(true);
                    } else if (expression == 0 || expression) {
                        expressionSolutionArray.push(false);
                    }
                    setInvalidValue(false)
                } catch (e) {
                    setErrorObject({'error': "Invalid syntax.", 'value': value, 'index': -1})
                    setInvalidValue(true)
                }
        }
        setTableHeaders(operandArray);
        setTableRows(tableRows)
        setExpressionSolutions(expressionSolutionArray);
    }, [value]);

    return (
        <>
            <Title>Truth Table Generator</Title>
            <ExpressionField onValueChange={onValueChange}/>

            { !emptyValue
                ? ''
                :
                invalidValue
                    ? <ErrorMessage errorObject={errorObject}/>
                    :   
                    <Container className="truth-table-container">
                        <TruthTable tableHeaders={tableHeaders} tableRows={tableRows} expression={value} expressionSolutions={expressionSolutions}/>
                    </Container>
            }
            <IconWrapper>
                <Icons />
            </IconWrapper>
        </>
    )
}