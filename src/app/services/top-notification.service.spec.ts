import { TestBed } from '@angular/core/testing';

import { TopNotificationService } from './top-notification.service';

describe('TopNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopNotificationService = TestBed.get(TopNotificationService);
    expect(service).toBeTruthy();
  });
});
