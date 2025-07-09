import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Prediction } from '../types';

interface NextDayPredictionProps {
  predictions: Prediction[];
  endDate: string;
  model: string;
}

const NextDayPrediction: React.FC<NextDayPredictionProps> = ({
  predictions,
  endDate,
  model
}) => {
  const getNextDayPrediction = () => {
    if (predictions.length === 0 || !endDate) return null;

    const filteredPredictions = predictions.filter(p => {
      const predDate = new Date(p.date);
      const filterDate = new Date(endDate);
      return predDate <= filterDate;
    });

    if (filteredPredictions.length === 0) return null;

    const lastPrediction = filteredPredictions[filteredPredictions.length - 1];
    
    const nextDate = new Date(endDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateString = nextDate.toISOString().split('T')[0];
    
    const nextDayPrediction = predictions.find(p => {
      const predDate = new Date(p.date).toISOString().split('T')[0];
      return predDate === nextDateString;
    });
    
    let predictedValue;
    
    if (nextDayPrediction) {
      predictedValue = nextDayPrediction.predicted;
    } else {
      predictedValue = lastPrediction.predicted;
    }
    
    const result = {
      date: nextDate.toISOString().split('T')[0],
      predicted: predictedValue,
      baseDate: lastPrediction.date,
      baseValue: lastPrediction.predicted
    };
    
    return result;
  };

  const nextDayData = getNextDayPrediction();

  if (!nextDayData || !endDate) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); 
    
    const formatted = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return formatted;
  };

  const formatEndDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-info text-white">
        <div className="d-flex align-items-center">
          <i className="bi bi-calendar-plus me-2"></i>
          <h6 className="mb-0">Previsão para o Próximo Dia - Modelo {model.toUpperCase()}</h6>
        </div>
      </Card.Header>
      
      <Card.Body>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="text-center">
              <h4 className="text-info mb-2">
                <i className="bi bi-calendar-event me-2"></i>
                {formatDate(nextDayData.date)}
              </h4>
              <p className="text-muted mb-0">
                Próximo dia após {formatEndDate(endDate)}
              </p>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="text-center">
              <h3 className="text-success mb-2">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                {nextDayData.predicted.toFixed(2)} kWh
              </h3>
              <p className="text-muted mb-0">
                Energia prevista para o próximo dia
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-3" />

        <Row>
          <Col md={12}>
            <div className="alert alert-light mb-0">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                <strong>Dados Detalhados:</strong> Previsão para o dia seguinte à data final escolhida ({formatEndDate(endDate)}) 
                baseada nos dados históricos disponíveis.
              </small>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default NextDayPrediction;
