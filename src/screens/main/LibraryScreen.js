import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Image, SearchBar } from '@rneui/themed';
import { fetchBooks } from '../services/books';

export default function LibraryScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const booksData = await fetchBooks(search);
    setBooks(booksData);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar libros..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={loadBooks}
        platform="default"
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <Card.Title>{item.title}</Card.Title>
            <Card.Divider />
            <Image
              source={{ uri: item.imageLinks?.thumbnail }}
              style={{ width: 100, height: 150 }}
              resizeMode="contain"
            />
            <Text style={styles.author}>{item.authors?.join(', ')}</Text>
            <Button
              title="Ver detalles"
              onPress={() => navigation.navigate('BookDetail', { book: item })}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  author: {
    marginVertical: 10,
    fontStyle: 'italic',
  },
});