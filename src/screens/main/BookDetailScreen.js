import { Button, Input, Text } from '@rneui/themed';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import StarRating from '../../components/StartRating';
import { auth, db } from '../../config/firebase';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), where('bookId', '==', book.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    });
    return unsubscribe;
  }, [book.id]);

  const submitReview = async () => {
    if (!review || rating === 0) {
      alert('Por favor completa tu reseña y calificación');
      return;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        bookId: book.id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email,
        text: review,
        rating,
        createdAt: new Date()
      });
      setReview('');
      setRating(0);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3>{book.title}</Text>
      <Text h4>Autor: {book.authors?.join(', ')}</Text>
      
      <Text h4 style={styles.sectionTitle}>Tu Reseña</Text>
      <StarRating rating={rating} setRating={setRating} />
      <Input
        placeholder="Escribe tu reseña..."
        value={review}
        onChangeText={setReview}
        multiline
      />
      <Button title="Enviar Reseña" onPress={submitReview} />

      <Text h4 style={styles.sectionTitle}>Reseñas</Text>
      {reviews.map((item) => (
        <View key={item.id} style={styles.review}>
          <Text>{item.userName}</Text>
          <StarRating rating={item.rating} setRating={() => {}} disabled />
          <Text>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  review: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
});