
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AttendanceCalendarProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  attendanceRecords: Record<string, Record<string, boolean>>;
  justifiedAbsences?: Record<string, Record<string, boolean>>;
  showAbsences?: boolean;
};

const AttendanceCalendar = ({ 
  selectedDate, 
  onDateChange, 
  attendanceRecords,
  justifiedAbsences = {},
  showAbsences = true
}: AttendanceCalendarProps) => {
  const [absenceDays, setAbsenceDays] = useState<Record<string, number>>({});
  
  useEffect(() => {
    // Calculate days with absence records
    const days: Record<string, number> = {};
    
    // Count students absent for each day (not present and not justified)
    Object.entries(attendanceRecords).forEach(([studentId, studentRecords]) => {
      Object.entries(studentRecords).forEach(([date, isPresent]) => {
        // If not present and not justified, count as absence
        const isJustified = justifiedAbsences[studentId]?.[date] || false;
        
        if (!isPresent && !isJustified) {
          days[date] = (days[date] || 0) + 1;
        }
      });
    });
    
    setAbsenceDays(days);
  }, [attendanceRecords, justifiedAbsences]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário</CardTitle>
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
            hasAbsences: Object.keys(absenceDays).map(day => new Date(day)),
          }}
          modifiersStyles={{
            hasAbsences: { 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderBottom: '2px solid #ef4444' 
            }
          }}
          components={{
            DayContent: ({ date }) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const absenceCount = absenceDays[dateStr];
              
              return (
                <div className="flex flex-col items-center">
                  <span>{format(date, 'd')}</span>
                  {absenceCount > 0 && (
                    <span className="text-[10px] text-red-500 font-medium mt-1">
                      {absenceCount}
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
