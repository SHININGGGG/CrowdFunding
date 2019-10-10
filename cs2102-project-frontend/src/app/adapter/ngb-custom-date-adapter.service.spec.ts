import { TestBed } from '@angular/core/testing';

import { NgbCustomDateAdapterService } from './ngb-custom-date-adapter.service';

describe('NgbCustomDateAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgbCustomDateAdapterService = TestBed.get(NgbCustomDateAdapterService);
    expect(service).toBeTruthy();
  });
});
