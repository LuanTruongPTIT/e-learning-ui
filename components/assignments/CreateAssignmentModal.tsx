'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { assignmentApi, CreateAssignmentRequest } from '@/apis/assignments';
import { toast } from 'react-hot-toast';

// Validation Schema
const assignmentSchema = z.object({
  teaching_assign_course_id: z.string().min(1, 'Course is required'),
  title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
  description: z.string().optional(),
  deadline: z.date({ required_error: 'Deadline is required' }),
  assignment_type: z.enum(['upload', 'quiz', 'both']),
  show_answers: z.boolean().default(false),
  time_limit_minutes: z.number().optional(),
  max_score: z.number().min(0).max(1000).default(100),
  is_published: z.boolean().default(true),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface CreateAssignmentModalProps {
  courseId: string;
  courseName: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateAssignmentModal({ 
  courseId, 
  courseName, 
  onSuccess,
  trigger 
}: CreateAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      teaching_assign_course_id: courseId,
      title: '',
      description: '',
      assignment_type: 'upload',
      show_answers: false,
      max_score: 100,
      is_published: true,
    },
  });

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      setIsLoading(true);
      
      const requestData: CreateAssignmentRequest = {
        ...data,
        deadline: data.deadline.toISOString(),
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      };

      const response = await assignmentApi.createAssignment(requestData);
      
      if (response.status === 201) {
        toast.success('Assignment created successfully!');
        setOpen(false);
        form.reset();
        setAttachmentUrls([]);
        onSuccess?.();
      } else {
        toast.error(response.message || 'Failed to create assignment');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Mock file upload - in real app, upload to server and get URLs
      const newUrls = Array.from(files).map(file => 
        `https://example.com/uploads/${file.name}`
      );
      setAttachmentUrls(prev => [...prev, ...newUrls]);
      toast.success(`${files.length} file(s) uploaded`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachmentUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Course: {courseName}
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Enter assignment title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Enter assignment description"
              rows={4}
            />
          </div>

          {/* Assignment Type & Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignment Type */}
            <div className="space-y-2">
              <Label>Assignment Type *</Label>
              <Select
                value={form.watch('assignment_type')}
                onValueChange={(value: 'upload' | 'quiz' | 'both') => 
                  form.setValue('assignment_type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">File Upload</SelectItem>
                  <SelectItem value="quiz">Quiz Only</SelectItem>
                  <SelectItem value="both">Upload + Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Score */}
            <div className="space-y-2">
              <Label htmlFor="max_score">Max Score *</Label>
              <Input
                id="max_score"
                type="number"
                min="0"
                max="1000"
                {...form.register('max_score', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Deadline & Time Limit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('deadline') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('deadline') ? (
                      format(form.watch('deadline'), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch('deadline')}
                    onSelect={(date) => date && form.setValue('deadline', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.deadline && (
                <p className="text-sm text-red-500">{form.formState.errors.deadline.message}</p>
              )}
            </div>

            {/* Time Limit (for quiz) */}
            {(form.watch('assignment_type') === 'quiz' || form.watch('assignment_type') === 'both') && (
              <div className="space-y-2">
                <Label htmlFor="time_limit_minutes">Time Limit (minutes)</Label>
                <Input
                  id="time_limit_minutes"
                  type="number"
                  min="1"
                  placeholder="e.g., 60"
                  {...form.register('time_limit_minutes', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload files</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>

            {/* Attachment List */}
            {attachmentUrls.length > 0 && (
              <div className="space-y-2">
                {attachmentUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate">{url.split('/').pop()}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show_answers">Show Answers After Submission</Label>
              <Switch
                id="show_answers"
                checked={form.watch('show_answers')}
                onCheckedChange={(checked) => form.setValue('show_answers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_published">Publish Immediately</Label>
              <Switch
                id="is_published"
                checked={form.watch('is_published')}
                onCheckedChange={(checked) => form.setValue('is_published', checked)}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
