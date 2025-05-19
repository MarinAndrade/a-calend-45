
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import StudentList, { Student } from '@/components/StudentList';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import AttendanceStats from '@/components/AttendanceStats';
import StudentForm from '@/components/StudentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ListCheck, User, FileText } from "lucide-react";

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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="attendance">
                  <ListCheck className="h-4 w-4 mr-2" />
                  Presenças
                </TabsTrigger>
                <TabsTrigger value="students">
                  <User className="h-4 w-4 mr-2" />
                  Alunos
                </TabsTrigger>
                <TabsTrigger value="add-student">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Adicionar Aluno
                </TabsTrigger>
                <TabsTrigger value="report-card">
                  <FileText className="h-4 w-4 mr-2" />
                  Boletim
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="attendance" className="mt-4">
                <StudentList 
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
                          className="flex justify-between items-center p-3 bg-white border rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectStudent(student)}
                        >
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">Matrícula: {student.registration}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleSelectStudent(student);
                            }}>
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Boletim
                            </Button>
                            <Button variant="outline" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              navigateToFullReportCard(student.id);
                            }}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Tela Completa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="add-student" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Novo Aluno</CardTitle>
                    <CardDescription>
                      Preencha os dados para adicionar um novo aluno à lista
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StudentForm onAddStudent={handleAddStudent} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="report-card" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Boletim Escolar</CardTitle>
                      <CardDescription>
                        {selectedStudent 
                          ? `Visualizando boletim de ${selectedStudent.name}`
                          : 'Selecione um aluno na aba "Alunos" para visualizar o boletim'}
                      </CardDescription>
                    </div>
                    {selectedStudent && (
                      <Button variant="outline" size="sm" onClick={() => navigateToFullReportCard(selectedStudent.id)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver em Tela Completa
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedStudent ? (
                      <div className="max-h-[600px] overflow-y-auto pr-2">
                        <StudentReportCard 
                          studentName={selectedStudent.name}
                          sections={reportCardSections}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Nenhum aluno selecionado</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/boletim')} 
                          className="mt-4"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ir para página de boletins
                        </Button>
                      </div>
                    )}
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
