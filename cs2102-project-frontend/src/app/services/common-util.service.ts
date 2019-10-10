import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SimpleModalComponent } from '../modal/simple-modal/simple-modal.component';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilService {

  constructor(private modalService: NgbModal) { }

  openModal(displayText: String) {
    const modal = this.modalService.open(SimpleModalComponent);
    modal.componentInstance.displayText = displayText;
  }

  async sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
  }
}
