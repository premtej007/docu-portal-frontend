import api from './api';

export const askQuestion = (docId, question) =>
  api.post('/qa/', { doc_id: docId, question });
