
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AttendanceCalendarProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  attendanceRecords: Record<string, Record<string, boolean>>;
};

const AttendanceCalendar = ({ selectedDate, onDateChange, attendanceRecords }: AttendanceCalendarProps) => {
  const [attendanceDays, setAttendanceDays] = useState<Record<string, number>>({});
  
  useEffect(() => {
    // Calculate days with attendance records
    const days: Record<string, number> = {};
    
    // Count students present for each day
    Object.values(attendanceRecords).forEach(studentRecords => {
      Object.entries(studentRecords).forEach(([date, isPresent]) => {
        if (isPresent) {
          days[date] = (days[date] || 0) + 1;
        }
      });
    });
    
    setAttendanceDays(days);
  }, [attendanceRecords]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Presença</CardTitle>
        <CardDescription>
          Selecione uma data para gerenciar a presença
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          className="rounded-md border p-3 pointer-events-auto"
          locale={ptBR}
          modifiers={{
            hasAttendance: Object.keys(attendanceDays).map(day => new Date(day)),
          }}
          modifiersStyles={{
            hasAttendance: { 
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderBottom: '2px solid var(--primary)' 
            }
          }}
          components={{
            DayContent: ({ date }) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const attendanceCount = attendanceDays[dateStr];
              
              return (
                <div className="flex flex-col items-center">
                  <span>{format(date, 'd')}</span>
                  {attendanceCount > 0 && (
                    <span className="text-[10px] text-primary font-medium mt-1">
                      {attendanceCount}
                    </span>
                  )}
                </div>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
