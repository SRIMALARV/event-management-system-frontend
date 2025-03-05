import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {
    if (!data || data.length === 0) {
      Swal.fire({ text: 'No data available to export', icon: 'error' });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `${fileName}.xlsx`);
  }
}
