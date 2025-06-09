export const fetchBooks = async (query = '') => {
  try {
    const response = await fetch(`https://reactnd-books-api.udacity.com/books`, {
      headers: { 'Authorization': 'whatever-you-want' }
    });
    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};