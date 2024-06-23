/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type themtype =  {
  light: {
    background: string;
    text: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
},
dark: {
  background: string;
  text: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  
},
}

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors:themtype = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#0a7ea4',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE', //almost white
    background: '#151718', // black
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const MyColor1 = {
  primary: "#3498db",
  _purple: "#CA7DF9",
  _ocean: "#00A5CF",
  _darkPurple: "#470063",
};