import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

const ImportDataButton = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-hotels');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success(`Data imported successfully! Hotels: ${data.imported.hotels}, Bed Types: ${data.imported.bedTypes}, Prices: ${data.imported.prices}`);
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Failed to import data: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button 
      onClick={handleImport}
      disabled={isImporting}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isImporting ? 'Importing...' : 'Import Hotel Data'}
    </Button>
  );
};

export default ImportDataButton;
