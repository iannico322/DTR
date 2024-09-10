import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from 'react-to-print'; 

type TimeRecord = {
  date: string;
  timeIn: string;
  breakOut: string;
  breakIn: string;
  timeOut: string;
  totalHours: string;
};



// Helper function to get the week number within a month from a date
const getWeekNumberWithinMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = startOfMonth.getDay();
  return Math.ceil((date.getDate() + day) / 7);
};

// Helper function to get the month name from a date
const getMonthName = (monthIndex: number) => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString('default', { month: 'long' });
};

export default function Page1() {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Partial<TimeRecord>>({});
  const [status, setStatus] = useState<'out' | 'in' | 'break'>('out');
  const printableRef = useRef<HTMLDivElement>(null); // Use ref for printing
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    const storedRecords = localStorage.getItem('timeRecords');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  const handleTimeAction = (action: 'in' | 'out' | 'breakIn' | 'breakOut') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();

    if (action === 'in') {
      setCurrentRecord({ date: dateString, timeIn: timeString });
      setStatus('in');
    } else if (action === 'breakOut') {
      setCurrentRecord({ ...currentRecord, breakOut: timeString });
      setStatus('break');
    } else if (action === 'breakIn') {
      setCurrentRecord({ ...currentRecord, breakIn: timeString });
      setStatus('in');
    } else if (action === 'out') {
      const timeOut = timeString;
      const timeIn = new Date(`${dateString} ${currentRecord.timeIn}`);
      const breakOut = currentRecord.breakOut ? new Date(`${dateString} ${currentRecord.breakOut}`) : null;
      const breakIn = currentRecord.breakIn ? new Date(`${dateString} ${currentRecord.breakIn}`) : null;

      let totalMilliseconds = now.getTime() - timeIn.getTime();
      if (breakOut && breakIn) {
        totalMilliseconds -= breakIn.getTime() - breakOut.getTime();
      }

      const totalHours = (totalMilliseconds / (1000 * 60 * 60)).toFixed(2);

      const newRecord: TimeRecord = {
        ...currentRecord as TimeRecord,
        timeOut,
        totalHours,
      };
      const updatedRecords = [...records, newRecord];
      setRecords(updatedRecords);
      localStorage.setItem('timeRecords', JSON.stringify(updatedRecords));
      
      setCurrentRecord({});
      setStatus('out');
    }
  };

 const handlePrint = useReactToPrint({
  content: () => printableRef.current,
});

 

  // Calculate the available months from the records
  const months = Array.from(new Set(records.map(record => new Date(record.date).getMonth())));

  // Calculate the available weeks for the selected month
  const weeks = selectedMonth !== null
    ? Array.from(new Set(records
      .filter(record => new Date(record.date).getMonth() === selectedMonth)
      .map(record => getWeekNumberWithinMonth(new Date(record.date)))
    ))
    : [];

  // Filter records by the selected month and week
  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const isSameMonth = selectedMonth === null || recordDate.getMonth() === selectedMonth;
    const isSameWeek = selectedWeek === null || getWeekNumberWithinMonth(recordDate) === selectedWeek;
    return isSameMonth && isSameWeek;
  });

 

  

  return (
    <Card className="w-full max-w-4xl mx-auto mt-[100px] mb-[100px] ">
      <CardHeader>
        <CardTitle>Daily Time Record System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center sm:overflow-auto sm:flex-wrap gap-3  mb-6">
          <Button onClick={() => handleTimeAction('in')} disabled={status !== 'out'}>Time In</Button>
          <Button onClick={() => handleTimeAction('breakOut')} disabled={status !== 'in'}>Break Out</Button>
          <Button onClick={() => handleTimeAction('breakIn')} disabled={status !== 'break'}>Break In</Button>
          <Button onClick={() => handleTimeAction('out')} disabled={status === 'out'}>Time Out</Button>
          <Button onClick={handlePrint}>Print Records</Button>
        </div>
        {/* Month Selector */}
        
        <div className="mb-4">
          <label htmlFor="monthSelect" className="mr-2">Select Month:</label>
          <select
            id="monthSelect"
            onChange={(e) => {
              setSelectedMonth(e.target.value ? parseInt(e.target.value, 10) : null);
              setSelectedWeek(null); // Reset week selection when month changes
            }}
            className="border p-2"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
        </div>
        {/* Week Selector */}
        {selectedMonth !== null && (
          <div className="mb-4">
            <label htmlFor="weekSelect" className="mr-2">Select Week:</label>
            <select
              id="weekSelect"
              onChange={(e) => setSelectedWeek(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="border p-2"
            >
              <option value="">All Weeks</option>
              {weeks.map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </div>
        )}
        <div ref={printableRef} id="printableArea">

          <h1 className=' text-lg font-bold text-center py-5'>Alvin Nuska PDO-1</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Break Out</TableHead>
                <TableHead>Break In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.timeIn}</TableCell>
                  <TableCell>{record.breakOut || '-'}</TableCell>
                  <TableCell>{record.breakIn || '-'}</TableCell>
                  <TableCell>{record.timeOut}</TableCell>
                  <TableCell>{record.totalHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center">
       
         
          
        </div>
      </CardContent>
    </Card>
  );
}
