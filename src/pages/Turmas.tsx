import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import StudentList, { Student } from '@/components/StudentList';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import AttendanceStats from '@/components/AttendanceStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ListCheck, User } from "lucide-react";

// Mock data for initial students - reutilizando o código existente
const mockStudents: Student[] = [
  { id: '1', name: 'João Silva', registration: '2023001' },
  { id: '2', name: 'Maria Oliveira', registration: '2023002' },
  { id: '3', name: 'Pedro Santos', registration: '2023003' },
  { id: '4', name: 'Ana Souza', registration: '2023004' },
  { id: '5', name: 'Lucas Ferreira', registration: '2023005' },
];

// Mock data for the report card
const reportCardSections = [
  {
    title: "CURSO ESPECÍFICO",
    backgroundColor: "#ffffff",
    items: [
      { id: 1, name: "MÉDIA DE ATIVIDADES TEÓRICAS", grade: 9.15 },
      { id: 2, name: "MÉDIA DE ATIVIDADES PRÁTICAS", grade: 8.5 }
    ],
    average: 8.83
  },
  {
    title: "CURSO EXTRA",
    backgroundColor: "#e7f0fd",
    items: [
      { id: 1, name: "ESPORTE", grade: 10 },
      { id: 2, name: "FORMAÇÃO HUMANA", grade: 10 },
      { id: 3, name: "INICIAÇÃO DIGITAL", grade: 8 },
      { id: 4, name: "MERCADO DE TRABALHO", grade: 9.5 },
      { id: 5, name: "PRODUÇÃO DE CONTEÚDO E COMUNICAÇÃO PROFISSIONAL", grade: 10 },
      { id: 6, name: "QUALIDADE DE VIDA", grade: 10 },
      { id: 7, name: "AVALIAÇÃO CURSO EXTRA", grade: 10 }
    ],
    average: 10
  },
  {
    title: "PARTICIPAÇÃO E RESPONSABILIDADE",
    backgroundColor: "#F2FCE2",
    items: [
      { id: 1, name: "NOTIFICAÇÕES", grade: 9 },
      { id: 2, name: "PARTICIPAÇÃO", grade: 9.5 }
    ],
    average: 8.6
  },
  {
    title: "AVALIAÇÃO INSTITUCIONAL E ESTÁGIO CULTURAL",
    backgroundColor: "#FEC6A1",
    items: [
      { id: 1, name: "AVALIAÇÃO INSTITUCIONAL", grade: 23 },
      { id: 2, name: "ESTÁGIO CULTURAL", grade: 8.5 }
    ],
    average: 15.75
  },
  {
    title: "TRABALHO DE CONCLUSÃO DE CURSO",
    backgroundColor: "#ffffff",
    items: [
      { id: 1, name: "TCC - TRABALHO TEÓRICO", grade: 9.6 },
      { id: 2, name: "TCC - APRESENTAÇÃO", grade: 9.2 }
    ],
    average: 9.4
  }
];

const Turmas = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Handle attendance change - reutilizando o código existente
  const handleAttendanceChange = (studentId: string, date: string, isPresent: boolean) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [date]: isPresent
      }
    }));
  };
  
  // Handle adding a new student - reutilizando o código existente
  const handleAddStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  // Handle selecting a student for report card view
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    // Não navegamos mais automaticamente aqui, apenas definimos o estado
  };
  
  // Navegação para o boletim em tela cheia
  const navigateToFullReportCard = (studentId: string) => {
    navigate(`/boletim/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-primary">Gerenciamento de Turma</h1>
        </div>
      </header>
      
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1">
            <AttendanceCalendar 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate}
              attendanceRecords={attendanceRecords}
            />
          </div>
          
          <div className="md:col-span-1 lg:col-span-2">
            <AttendanceStats 
              students={students} 
              selectedDate={selectedDate}
              attendanceRecords={attendanceRecords}
            />
            
            <Tabs defaultValue="attendance" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="attendance">
                  <ListCheck className="h-4 w-4 mr-2" />
                  Presenças
                </TabsTrigger>
                <TabsTrigger value="students">
                  <User className="h-4 w-4 mr-2" />
                  Alunos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="attendance" className="mt-4">
                <EnhancedStudentList 
                  date={selectedDate}
                  students={students}
                  attendanceRecords={attendanceRecords}
                  onAttendanceChange={handleAttendanceChange}
                />
              </TabsContent>
              
              <TabsContent value="students" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Alunos</CardTitle>
                    <CardDescription>
                      Total de {students.length} alunos registrados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {students.map(student => (
                        <div 
                          key={student.id} 
                          className="flex justify-between items-center p-3 bg-white border rounded-md hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">Matrícula: {student.registration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Turmas;
