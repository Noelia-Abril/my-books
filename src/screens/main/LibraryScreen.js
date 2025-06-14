import { useNavigation } from '@react-navigation/native';
import { Card, Image, SearchBar, Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { fetchBooks } from '../../services/books';

export default function LibraryScreen() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await fetchBooks(search);
      setBooks(booksData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('BookDetail', { book: item })}
      activeOpacity={0.8}
    >
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.title}>{item.title}</Card.Title>
        <Card.Divider />
        <Image
          source={{ uri: item.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="contain"
          PlaceholderContent={<Text>Loading...</Text>}
        />
        <Text style={styles.author}>{item.authors?.join(', ')}</Text>
        <Text style={styles.publisher}>{item.publisher}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar libros..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={loadBooks}
        platform="default"
        containerStyle={styles.searchBar}
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id || item.title}
        renderItem={renderBookItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  author: {
    fontStyle: 'italic',
    marginBottom: 5,
    textAlign: 'center',
  },
  publisher: {
    color: '#666',
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
});