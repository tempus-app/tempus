import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Message } from '@tempus/api-interfaces'
import { Column } from '@tempus/frontend-common'

@Component({
  selector: 'tempus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data = [
    {
      name: 'Gabriel Granata',
      email: 'gabriel.granata@hotmail.com',
    },
    {
      name: 'Mustafa Ali',
      email: 'mustafa.ali@email.com',
    },
    {
      name: 'Georges Chamoun',
      email: 'georges.chamoun@email.com',
    },
  ]

  tableColumns: Array<Column> = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Record<string, any>) => `${element['name']}`,
      isLink: true,
      url: 'abc',
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: Record<string, any>) => `${element['email']}`,
    },
  ]
  hello$ = this.http.get<Message>('/api/hello')
  constructor(private http: HttpClient) {}
}
