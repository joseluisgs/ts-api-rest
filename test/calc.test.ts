import { suma, resta } from '../src/calc';

describe('Suite de Test de Funciones de calculo', () => {
  describe('Suite de Test de Suma', () => {
    test('Debería devolver 15 en suma(10,5)', () => {
      expect(suma(10, 5)).toBe(15);
    });
    test('Debería devolver 5 en suma(2,3)', () => {
      expect(suma(2, 3)).toBe(5);
    });
  });

  describe('Suite de Test de Resta', () => {
    test('Debería devolver 4 en suma(10,6)', () => {
      expect(resta(10, 6)).toBe(4);
    });
    test('Debería devolver 2 en suma(5,3)', () => {
      expect(resta(5, 2)).toBe(3);
    });
  });
});
