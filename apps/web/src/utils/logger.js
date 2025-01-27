export const logError = (error, context = {}) => {
  console.error('Error:', {
    message: error.message,
    code: error.code,
    context,
    stack: error.stack
  });
};

export const logInfo = (message, data = {}) => {
  console.log(message, data);
}; 