import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { AuthGuard } from './auth.guard';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule],
      providers: [AuthGuard, UserService, {

        provide: Router,
        useClass: class { navigate = jasmine.createSpy('navigate'); }
      }],
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
