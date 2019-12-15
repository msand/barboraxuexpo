import Head from 'next/head';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const PlatformHead = isWeb ? Head : () => null;

export default PlatformHead;
