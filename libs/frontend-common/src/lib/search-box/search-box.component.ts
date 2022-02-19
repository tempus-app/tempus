import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tempus-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  search : String ="";
  constructor() { }

  ngOnInit(): void {
  }

}
