import { useState, useEffect } from 'react';
import type { SaldoMes } from '../../types/ponto.types';
import { PontoService } from '../../services/PontoService';
import { StorageService } from '../../services/StorageService';

export function useSaldo() {
  const [saldo, setSaldo] = useState<SaldoMes | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const mesAtual = new Date().toISOString().slice(0, 7); // "2026-04"
    StorageService.getConfig().then((config) => {
      const service = new PontoService(config.apiBaseUrl);
      return service.getSaldo(mesAtual);
    }).then((resultado) => {
      setSaldo(resultado);
    }).catch(() => {
      // Saldo indisponível não deve travar o popup — conforme AC-06 do PBI-07
      setSaldo(null);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return { saldo, isLoading };
}