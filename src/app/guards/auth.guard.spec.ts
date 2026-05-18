import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard (Functional Bug Fix)', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate'); // Espiona a navegação
  });

  // Helper para rodar o Guard dentro do contexto de Injeção de Dependências do Angular
  const runGuard = () => {
    return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
  };

  it('Deve permitir acesso (true) se o usuário for ADMIN', () => {
    authService.login('ADMIN');
    
    // Roda a função do Guard
    const result = runGuard();
    
    expect(result).toBe(true);
  });

  it('Deve bloquear acesso (false) e redirecionar para /login se o usuário for USER comum', () => {
    authService.login('USER');
    
    const result = runGuard();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Deve bloquear acesso (false) e redirecionar se o usuário for NULL (não logado)', () => {
    authService.logout();

    try {
      const result = runGuard();
      
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    } catch (error) {
      fail('O Guard quebrou ao tentar validar um usuário nulo!');
    }
  });
});
