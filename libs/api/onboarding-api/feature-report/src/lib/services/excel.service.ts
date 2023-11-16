import { Injectable } from '@nestjs/common';
import { ReportEntity } from '@tempus/api/shared/entity';
import * as ExcelJS from 'exceljs';


@Injectable()
export class ExcelService {
  constructor(){}

  async exportToExcel(data: ReportEntity[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach((row) => {
      const values = headers.map((header) => row[header]);
      worksheet.addRow(values);
    });

    const buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
}