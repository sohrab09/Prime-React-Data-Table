
import React, { Component } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './DataTableDemo.css';
import axios from 'axios';
import { Tooltip } from 'primereact/tooltip';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export class Filters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customers1: null,
            filters1: null,
            globalFilterValue1: '',
            loading1: true,
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
        this.clearFilter1 = this.clearFilter1.bind(this);
        this.onGlobalFilterChange1 = this.onGlobalFilterChange1.bind(this);

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'albumId', header: 'AlbumId' },
            { field: 'title', header: 'Title' },
            { field: 'url', header: 'URL' },
            { field: 'thumbnailUrl', header: 'Thumbnail URL' },
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
        axios.get('https://jsonplaceholder.typicode.com/photos')
            .then((res) => {
                console.log("API", res.data);
                this.setState({ customers1: res.data, loading1: false });
            })
        this.initFilters();
    }

    exportCSV(selectionOnly) {
        this.dt.exportCSV({ selectionOnly });
    }

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.state.customers1);
                doc.save('products.pdf');
            })
        })
    }

    exportExcel() {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.state.customers1);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['customers1'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'customers1');
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

    clearFilter1() {
        this.initFilters();
    }

    onGlobalFilterChange1(e) {
        const value = e.target.value;
        let filters1 = { ...this.state.filters1 };
        filters1['global'].value = value;

        this.setState({ filters1, globalFilterValue1: value });
    }

    initFilters() {
        this.setState({
            filters1: {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            },
            globalFilterValue1: ''
        });
    }

    renderHeader() {
        return (
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="export-buttons">
                        <Button type="button" icon="pi pi-file" onClick={() => this.exportCSV(false)} className="mr-2" style={{ marginRight: '20px' }} data-pr-tooltip="CSV" />
                        <Button type="button" icon="pi pi-file-excel" onClick={this.exportExcel} className="p-button-success mr-2" style={{ marginRight: '20px' }} data-pr-tooltip="XLS" />
                        <Button type="button" icon="pi pi-file-pdf" onClick={this.exportPdf} className="p-button-warning mr-2" style={{ marginRight: '20px' }} data-pr-tooltip="PDF" />
                    </div>
                    <div className="d-flex justify-content-around">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined ml-5" style={{ marginRight: '20px' }} onClick={this.clearFilter1} />
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={this.state.globalFilterValue1} onChange={this.onGlobalFilterChange1} placeholder="Keyword Search" />
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const header = this.renderHeader();
        return (
            <div className="datatable-filter-demo">
                <div className="card">
                    <Tooltip target=".export-buttons>button" />
                    <DataTable
                        ref={(el) => { this.dt = el; }}
                        selectionMode="multiple"
                        onSelectionChange={this.onSelectionChange}
                        selection={this.state.selectedProducts}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        value={this.state.customers1}
                        paginator
                        className="p-datatable-customers"
                        showGridlines
                        rows={10}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        dataKey="id"
                        filters={this.state.filters1}
                        filterDisplay="menu"
                        loading={this.state.loading1}
                        responsiveLayout="scroll"
                        globalFilterFields={['name', 'id', 'email', 'body']}
                        header={header}
                        emptyMessage="No Employee Found.">
                        <Column field="id" header="ID" filter filterPlaceholder="Search by id" style={{ minWidth: '12rem' }}></Column>
                        <Column field="albumId" header="Album ID" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }}></Column>
                        <Column field="title" header="Title" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }}></Column>
                        <Column field="url" header="URL" filter filterPlaceholder="Search by body" style={{ minWidth: '12rem' }}></Column>
                        <Column field="thumbnailUrl" header="Thumbnail URL" filter filterPlaceholder="Search by body" style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}