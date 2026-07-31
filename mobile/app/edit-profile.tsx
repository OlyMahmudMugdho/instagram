import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { TextInput, Button, Title, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../src/lib/auth-context';
import { useRouter } from 'expo-router';
import { usersService } from '../src/services/users';
import eventBus from '../src/lib/eventBus';

export default function EditProfile() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!authUser?._id) return;
      setLoading(true);
      const res = await usersService.getProfile(authUser._id);
      if (res.success && res.message?.foundUser) {
        const u = res.message.foundUser;
        setName(u.name || '');
        setEmail(u.email || '');
        setCurrentImage(u.profilePicture || null);
      }
      setLoading(false);
    };
    load();
  }, [authUser]);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Permission to access photos is required to choose a profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (!result.canceled) {
        // new API returns assets array
        // @ts-ignore
        const uri = result.assets?.[0]?.uri || (result as any).uri;
        setLocalImage(uri as string);
      }
    } catch (err) {
      console.error('Image pick error', err);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (localImage) {
        const up = await usersService.uploadProfilePicture(localImage);
        if (!up.success) {
          Alert.alert('Error', String(up.message || 'Failed to upload image'));
          setSaving(false);
          return;
        }
      }

      const res = await usersService.updateProfile({ name, email });
      if (res.success) {
        eventBus.emit('profile:update', { userId: authUser?._id });
        Alert.alert('Success', 'Profile updated');
        router.back();
      } else {
        Alert.alert('Error', String(res.message || 'Failed to update'));
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.titleSkeleton} />
        <View style={styles.avatarSkeletonWrap}>
          <View style={styles.avatarSkeleton} />
          <View style={styles.buttonSkeleton} />
        </View>
        <View style={styles.inputSkeleton} />
        <View style={styles.inputSkeleton} />
        <View style={styles.saveSkeleton} />
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Title style={styles.title}>Edit Profile</Title>

        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {localImage || currentImage ? (
            <Image source={{ uri: localImage || currentImage || undefined }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <Avatar.Text size={100} label={(name || 'U').slice(0,1).toUpperCase()} />
          )}
          <Button mode="outlined" onPress={pickImage} style={{ marginTop: 8 }}>Choose Photo</Button>
        </View>

        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={styles.saveBtn}>
          Save
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 32 },
  form: { width: '100%', maxWidth: 640, paddingHorizontal: 20, paddingBottom: 20 },
  input: { marginBottom: 12 },
  saveBtn: { marginTop: 8 },
  title: { marginBottom: 20 },
  titleSkeleton: { width: 140, height: 24, borderRadius: 6, backgroundColor: '#e5e7eb', marginBottom: 20 },
  avatarSkeletonWrap: { alignItems: 'center', marginBottom: 16 },
  avatarSkeleton: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e5e7eb' },
  buttonSkeleton: { width: 130, height: 36, borderRadius: 8, backgroundColor: '#e5e7eb', marginTop: 8 },
  inputSkeleton: { height: 56, borderRadius: 10, backgroundColor: '#e5e7eb', marginBottom: 12 },
  saveSkeleton: { height: 44, borderRadius: 10, backgroundColor: '#e5e7eb', marginTop: 8 },
});
