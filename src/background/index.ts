// Service Worker da extensão Storer Ponto
// Em produção, aqui entrariam o TokenRefreshService e o ReminderService.
// Por ora, o listener garante que o SW seja registrado corretamente pelo Chrome.
chrome.runtime.onInstalled.addListener(() => {
  console.log('Storer Ponto Extension instalada com sucesso.');
});