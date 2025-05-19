
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Student } from "./StudentList";
import { useEffect } from "react";

type AttendanceStatus = 'present' | 'absent' | 'justified';

type EnhancedStudentListProps = {
  date: Date;
  students: Student[];
  attendanceRecords: Record<string, Record<string, boolean>>;
  onAttendanceChange: (studentId: string, date: string, isPresent: boolean) => void;
};

const EnhancedStudentList = ({ date, students, attendanceRecords, onAttendanceChange }: EnhancedStudentListProps) => {
  const dateStr = date.toISOString().split('T')[0];
  
  // Set all students as present by default when the component mounts or date changes
  useEffect(() => {
    students.forEach(student => {
      // Only set as present if there's no record for this date yet
      if (attendanceRecords[student.id]?.[dateStr] === undefined) {
        onAttendanceChange(student.id, dateStr, true);
      }
    });
  }, [students, dateStr, onAttendanceChange]);
  
  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    // Present = true, Absent = false, Justified = special case handled in Turmas component
    const isPresent = status === 'present';
    
    onAttendanceChange(studentId, dateStr, isPresent);
    
    let message = "";
    switch (status) {
      case 'present':
        message = "Presença registrada";
        break;
      case 'absent':
        message = "Falta registrada";
        break;
      case 'justified':
        message = "Falta justificada registrada";
        break;
    }
    
    toast(message, {
      description: `Aluno: ${students.find(s => s.id === studentId)?.name}`,
    });
  };
  
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableCaption>Lista de presença para {date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-center">Presente</TableHead>
            <TableHead className="text-center">Falta</TableHead>
            <TableHead className="text-center">Justificado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const isPresent = attendanceRecords[student.id]?.[dateStr] || false;
            
            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={isPresent}
                    onCheckedChange={() => handleAttendanceChange(student.id, 'present')}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={!isPresent}
                    onCheckedChange={() => handleAttendanceChange(student.id, 'absent')}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    onCheckedChange={() => handleAttendanceChange(student.id, 'justified')}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Nenhum aluno encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnhancedStudentList;
