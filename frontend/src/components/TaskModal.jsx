import React from 'react';
import Modal from './ui/Modal';
import TaskForm from './TaskForm';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const isEditMode = !!initialData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task Details' : 'Add New Task'}
      size="md"
    >
      <TaskForm onSubmit={onSubmit} initialData={initialData} loading={loading} />
    </Modal>
  );
};

export default TaskModal;
