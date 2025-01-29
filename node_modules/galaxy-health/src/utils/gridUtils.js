export const saveGridState = (key, state) => {
  try {
    localStorage.setItem(`gridState_${key}`, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving grid state:', error);
  }
};

export const loadGridState = (key) => {
  try {
    const savedState = localStorage.getItem(`gridState_${key}`);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Error loading grid state:', error);
    return null;
  }
}; 