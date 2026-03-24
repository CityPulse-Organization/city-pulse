import { Stack, useRouter } from 'expo-router';

export default function ProfileLayout() {
    const router = useRouter();
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='index' />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="new-post" />
            <Stack.Screen name="new-post-image" />
            <Stack.Screen name="edit-post" />
        </Stack>
    );
}