import { Calendar, LocaleConfig } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';

const CalendarUi = ({ currentDateString, markedDates, selectedDate, handleSelected, isDark, t }) => {
  return (
    <Calendar
    
      current={currentDateString}
      markedDates={{ ...markedDates, [selectedDate || '']: { selected: true } }}
      onDayPress={handleSelected}
      renderArrow={(direction: string) => {
        return direction === 'right' ? (
          <FontAwesome
            name="chevron-right"
            size={18}
            color={isDark ? 'white' : 'black'}
          />
        ) : (
          <FontAwesome
            name="chevron-left"
            size={18}
            color={isDark ? 'white' : 'black'}
          />
        );
      }}
      enableSwipeMonths={true}
      markingType="multi-dot"
      theme={{
        dayTextColor: isDark ? 'white' : 'black',
        textDayHeaderFontWeight: '900',
        textMonthFontWeight: '900',
        textMonthFontSize: 20,
        textDayFontSize: 16,
        calendarBackground: isDark ? '#111' : 'white',
        monthTextColor: isDark ? 'white' : 'black',
        textMonth: t('calendar.monthNames'),
        textDayNames: t('calendar.dayNames'),
      }}
      style={{
        marginHorizontal: 10,
      }}
    />
  );
}

export default CalendarUi;



LocaleConfig.locales.jp = {
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  };
  LocaleConfig.defaultLocale = 'jp';