import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestionnaireById, type Questionnaire } from '../data/questionnaires';
import { getLanguage } from '../utils/i18n';
import './QuestionnaireCard.css';

interface QuestionnaireCardProps {
  questionnaireId: string;
}

export const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ questionnaireId }) => {
  const navigate = useNavigate();
  const lang = getLanguage();
  const questionnaire = getQuestionnaireById(questionnaireId);
  
  if (!questionnaire) return null;
  
  const handleClick = () => {
    navigate(`/questionnaire/${questionnaireId}`);
  };
  
  return (
    <div className="questionnaire-card" onClick={handleClick}>
      <div className="card-icon">
        {questionnaireId === 'babies' && '👶'}
        {questionnaireId === 'children' && '🧒'}
        {questionnaireId === 'female' && '👩'}
        {questionnaireId === 'male' && '👨'}
      </div>
      <h3>{questionnaire.name[lang]}</h3>
      <div className="card-arrow">→</div>
    </div>
  );
};

