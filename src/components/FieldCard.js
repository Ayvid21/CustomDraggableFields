import React from 'react';

const FieldCard = ({ title, subtitle }) => {
  return (
    <div className="field">
    <div className="field-title">{title}</div>
    <div className="field-subtitle">{subtitle}</div>
  </div>
  );
}

export default FieldCard;
