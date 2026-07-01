import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, TextArea, Select } from './ui/Input';
import Button from './ui/Button';

// Setup validation schema using Zod
const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Please select a priority' }),
  }),
  category: z.enum(['Personal', 'Work', 'Study', 'Shopping', 'Health', 'Others'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  status: z.enum(['Pending', 'Completed']).optional(),
  dueDate: z.string().refine((val) => {
    if (!val) return false;
    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }, { message: 'Due date cannot be in the past' }),
});

const TaskForm = ({ onSubmit, initialData = null, loading = false }) => {
  const isEditMode = !!initialData;

  // Format date to YYYY-MM-DD for HTML input
  const formatInputDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const defaultValues = isEditMode
    ? {
        title: initialData.title,
        description: initialData.description || '',
        priority: initialData.priority,
        category: initialData.category,
        status: initialData.status,
        dueDate: formatInputDate(initialData.dueDate),
      }
    : {
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Work',
        dueDate: '',
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  const categoryOptions = [
    { label: 'Personal', value: 'Personal' },
    { label: 'Work', value: 'Work' },
    { label: 'Study', value: 'Study' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Health', value: 'Health' },
    { label: 'Others', value: 'Others' },
  ];

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
      <Input
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextArea
        label="Description"
        placeholder="Describe the task details (optional)"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />

        <Select
          label="Category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        {isEditMode && (
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        )}
      </div>

      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-end">
        <Button type="submit" loading={loading} className="w-full sm:w-auto px-8">
          {isEditMode ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
