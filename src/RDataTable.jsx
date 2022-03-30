import React, { Component } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './DataTable.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

class RDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
        this.columns = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'body', header: 'Body' }
        ];
    }
    componentDidMount() {
        axios.get('https://jsonplaceholder.typicode.com/comments')
            .then((res) => {
                console.log(res.data);
                this.setState({ products: res.data });
            })
    }
    render() {
        const dynamicColumns = this.columns.map((col, i) => {
            return <Column
                key={col.field}
                field={col.field}
                header={col.header}
            />;
        });
        return (
            <div>
                <div className="card">
                    <DataTable
                        value={this.state.products}
                        responsiveLayout="scroll"
                    >
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default RDataTable;