import React, { useState } from 'react';
import { View } from 'react-native';
import { Icon } from '@rneui/themed';

export default function StarRating({ rating, setRating }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          type="ionicon"
          size={30}
          color="#FFD700"
          onPress={() => setRating(star)}
        />
      ))}
    </View>
  );
}