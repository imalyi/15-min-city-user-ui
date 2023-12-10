import React from 'react';
import Roles from './Roles';
import Modal from 'react-modal';

const RolesModal = ({ isOpen, onRequestClose, onSelectRole }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Role"
    >
      <Roles onSelectRole={onSelectRole} />
    </Modal>
  );
};

export default RolesModal;
