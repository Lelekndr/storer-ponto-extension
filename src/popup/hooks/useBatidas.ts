import { useState, useEffect, useCallback } from 'react';
import type { Batida } from '../../types/ponto.types';
import { PontoService } from '../../services/PontoService';
import { StorageService } from '../../services/StorageService';

export function useBatidas() {
  const [batidas, setBatidas] = useState<Batida[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback evita que a função seja recriada a cada render,
  // o que causaria um loop infinito no useEffect abaixo
  const fetchBatidas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await StorageService.getConfig();
      const service = new PontoService(config.apiBaseUrl);
      const resultado = await service.getBatidasDia();
      setBatidas(resultado);
    } catch {
      setError('Não foi possível carregar as batidas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca as batidas automaticamente quando o popup abre
  useEffect(() => {
    fetchBatidas();
  }, [fetchBatidas]);

  const registrarBatida = async (): Promise<string | null> => {
    try {
      const config = await StorageService.getConfig();
      const service = new PontoService(config.apiBaseUrl);
      const resposta = await service.registrarBatida();
      // Atualiza a lista sem precisar fazer um novo fetch
      await fetchBatidas();
      return resposta.tipo; // retorna o tipo para o componente exibir no toast
    } catch {
      throw new Error('Falha ao registrar ponto. Verifique sua conexão.');
    }
  };

  return { batidas, isLoading, error, fetchBatidas, registrarBatida };
}