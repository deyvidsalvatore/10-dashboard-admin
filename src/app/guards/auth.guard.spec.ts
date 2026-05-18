import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard (Bug Fix)', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [AuthGuard, AuthService],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate'); // Espiona navegação
  });

  it('Deve permitir acesso (true) se o usuário for ADMIN', () => {
    authService.login('ADMIN');
    const result = guard.canActivate();
    expect(result).toBe(true);
  });

  it('Deve bloquear acesso (false) e redirecionar para /login se o usuário for USER comum', () => {
    authService.login('USER');
    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Deve bloquear acesso (false) e redirecionar se o usuário for NULL (não logado)', () => {
    authService.logout();

    try {
      const result = guard.canActivate();
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    } catch (error) {
      fail('O Guard quebrou ao tentar validar um usuário nulo!');
    }
  });
});
