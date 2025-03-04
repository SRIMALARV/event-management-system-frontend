import { TestBed } from '@angular/core/testing';

import { ManageOrgApiService } from './manage-org-api.service';

describe('ManageOrgApiService', () => {
  let service: ManageOrgApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageOrgApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
