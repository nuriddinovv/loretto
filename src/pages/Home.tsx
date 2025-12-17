import { StyleSheet, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeArea } from '@/shared/ui';

export default function Home() {
  return (
    <SafeArea
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <ScrollView style={{ flex: 1, backgroundColor: 'green' }}>
        <Text style={{ fontSize: 66 }}>;aaskmsdfk saflkn s</Text>
        <Text style={{ fontSize: 66 }}>;aaskmsdfk saflkn s</Text>
        <Text style={{ fontSize: 66 }}>;aaskmsdfk saflkn s</Text>
        <Text style={{ fontSize: 66 }}>;aaskmsdfk saflkn s</Text>
        <Text style={{ fontSize: 66 }}>;aaskmsdfk saflkn s</Text>
        <Text style={{ fontSize: 66 }}>;aaskmsdfk saflkn s</Text>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({});
