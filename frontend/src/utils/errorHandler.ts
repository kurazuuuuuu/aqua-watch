export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

export const handleApiError = (error: any): AppError => {
  if (error.response) {
    return {
      message: error.response.data?.error || 'サーバーエラーが発生しました',
      status: error.response.status,
      code: error.response.data?.code
    };
  }
  
  if (error.request) {
    return {
      message: 'ネットワークエラーが発生しました',
      code: 'NETWORK_ERROR'
    };
  }
  
  return {
    message: error.message || '予期しないエラーが発生しました',
    code: 'UNKNOWN_ERROR'
  };
};

export const showErrorNotification = (error: AppError) => {
  console.error('Error:', error);
  // 実際のプロダクションではtoast通知などを使用
  alert(`エラー: ${error.message}`);
};
