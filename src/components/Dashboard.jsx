import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Upload, 
  Activity,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import our custom components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

const HealthcareDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    file: null
  });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Generate age options from 1 to 100
  const ageOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  const addAlert = (alert) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { ...alert, id }]);
    if (!alert.persistent) {
      setTimeout(() => {
        removeAlert(id);
      }, 5000);
    }
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      age: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addAlert({
          variant: 'error',
          title: 'File too large',
          description: 'Please select a file smaller than 5MB',
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        file: file
      }));
      setFileName(file.name);
      addAlert({
        variant: 'success',
        description: 'File uploaded successfully',
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    if (!formData.age) {
      errors.push('Age is required');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => {
        addAlert({
          variant: 'error',
          description: error,
        });
      });
      return;
    }
  
    setIsLoading(true);
  
    // Use the formData state instead of getting values from e.target
    const submitFormData = new FormData();
    submitFormData.append('name', formData.name.trim());
    submitFormData.append('age', formData.age);
    
    if (formData.file) {
      submitFormData.append('file', formData.file);
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/submit', {
        method: 'POST',
        body: submitFormData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit patient data');
      }
  
      // Success handling
      addAlert({
        variant: 'success',
        title: 'Success!',
        description: 'Patient information submitted successfully',
        persistent: true,
      });
  
      // Reset form
      setFormData({ name: '', age: '', file: null });
      setFileName('');
      setCurrentStep(1); // Reset to first step
  
    } catch (error) {
      addAlert({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to submit patient information. Please try again.',
      });
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formSteps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Medical Records', icon: FileText },
    { number: 3, title: 'Profile Review', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Alerts Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 min-w-[320px]">
        <AnimatePresence>
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <Alert 
                variant={alert.variant}
                dismissible
                onDismiss={() => removeAlert(alert.id)}
              >
                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Healthcare Dashboard
            </CardTitle>
            
            {/* Progress Steps */}
<div className="flex justify-between items-center mt-6">
  {formSteps.map((step, index) => (
    <div key={step.number} className="flex items-center">
      <div className="relative">
        <motion.div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center 
            transition-all duration-300
            ${
              currentStep >= step.number
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }
          `}
          whileHover={{ scale: 1.05 }}
        >
          <step.icon className="w-5 h-5" />
        </motion.div>
        <div className={`absolute -bottom-10 left-6 transform -translate-x-1/2 text-sm font-medium text-gray-600 `}  >
          {step.title}
        </div>
      </div>
      {index < formSteps.length - 1 && (
        <div
          className={`
            h-[2px] w-56 mx-2 transition-all duration-300
            ${currentStep > step.number ? 'bg-blue-500' : 'bg-gray-200'}
          `}
        />
      )}
    </div>
  ))}
</div>

          </CardHeader>

          <CardContent className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  Patient Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  className="w-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="age" className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Age
                </Label>
                <Select onValueChange={handleAgeChange} value={formData.age}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map(age => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="file" className="flex items-center gap-2 text-gray-700">
                  <FileText className="h-4 w-4" />
                  Medical Records
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full flex items-center gap-2 hover:bg-blue-50"
                      onClick={() => document.getElementById('file').click()}
                    >
                      <Upload className="h-4 w-4" />
                      {fileName || 'Choose file'}
                    </Button>
                  </div>
                  {fileName && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected file: {fileName}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </motion.div>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HealthcareDashboard;