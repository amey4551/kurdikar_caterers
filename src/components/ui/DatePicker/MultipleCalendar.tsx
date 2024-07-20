import { useState, forwardRef } from 'react';
import dayjs from 'dayjs';
import { isSameDate } from './utils/isSameDate';
import CalendarBase from './CalendarBase';
import type { CommonProps } from '../@types/common';
import type { CalendarSharedProps } from './CalendarBase';
import type { Modifiers } from './tables/components/types';

export interface MultipleSelectCalendarProps
    extends CommonProps,
        Omit<CalendarSharedProps, 'value' | 'isDateInRange'> {
    value: [Date | null, Date | null][];
    events: any[];
    singleDate?: boolean;
    multiple: boolean
}

const MultipleSelectCalendar = forwardRef<HTMLDivElement, MultipleSelectCalendarProps>(
    (props, ref) => {
        const {
            value,
            events,
            dayStyle,
            singleDate = false,
            dateViewCount = 1,
            paginateBy,
            ...rest
        } = props;

        const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
        const [selectedDates, setSelectedDates] = useState<[Date, Date][]>([]);

        const toggleDateSelection = (date: Date) => {
            const isDateSelected = selectedDates.some(([startDate, endDate]) => {
                if (startDate && endDate) {
                    return isSameDate(startDate, date) || isSameDate(endDate, date);
                }
                return false;
            });

            if (isDateSelected) {
                setSelectedDates(selectedDates.filter(([startDate, endDate]) => {
                    if (startDate && endDate) {
                        return !(isSameDate(startDate, date) || isSameDate(endDate, date));
                    }
                    return false;
                }));
            } else {
                const newRange = events.find((event) => {
                    const startDate = dayjs(event.startDate).toDate();
                    const endDate = dayjs(event.endDate).toDate();
                    return isSameDate(startDate, date) || isSameDate(endDate, date);
                });

                if (newRange) {
                    setSelectedDates([...selectedDates, [newRange.startDate, newRange.endDate]]);
                }
            }
        };

        const shouldHighlightDate = (date: Date, modifiers: Modifiers) => {
            return selectedDates.some(([startDate, endDate]) => {
                if (startDate && endDate) {
                    return isSameDate(startDate, date) || isSameDate(endDate, date);
                }
                return false;
            });
        };

        const isDateInRange = (date: Date, modifiers: Modifiers) => {
            return selectedDates.some(([startDate, endDate]) => {
                if (startDate && endDate) {
                    return isSameDate(startDate, date) || isSameDate(endDate, date);
                }
                return false;
            });
        };

        return (
            <CalendarBase
                ref={ref}
                dayStyle={dayStyle}
                value={selectedDates.flat()}
                range={value as unknown as [Date, Date]}
                dateViewCount={dateViewCount}
                paginateBy={paginateBy || dateViewCount}
                hideOutOfMonthDates={dateViewCount > 1}
                isDateInRange={isDateInRange}
                onDayMouseEnter={(date) => setHoveredDay(date)}
                {...rest}
            />
        );
    }
);

MultipleSelectCalendar.displayName = 'MultipleSelectCalendar';

export default MultipleSelectCalendar;
