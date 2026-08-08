import api from './api';

const assistantService = {
  async chat(message, conversationHistory = []) {
    return api.post('/assistant/chat', { message, conversationHistory });
  },

  async getSuggestions() {
    return api.get('/assistant/suggestions');
  },
};

export default assistantService;
