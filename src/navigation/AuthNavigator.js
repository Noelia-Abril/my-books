import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookDetailScreen from '../screens/main/BookDetailScreen';
import LibraryScreen from '../screens/main/LibraryScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen 
        name="BookDetail" 
        component={BookDetailScreen} 
        options={({ route }) => ({ title: route.params.book.title })}
      />
    </Stack.Navigator>
  );
}