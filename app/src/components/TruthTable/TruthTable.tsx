import React from 'react'
import { Table } from 'react-bootstrap'
import { TruthTableHeader } from './TruthTableHeader/TruthTableHeader'
import { TruthTableRow } from './TruthTableRow/TruthTableRow'

interface Props { 
    tableHeaders: string[];
    tableRows: Boolean[][];
    expression: string;
}

export const TruthTable: React.FC<Props> = ({tableHeaders, tableRows, expression}) => {
    const row_length = [];
    for (let i = 0; i < Math.pow(2, tableHeaders.length); ++i) {
        row_length.push('F');
    }

    return (
        <div>
            <Table striped bordered>
                <thead>
                    <tr>
                        {tableHeaders.map(tableHeader => { 
                            return (
                                <TruthTableHeader tableHeader={tableHeader}/>
                            )})
                        }
                        <th>{expression}</th>
                    </tr>
                </thead>

                <tbody>
                {tableRows.map(i => { 
                            return (
                                <TruthTableRow />
                            )})
                        }
              </tbody>
            </Table>
        </div>
    )
}
