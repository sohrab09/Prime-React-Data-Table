import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import './DataTable.css';

class Page extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customers1: [],
            first1: 0,
            rows1: 10,
            currentPage: 1,
        };
        this.onCustomPage1 = this.onCustomPage1.bind(this);
    }

    onCustomPage1(event) {
        this.setState({
            first1: event.first,
            rows1: event.rows,
            currentPage: event.page + 1
        });
    }

    onPageInputChange(event) {
        this.setState({ currentPage: event.target.value });
    }

    componentDidMount() {
        axios.get('https://jsonplaceholder.typicode.com/comments')
            .then((res) => {
                console.log(res.data);
                this.setState({ customers1: res.data })
            })
    }
    render() {
        return (
            <div>
                <div className="card">
                    <h5>Basic</h5>
                    <DataTable value={this.state.customers1} paginator responsiveLayout="scroll"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50, 100]}
                    >
                        <Column field="id" header="ID"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="body" header="Body"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default Page;