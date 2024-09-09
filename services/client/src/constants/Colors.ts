/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type themtype =  {
  light: {
    background: string;
    postbackground: string;
    text: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    actionText: string;
},
dark: {
  background: string;
  postbackground: string;
  text: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  actionText: string;
},
}

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors:themtype = {
  light: {
    text: '#11181C',
    background: '#fff',
    postbackground: '#eee',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#0a7ea4',
    tabIconSelected: tintColorLight,
    actionText: '#0a7ea4',
  },
  dark: {
    text: '#d9d9d9',
    background: '#333', // black
    postbackground: '#222', // black
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    actionText: '#9BA1A6',
  },
};

export const MyColor1 = {
  primary: "#3498db",
  _purple: "#CA7DF9",
  _ocean: "#00A5CF",
  _darkPurple: "#470063",
};