
import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';
import './DataTable.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

export class Export extends Component {

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            first1: 0,
            rows1: 10,
            currentPage: 1,
            selectedProducts: [],
        };

        this.exportCSV = this.exportCSV.bind(this);
        this.exportPdf = this.exportPdf.bind(this);
        this.exportExcel = this.exportExcel.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onCustomPage1 = this.onCustomPage1.bind(this);

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'body', header: 'Body' }
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
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
                this.setState({ products: res.data })
            })
    }

    exportCSV(selectionOnly) {
        this.dt.exportCSV({ selectionOnly });
    }

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.state.products);
                doc.save('products.pdf');
            })
        })
    }

    exportExcel() {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.state.products);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'products');
        });
    }

    saveAsExcelFile(buffer, fileName) {
        import('file-saver').then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    }

    onSelectionChange(e) {
        this.setState({ selectedProducts: e.value });
    }

    render() {
        const header = (
            <div className="">
                <Button type="button" icon="pi pi-file" onClick={() => this.exportCSV(false)} className="mr-2" data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-excel" onClick={this.exportExcel} className="p-button-success mr-2" data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" onClick={this.exportPdf} className="p-button-warning mr-2" data-pr-tooltip="PDF" />
            </div>
        );

        return (
            <div>
                <div className="card">
                    <Tooltip target=".export-buttons>button" />
                    <DataTable
                        ref={(el) => { this.dt = el; }}
                        value={this.state.products}
                        header={header}
                        dataKey="id"
                        responsiveLayout="scroll"
                        selectionMode="multiple"
                        selection={this.state.selectedProducts}
                        onSelectionChange={this.onSelectionChange}
                        paginator
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50, 100]}
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
