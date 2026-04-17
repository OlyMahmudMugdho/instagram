import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Searchbar } from 'react-native-paper';

export default function Explore() {
  const [query, setQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Explore</Title>
      <Searchbar placeholder="Search users or tags" value={query} onChangeText={setQuery} />
      {/* TODO: add search results list */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, paddingTop: 20 },
  title: { marginBottom: 12 },
});
