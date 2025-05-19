
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import StudentList, { Student } from '@/components/StudentList';
import EnhancedStudentList from '@/components/EnhancedStudentList';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import AttendanceStats from '@/components/AttendanceStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ListCheck, User } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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
  const [justifiedAbsences, setJustifiedAbsences] = useState<Record<string, Record<string, boolean>>>({});
  
  // Handle attendance change
  const handleAttendanceChange = (studentId: string, date: string, isPresent: boolean) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [date]: isPresent
      }
    }));

    // If marking as present or absent, remove any justified absence record
    if (justifiedAbsences[studentId]?.[date]) {
      setJustifiedAbsences(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [date]: false
        }
      }));
    }
  };
  
  // Handle adding a new student
  const handleAddStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };
  
  // Handle justified absence
  const handleJustifiedAbsence = (studentId: string, date: string, isJustified: boolean) => {
    setJustifiedAbsences(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [date]: isJustified
      }
    }));
    
    // If justified, also mark as absent (not present)
    if (isJustified) {
      setAttendanceRecords(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [date]: false
        }
      }));
    }
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
      
      <main className="container mx-auto py-6 px-4">
        <NavigationMenu className="mb-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                Chamada
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => navigate("/gerenciar")}
              >
                Gerenciar
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => navigate("/boletim")}
              >
                Boletim
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1">
            <AttendanceCalendar 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate}
              attendanceRecords={attendanceRecords}
              justifiedAbsences={justifiedAbsences}
              showAbsences={true}
            />
          </div>
          
          <div className="md:col-span-1 lg:col-span-2">
            {/* MOVED: Chamada section to the top */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListCheck className="h-5 w-5" />
                  Chamada
                </CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedStudentList 
                  date={selectedDate}
                  students={students}
                  attendanceRecords={attendanceRecords}
                  onAttendanceChange={handleAttendanceChange}
                  onJustifiedAbsence={handleJustifiedAbsence}
                  justifiedAbsences={justifiedAbsences}
                />
              </CardContent>
            </Card>
            
            {/* MOVED: Attendance stats to the bottom */}
            <div className="mt-6">
              <AttendanceStats 
                students={students} 
                selectedDate={selectedDate}
                attendanceRecords={attendanceRecords}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Turmas;
