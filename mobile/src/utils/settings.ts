import { BiometricSupportStatus, Category, LanguageOption, MapStyleOption } from "../types/settings";
import { StrengthLevel } from "../types/settings";
import * as LocalAuthentication from 'expo-local-authentication';



export function getStrength(password: string): StrengthLevel {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(4, score) as StrengthLevel;
}

export const STRENGTH_LABELS: Record<StrengthLevel, string> = {
    0: '',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
};

export const STRENGTH_COLORS: Record<StrengthLevel, string> = {
    0: 'transparent',
    1: '#F7374F',
    2: '#FEC260',
    3: '#4E9F3D',
    4: '#C7B4FD',
};






export const LANGUAGES: LanguageOption[] = [
    {
        id: 'en',
        label: 'English',
        nativeLabel: 'English',
        flag: '🇺🇸',
        region: 'United States',
        icon: 'globe-outline',
    },
    {
        id: 'uk',
        label: 'Ukrainian',
        nativeLabel: 'Українська',
        flag: '🇺🇦',
        region: 'Ukraine',
        icon: 'globe-outline',
    },
    {
        id: 'de',
        label: 'German',
        nativeLabel: 'Deutsch',
        flag: '🇩🇪',
        region: 'Germany',
        icon: 'globe-outline',
    },
    {
        id: 'fr',
        label: 'French',
        nativeLabel: 'Français',
        flag: '🇫🇷',
        region: 'France',
        icon: 'globe-outline',
    },
    {
        id: 'es',
        label: 'Spanish',
        nativeLabel: 'Español',
        flag: '🇪🇸',
        region: 'Spain',
        icon: 'globe-outline',
    },
    {
        id: 'pl',
        label: 'Polish',
        nativeLabel: 'Polski',
        flag: '🇵🇱',
        region: 'Poland',
        icon: 'globe-outline',
    },
    {
        id: 'it',
        label: 'Italian',
        nativeLabel: 'Italiano',
        flag: '🇮🇹',
        region: 'Italy',
        icon: 'globe-outline',
    },
    {
        id: 'pt',
        label: 'Portuguese',
        nativeLabel: 'Português',
        flag: '🇵🇹',
        region: 'Portugal',
        icon: 'globe-outline',
    },
    {
        id: 'ru',
        label: 'Russian',
        nativeLabel: 'Русский',
        flag: '🇷🇺',
        region: 'Russia',
        icon: 'globe-outline',
    },
];




export const MAP_STYLES: MapStyleOption[] = [
    {
        id: 'dark',
        label: 'Dark',
        description: 'Minimalist dark canvas — ideal for night-time city navigation.',
        icon: 'moon',
        previewGradient: ['#0f0f1a', '#1a1a2e', '#16213e'],
        accentColor: 'rgba(199, 180, 253, 0.55)',
    },
    {
        id: 'light',
        label: 'Light',
        description: 'Clean, high-contrast view for daytime use.',
        icon: 'sunny',
        previewGradient: ['#e8eaf6', '#f3f4f6', '#dde1f0'],
        accentColor: 'rgba(100, 60, 180, 0.4)',
    },
    {
        id: 'satellite',
        label: 'Satellite',
        description: 'Real aerial imagery for precise location awareness.',
        icon: 'earth',
        previewGradient: ['#1b3a2d', '#2d5a3e', '#1a4a35'],
        accentColor: 'rgba(120, 220, 150, 0.4)',
    },
    {
        id: 'terrain',
        label: 'Terrain',
        description: 'Topographic layer — great for outdoor events and hiking.',
        icon: 'trail-sign',
        previewGradient: ['#2d3a1e', '#4a5e2b', '#3a4e24'],
        accentColor: 'rgba(180, 220, 100, 0.4)',
    },
];





export const CATEGORIES: Category[] = [
    { id: 'bug', label: 'Bug / Crash', icon: 'bug-outline' },
    { id: 'performance', label: 'Performance', icon: 'speedometer-outline' },
    { id: 'ui', label: 'UI / Display', icon: 'phone-portrait-outline' },
    { id: 'account', label: 'Account', icon: 'person-outline' },
    { id: 'map', label: 'Map / Location', icon: 'map-outline' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];



export const checkBiometricAvailability = async (): Promise<BiometricSupportStatus> => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
        return 'unavailable';
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
        return 'not_enrolled';
    }

    return 'ready';
};

