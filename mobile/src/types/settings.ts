import { Ionicons } from "@expo/vector-icons";




export type StrengthLevel = 0 | 1 | 2 | 3 | 4;



export type LanguageId =
    | 'en'
    | 'uk'
    | 'de'
    | 'fr'
    | 'es'
    | 'pl'
    | 'it'
    | 'pt'
    | 'ru';

export type LanguageOption = {
    id: LanguageId;
    label: string;
    nativeLabel: string;
    flag: string;
    region: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};





export type MapStyleId = 'dark' | 'light' | 'satellite' | 'terrain';

export type MapStyleOption = {
    id: MapStyleId;
    label: string;
    description: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    previewGradient: readonly [string, string, ...string[]];
    accentColor: string;
};






export type Category = {
    id: string;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};





export type BiometricSupportStatus =
    | 'checking'
    | 'unavailable'
    | 'not_enrolled'
    | 'ready';
