import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

const MembersUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      // Read Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and format data
      const members = jsonData.map((row: any) => ({
        registration_number: String(row.registration_number || row.reg_number || row.reg || '').trim(),
        name: String(row.name || '').trim(),
        email: row.email ? String(row.email).trim() : null,
        phone_number: row.phone_number || row.phone ? String(row.phone_number || row.phone).trim() : null,
        course: row.course ? String(row.course).trim() : null,
        year_of_study: row.year_of_study || row.year ? String(row.year_of_study || row.year).trim() : null,
      })).filter(member => member.registration_number && member.name);

      if (members.length === 0) {
        toast({
          title: "No valid data found",
          description: "Excel file must have 'registration_number' and 'name' columns with data",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      // Mimic upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const additionalMembersRaw = localStorage.getItem("additional_members");
      let additionalMembers = additionalMembersRaw ? JSON.parse(additionalMembersRaw) : [];

      // Upsert logic for local storage
      members.forEach((newMember: any) => {
        const index = additionalMembers.findIndex((m: any) => m.registration_number === newMember.registration_number);
        if (index >= 0) {
          additionalMembers[index] = { ...additionalMembers[index], ...newMember, updated_at: new Date().toISOString() };
        } else {
          additionalMembers.push({
            id: crypto.randomUUID(),
            ...newMember,
            created_at: new Date().toISOString()
          });
        }
      });

      localStorage.setItem("additional_members", JSON.stringify(additionalMembers));

      toast({
        title: "Upload successful!",
        description: `${members.length} members added/updated successfully`,
      });

      setFileName("");
      event.target.value = "";
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading the file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Members List
        </CardTitle>
        <CardDescription>
          Upload an Excel file with member details. Required columns: registration_number, name.
          Optional: email, phone_number, course, year_of_study
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            id="excel-upload"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <label
            htmlFor="excel-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading {fileName}...</p>
              </>
            ) : fileName ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-sm font-medium">File uploaded successfully!</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload Excel file or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">XLSX or XLS (Max 10MB)</p>
              </>
            )}
          </label>
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm">
          <h4 className="font-semibold mb-2">Excel Format Example:</h4>
          <table className="w-full text-xs border">
            <thead className="bg-background">
              <tr>
                <th className="border p-1">registration_number</th>
                <th className="border p-1">name</th>
                <th className="border p-1">email</th>
                <th className="border p-1">phone_number</th>
                <th className="border p-1">course</th>
                <th className="border p-1">year_of_study</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">CS/001/2024</td>
                <td className="border p-1">John Doe</td>
                <td className="border p-1">john@example.com</td>
                <td className="border p-1">+254712345678</td>
                <td className="border p-1">Computer Science</td>
                <td className="border p-1">Year 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersUpload;
