// 環境に応じてベースURLを取得
export const getBaseUrl = () => {
  if (window.location.hostname === 'aqua-watch.krz-tech.net') {
    return 'https://aqua-watch.krz-tech.net';
  }
  return 'http://localhost:11101';
};

export const getApiBaseUrl = () => `${getBaseUrl()}/api`;
